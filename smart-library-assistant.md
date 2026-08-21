# Smart Library Assistant — Project Design Document

## 1. Problem Statement

Students need a fast way to search for books, check availability, understand
borrowing/fine rules, and get library information — without manually browsing
a catalog or reading policy documents. A conversational AI assistant, backed
by a structured library database, can interpret natural-language questions
("Do you have books on machine learning?", "Show me something by Andrew Ng")
and resolve the user's *intent*, not just keyword matches, including queries
with multiple conditions ("available Java books in the CS section under 300
pages").

## 2. High-Level Architecture

```
┌────────────────────┐     ┌──────────────────────┐     ┌───────────────────────┐
│  UI (designed in    │────▶│  Chat / App Frontend │────▶│   NLU / Intent Layer   │
│  Google Stitch,     │◀────│  (React / Next.js)   │◀────│  (DeepSeek via NVIDIA) │
│  built with its     │     │  + Supabase client SDK│     └──────────┬────────────┘
│  exported code)     │     └──────────────────────┘                │
└────────────────────┘                 │                            ▼
                                        │              ┌─────────────────────────┐
                                        │              │   Query Resolver /       │
                                        │              │   Function Router        │
                                        │              │   (Supabase Edge Fn or   │
                                        │              │    backend service)      │
                                        │              └──────────┬──────────────┘
                                        │                          │
                                        ▼                          ▼
                          ┌─────────────────────────────────────────────────┐
                          │                 Supabase Backend                  │
                          │  ┌───────────────┐ ┌──────────────┐ ┌──────────┐ │
                          │  │ Postgres DB    │ │ Auth (student │ │ Storage  │ │
                          │  │ (books, loans, │ │ login/roles)  │ │ (ebook   │ │
                          │  │ rules, members)│ │               │ │ files)   │ │
                          │  └───────────────┘ └──────────────┘ └──────────┘ │
                          │  Row Level Security · Realtime · Edge Functions   │
                          └───────────────────────────────────────────────────┘
```

**Design principle:** the LLM (DeepSeek) is used purely as an *NLU + response
generation* layer, not as the source of factual answers. All facts (book
availability, due dates, fine amounts) come from Supabase (Postgres) via
the client SDK or an Edge Function, so the bot never hallucinates library
data. Stitch is used only at the design stage to produce the UI/UX
(screens, components, layout) — its exported HTML/React/Figma-style output
is then wired to Supabase and the chat logic described below.

## 3. Database Schema (Relational)

```sql
-- Core catalog
CREATE TABLE books (
    book_id       TEXT PRIMARY KEY,
    title         TEXT NOT NULL,
    author        TEXT NOT NULL,
    category      TEXT,          -- e.g. Fiction, Technology, Science
    subject       TEXT,          -- e.g. Machine Learning, Java, History
    isbn          TEXT,
    edition       TEXT,
    total_copies  INTEGER NOT NULL,
    available_copies INTEGER NOT NULL,
    shelf_section TEXT,          -- e.g. "CS-3", "Fiction-A2"
    is_digital    BOOLEAN DEFAULT FALSE,
    digital_link  TEXT
);

-- Members
CREATE TABLE members (
    member_id     TEXT PRIMARY KEY,
    name          TEXT,
    membership_type TEXT,        -- student, faculty, guest
    max_books_allowed INTEGER,
    max_days_allowed  INTEGER,
    active        BOOLEAN DEFAULT TRUE
);

-- Borrowing / loan records
CREATE TABLE loans (
    loan_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id       TEXT REFERENCES books(book_id),
    member_id     TEXT REFERENCES members(member_id),
    issue_date    DATE,
    due_date      DATE,
    return_date   DATE,
    fine_amount   REAL DEFAULT 0
);

-- Rules (config-style table, easy to edit without code changes)
CREATE TABLE rules (
    rule_key      TEXT PRIMARY KEY,   -- e.g. 'fine_per_day', 'library_open_time'
    rule_value    TEXT NOT NULL,
    description   TEXT
);
```

Sample `rules` rows:

| rule_key | rule_value | description |
|---|---|---|
| fine_per_day | 5 | Fine in ₹ per day after due date |
| max_books_student | 3 | Max books a student can borrow |
| max_days_student | 14 | Loan period in days |
| library_open_time | 08:00 | Opening time |
| library_close_time | 20:00 | Closing time |
| renewal_limit | 2 | Max renewals per book |

### 3.1 Supabase-Specific Setup

Since the backend runs on Supabase, this schema is created directly through
the **Supabase SQL Editor** (or a migration file tracked with the Supabase
CLI). A few Supabase-native pieces to add on top of the plain schema above:

- **Auth**: use Supabase Auth for student/faculty login. Add a
  `profiles` table keyed on `auth.users.id` to store `membership_type`,
  linked to the `members` table (or merge `members` into `profiles`).
- **Row Level Security (RLS)**: enable RLS on `loans` and `members` so a
  student can only read/update their own rows:
  ```sql
  alter table loans enable row level security;

  create policy "Users can view their own loans"
  on loans for select
  using (auth.uid()::text = member_id);
  ```
  `books` and `rules` can stay publicly readable (RLS enabled with a
  permissive `select` policy for `anon`/`authenticated` roles) since catalog
  data isn't sensitive.
- **Storage**: use a Supabase Storage bucket (e.g. `ebooks`) for digital
  resource files, and store the signed URL or path in `books.digital_link`.
- **Edge Functions**: put the "Query Resolver / Function Router" logic
  (dynamic filter building, fine calculation, DeepSeek calls) in a Supabase
  Edge Function (Deno/TypeScript) so the frontend never talks to the
  NVIDIA API key directly — the key stays server-side as a Supabase secret
  (`supabase secrets set NVIDIA_API_KEY=...`).
- **Realtime** (optional): subscribe the frontend to `books` table changes
  so "available copies" updates live in the chat UI when another student
  returns a book.

## 4. Intent Categories

| Intent | Example Query | Resolver Action |
|---|---|---|
| `search_by_subject` | "Do you have books on machine learning?" | `SELECT * FROM books WHERE subject ILIKE '%machine learning%'` |
| `search_by_author` | "Show me something by Andrew Ng" | `SELECT * FROM books WHERE author ILIKE '%Andrew Ng%'` |
| `search_by_category_location` | "Where can I find Java books?" | join category/subject + return `shelf_section` |
| `check_availability` | "Is 'Clean Code' available?" | check `available_copies > 0` |
| `multi_condition_search` | "Available Python books published after 2020 in the CS section" | dynamic WHERE clause builder |
| `borrowing_rules` | "How many books can I borrow?" | lookup `rules` table by membership type |
| `due_date_fine` | "What's the fine if I return late?" | lookup `fine_per_day`, compute per loan |
| `renewal` | "Can I renew this book?" | check `renewal_limit` vs loan history |
| `library_timings` | "What time does the library close?" | lookup `rules` table |
| `digital_resources` | "Is this book available as an ebook?" | check `is_digital` / `digital_link` |
| `membership_info` | "How do I get a library membership?" | static/rules-driven FAQ answer |
| `general_smalltalk` | "Hi", "Thanks" | direct LLM response, no DB call |

## 5. NLU Strategy — Intent + Slot Extraction

Rather than keyword matching, use the LLM in **structured output / function-
calling mode** to extract intent and slots (entities) from free text. This
lets it generalize across phrasing ("Java books", "anything on Java
programming", "Java section") while still producing a machine-usable query.

Example system prompt for the extraction step:

```
You are the NLU layer of a library chatbot. Given a user message, output
ONLY a JSON object with this shape, and nothing else:

{
  "intent": "<one of: search_by_subject, search_by_author, search_by_category_location,
             check_availability, multi_condition_search, borrowing_rules,
             due_date_fine, renewal, library_timings, digital_resources,
             membership_info, general_smalltalk>",
  "filters": {
    "title": null,
    "author": null,
    "subject": null,
    "category": null,
    "availability": null,
    "shelf_section": null,
    "is_digital": null
  },
  "raw_query": "<original user text>"
}

Only fill filters you are confident about; leave others null.
```

The backend then converts non-null filters into a parameterized SQL query
(never string-concatenated, to avoid injection) and executes it against the
`books` table. Results are passed back to the LLM only for **natural-language
phrasing** of the answer — not for generating the facts themselves.

## 6. Multi-Condition Query Handling

Example: *"Show me available Python books in the Computer Science section
published after 2020."*

Extracted filters:
```json
{
  "subject": "Python",
  "category": "Computer Science",
  "availability": true,
  "published_after": 2020
}
```

Dynamic SQL builder (Python, illustrative):

```python
def build_query(filters: dict):
    clauses, params = [], []
    if filters.get("subject"):
        clauses.append("subject ILIKE %s")
        params.append(f"%{filters['subject']}%")
    if filters.get("category"):
        clauses.append("category ILIKE %s")
        params.append(f"%{filters['category']}%")
    if filters.get("availability"):
        clauses.append("available_copies > 0")
    if filters.get("published_after"):
        clauses.append("publish_year > %s")
        params.append(filters["published_after"])

    where = " AND ".join(clauses) if clauses else "1=1"
    query = f"SELECT * FROM books WHERE {where}"
    return query, params
```

## 7. LLM Integration (NVIDIA-hosted DeepSeek, called from a Supabase Edge Function)

**Security note:** never hardcode the API key, and never call the NVIDIA API
directly from the frontend. Put this logic in a **Supabase Edge Function**
(Deno runtime) so the key stays server-side as a Supabase secret.

```ts
// supabase/functions/library-chat/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const NVIDIA_API_KEY = Deno.env.get("NVIDIA_API_KEY")!; // set via `supabase secrets set`
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function callDeepSeek(messages: any[], temperature = 0.2) {
  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/deepseek-v4-flash-0731",
      messages,
      temperature,
      top_p: 0.95,
      max_tokens: 512,
      stream: false,
    }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

Deno.serve(async (req) => {
  const { user_message } = await req.json();

  // 1. Extraction call -> structured intent/filters JSON
  const nluRaw = await callDeepSeek([
    { role: "system", content: NLU_SYSTEM_PROMPT },
    { role: "user", content: user_message },
  ], 0.2);
  const { intent, filters } = JSON.parse(nluRaw);

  // 2. Query Supabase (Postgres) using the extracted filters
  let query = supabase.from("books").select("*");
  if (filters.subject) query = query.ilike("subject", `%${filters.subject}%`);
  if (filters.author) query = query.ilike("author", `%${filters.author}%`);
  if (filters.category) query = query.ilike("category", `%${filters.category}%`);
  if (filters.availability) query = query.gt("available_copies", 0);
  const { data: results, error } = await query;

  // 3. Response call -> natural language answer grounded in real DB rows
  const reply = await callDeepSeek([
    { role: "system", content: "You are a friendly library assistant. "
      + "Use ONLY the provided data to answer. Do not invent book details." },
    { role: "user", content: `User asked: ${user_message}\nIntent: ${intent}\n`
      + `Data: ${JSON.stringify(results)}\nWrite a short, helpful reply.` },
  ], 0.7);

  return new Response(JSON.stringify({ intent, results, reply }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

The frontend (built from the Stitch-generated UI, see Section 9) simply
calls this Edge Function via `supabase.functions.invoke("library-chat", { body: { user_message } })`
— it never sees the NVIDIA key or talks to Postgres directly.

Two-call pattern inside the function:
1. **Extraction call** (low temperature) → structured intent/filters JSON.
2. **Response call** (higher temperature) → natural language answer grounded
   strictly in DB results, preventing hallucinated titles/authors/due dates.

## 8. Sample Conversation Flow

```
User: Do you have books on machine learning?
 → intent: search_by_subject, filters: {subject: "machine learning"}
 → DB: 6 matching rows, 4 available
Bot: I found 6 books on Machine Learning — 4 are available right now,
     including "Hands-On Machine Learning" by Aurélien Géron (Shelf CS-2)
     and "Pattern Recognition and ML" by Bishop (Shelf CS-3). Want me to
     list all of them?

User: What about the fine if I keep it 5 days late?
 → intent: due_date_fine, filters: {}
 → Rules: fine_per_day = ₹5
Bot: The library charges ₹5 per day for overdue books, so 5 days late
     would be a ₹25 fine.
```

## 9. Tech Stack Recommendation

| Layer | Suggested Tool |
|---|---|
| UI/UX design | **Google Stitch** — generate chat screen, search results, book detail, and rules/FAQ screens from text prompts, then export as HTML/CSS or Figma-style design and hand off to the frontend |
| Frontend | React / Next.js, using the exported Stitch design as the visual/component base, wired up with `@supabase/supabase-js` |
| Backend API | **Supabase Edge Functions** (Deno/TypeScript) — hosts the NLU + query-resolver logic, keeps the NVIDIA key server-side |
| Database | **Supabase (Postgres)** — `books`, `members`, `loans`, `rules` tables, with Row Level Security |
| Auth | **Supabase Auth** — student/faculty login, session tied to `member_id` |
| File storage | **Supabase Storage** — ebook files / digital resource assets |
| LLM Provider | NVIDIA-hosted DeepSeek (`deepseek-ai/deepseek-v4-flash-0731`) via HTTP call from the Edge Function |
| Deployment | Supabase CLI (`supabase functions deploy`, `supabase db push`) + Vercel/Netlify for the frontend |

### 9.1 UI/UX with Stitch

[Google Stitch](https://stitch.withgoogle.com) generates UI screens and
frontend code from natural-language prompts, which fits this project well
since the deliverable is a small, well-defined set of screens:

1. **Chat screen** — main conversational interface (message bubbles, input
   box, suggested-query chips like "Books on Machine Learning", "Library
   timings").
2. **Search results screen** — card/list layout showing title, author,
   shelf section, and an availability badge (green = available, red = all
   copies out).
3. **Book detail screen** — full metadata, "Reserve" or "Access ebook"
   button (for digital resources).
4. **My loans / due dates screen** — a student's currently borrowed books,
   due dates, and any accrued fine.
5. **Rules/FAQ screen** — static content pulled from the `rules` table
   (timings, borrowing limits, fine policy).

Recommended flow: prompt Stitch for each screen individually (rather than
the whole app at once) for better fidelity, export the generated
HTML/React, then replace Stitch's placeholder data with live calls to
Supabase (`supabase.from("books").select()`) and to the `library-chat`
Edge Function described in Section 7.

## 10. Security & Reliability Notes

- **Never** embed API keys in source code or shared chat logs — use env
  vars / secret managers, and rotate any key that has been exposed.
- Use parameterized SQL queries only (no string interpolation) to prevent
  SQL injection from user-provided filter values.
- Ground all factual answers (availability, due dates, fines) in DB query
  results — the LLM should never "guess" a book's shelf location or fine
  amount.
- Add a fallback: if `extract_intent` returns malformed JSON, retry once or
  fall back to a simple keyword search before failing gracefully.
- Log low-confidence extractions (e.g., all filters null with a specific
  intent) for periodic human review to improve the NLU prompt over time.

## 11. Possible Future Enhancements

- Personalized recommendations based on a student's borrowing history.
- Voice-based query support.
- Integration with the library's existing ILS (Integrated Library System)
  via API instead of a standalone database.
- Multilingual support for regional-language queries.
- Waitlist/notify-me feature when a currently unavailable book is returned.
