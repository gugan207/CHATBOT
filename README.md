# 🏛️ Smart Library Assistant

A conversational AI assistant and comprehensive library catalog management system built with Next.js 14, TypeScript, Tailwind CSS, Supabase PostgreSQL, and NVIDIA-hosted DeepSeek NLU.

Designed according to Google Stitch specifications and the **Academic Pulse Desktop** design system.

---

## 🌟 Key Features

1. **AI Chat Assistant with Grounded NLU**
   - Natural language intent & slot extraction (powered by NVIDIA DeepSeek or local semantic hybrid fallback engine).
   - Dynamic parameter extraction (`author`, `subject`, `availability`, `category`, `is_digital`, `shelf_section`).
   - Pure factual grounding directly against verified Postgres database records (zero hallucination).
   - Real-time inline interactive book cards with instant checkout/reserve actions.
   - Voice input integration (Web Speech API).
   - Real-time NLU & SQL grounding inspector.

2. **Full-Featured Catalog Search & Multi-Condition Filtering**
   - Instant search bar filtering across title, author, topic, ISBN, and summary.
   - Filter sidebar: Category checkboxes, availability radio, publication year range, resource format pills (`Physical Book`, `eBook`, `Audiobook`).
   - Sort by Relevance, Newest Edition, Oldest Edition, Title A-Z.
   - Book detail modal with shelf location indicators (`📍 Shelf CS-2, 2nd Floor`) and one-click reservation.

3. **Built-in Digital eBook Reader**
   - In-app interactive eBook reader with light/sepia/dark themes, font sizing, page navigation, and progress tracking.

4. **Student Loan & Fine Management (`My Loans`)**
   - Live summary stats: Active loans, 30% SVG donut capacity gauge, and circulation desk pickup holds.
   - Overdue fine alert banner with interactive **Pay Fine Now** gateway and instant receipt clearance.
   - 1-Click loan renewals (+14 days) with automatic rule enforcement.
   - Book return workflow that immediately restores available copies to the public catalog.
   - Full past borrowing history timeline.

5. **Library Rules & FAQ Center**
   - 4 quick-reference summary tiles (Open Hours 24/7, Borrow Limit 3 items, Loan Period 14 days, Late Fees ₹5 / $0.50 per day).
   - Interactive category tabs and collapsible accordion FAQ items with Expand/Collapse All.
   - Direct CTA connecting back to the AI Assistant.

6. **Full Supabase Database & Migration Ready**
   - SQL schema in `supabase/migrations/20260821000000_init_library_schema.sql`.
   - Supabase Edge Function in `supabase/functions/library-chat/index.ts`.
   - Seamless local persistent fallback: works out-of-the-box even before connecting cloud database credentials.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration & Environment Variables

Create `.env.local` in the project root:

```env
# Optional: NVIDIA DeepSeek API Key (from https://build.nvidia.com)
NVIDIA_API_KEY=nvapi-your-key-here

# Optional: Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Defaults
NEXT_PUBLIC_DEFAULT_MEMBER_ID=MEM-2026-001
```

> **Note**: If API keys or Supabase credentials are not supplied, the app automatically runs in **Resilient Local Mode** with a full in-memory/localStorage PostgreSQL simulation and smart semantic parser.

---

## 🗄️ Supabase Deployment

1. Initialize and link Supabase:
   ```bash
   supabase init
   supabase link --project-ref your-project-ref
   ```
2. Apply database migrations:
   ```bash
   supabase db push
   ```
3. Deploy the Edge Function:
   ```bash
   supabase secrets set NVIDIA_API_KEY=nvapi-...
   supabase functions deploy library-chat
   ```
