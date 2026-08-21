# Stitch Design Prompts — Smart Library Assistant

Generate these one at a time in [Google Stitch](https://stitch.withgoogle.com)
for better fidelity, rather than asking for the whole app in one prompt.
Suggested order: Chat → Search Results → Book Detail → My Loans → Rules/FAQ,
so later prompts can reference the visual style already established.

---

## 1. Chat Screen (Home)

```
Design a clean, modern mobile-first chat interface for a "Smart Library
Assistant" app used by college students.

Layout:
- Top app bar: library icon on the left, title "Library Assistant", a
  small user avatar/profile icon on the right.
- Main area: a scrollable chat thread with message bubbles.
  - Bot messages: left-aligned, light gray/soft blue bubble, small book
    icon avatar.
  - User messages: right-aligned, solid primary-color bubble (deep blue
    or teal), white text.
  - Include one example exchange: user asks "Do you have books on machine
    learning?" and the bot replies with a short summary plus a compact
    book result card embedded inline (title, author, availability badge).
- Below the last bot message, show 3-4 horizontally scrollable "suggested
  query" chips: "📚 Books on Machine Learning", "👤 Books by Andrew Ng",
  "🕐 Library timings", "💰 Check my fines".
- Bottom input bar: rounded text input with placeholder "Ask about a book,
  rule, or your loans...", a microphone icon, and a send button (paper
  plane icon) in the primary color.
- Bottom navigation bar with 4 tabs: Chat (active), Search, My Loans, FAQ.

Style: minimal, academic-but-friendly, soft rounded corners (12-16px
radius), plenty of whitespace, primary color a deep blue/indigo (#2C3E82
or similar), accent color a warm teal or amber for badges/CTAs. Use a
clean sans-serif font. Light mode only for now.
```

---

## 2. Search Results Screen

```
Design a mobile-first "Search Results" screen for a library app, matching
the same visual style as the chat screen (deep blue/indigo primary color,
rounded 12-16px cards, clean sans-serif font).

Layout:
- Top app bar: back arrow, search bar showing the active query text
  "machine learning", a filter icon on the right.
- Below the search bar, a horizontal row of filter chips: "Available only",
  "Category ▾", "Author ▾", "Digital only" — chips look toggleable
  (outlined when inactive, filled primary color when active).
- Main content: a vertical scrollable list of book result cards. Each card:
  - Small book cover thumbnail/placeholder on the left (rounded corners).
  - Title (bold, 1-2 lines), author (secondary gray text) below it.
  - A small row of metadata tags: category tag (e.g. "Technology"), shelf
    location tag (e.g. "Shelf CS-2").
  - Top-right corner of the card: an availability badge — green pill
    "Available (3)" or red/gray pill "All copies borrowed".
  - Show 5 example cards with varied book titles related to machine
    learning and programming.
- Tapping a card should visually suggest navigation to a detail screen
  (subtle chevron icon on the right edge of each card).
- Empty state variant (show as a small inset note): friendly illustration
  placeholder + text "No books matched your search. Try a different
  subject or author."

Style: consistent with the chat screen — soft shadows on cards, generous
padding, deep blue/indigo primary, warm teal/amber accents for badges.
```

---

## 3. Book Detail Screen

```
Design a mobile-first "Book Detail" screen for a library app, in the same
visual style as the previous screens (deep blue/indigo primary, rounded
cards, clean sans-serif font).

Layout:
- Top app bar: back arrow, heart/bookmark icon on the right (save book).
- Hero section: large book cover placeholder centered, title below in
  bold large text, author name below that in secondary gray text.
- A horizontal row of quick-info pills: category ("Technology"), subject
  ("Machine Learning"), edition ("3rd Edition").
- An availability status card: shows "✅ Available — 4 of 6 copies" in a
  green-tinted card, OR alternate state "❌ All copies borrowed — next
  return expected [date]" in an amber/red-tinted card. Design the green
  "available" version as primary, but mention the alternate state in a
  note.
- Location card: shelf section clearly shown ("📍 Shelf CS-2, 2nd Floor")
  with a small "View on library map" text link.
- Description/summary section: a short paragraph of book description text.
- Digital resource section (conditional): if the book has an ebook, show a
  card with "📱 Also available as eBook" and a primary "Open eBook" button.
- Bottom sticky action bar: a full-width primary button "Reserve this
  book" (or "Notify me when available" if all copies are out, shown as a
  secondary/outlined button style).

Style: warm, informative, same rounded-card design language, soft shadows,
deep blue/indigo primary with teal/amber accents for status badges.
```

---

## 4. My Loans / Due Dates Screen

```
Design a mobile-first "My Loans" screen for a library app, consistent with
the established style (deep blue/indigo primary, rounded 12-16px cards).

Layout:
- Top app bar: title "My Loans", small profile avatar on the right.
- Summary card at the top: "You have 2 of 3 books borrowed" with a small
  progress bar (2/3 filled), and a secondary line "1 slot remaining".
- Section header "Currently Borrowed" followed by a list of loan cards.
  Each card shows:
  - Small book cover thumbnail, title, author.
  - Issue date and due date ("Due: 24 Aug 2026").
  - A due-date status badge: green "Due in 3 days", amber "Due tomorrow",
    or red "Overdue by 2 days — Fine: ₹10".
  - Two small action buttons per card: "Renew" (outlined) and "Return"
    (text button).
- Section header "Loan History" below, showing 2-3 collapsed/simplified
  rows of previously returned books (title, return date, fine paid if any)
  in a lighter, less prominent card style.
- If a fine exists, show a persistent small banner near the top: "⚠️ You
  have an outstanding fine of ₹15. Pay at the front desk or online." with
  a "Pay Now" text link.

Style: same rounded-card design language, clear status color-coding
(green/amber/red), deep blue/indigo primary, generous spacing between
sections.
```

---

## 5. Library Rules / FAQ Screen

```
Design a mobile-first "Library Rules & FAQ" screen for a library app,
matching the established style (deep blue/indigo primary, rounded cards,
clean sans-serif font).

Layout:
- Top app bar: title "Rules & Information", back arrow.
- A 2x2 grid of quick-info summary tiles near the top, each with an icon:
  - 🕐 "Open Hours" — "8:00 AM – 8:00 PM"
  - 📚 "Borrow Limit" — "3 books (students)"
  - 📅 "Loan Period" — "14 days"
  - 💰 "Fine Rate" — "₹5 / day late"
- Below the tiles, an expandable FAQ accordion list with 5-6 items, each
  showing a question as the collapsed header and expanding to show the
  answer text. Example questions:
  - "How do I renew a borrowed book?"
  - "How many times can I renew a book?"
  - "How do I get a library membership?"
  - "Can guests borrow books?"
  - "How do I access digital/ebook resources?"
  - "What happens if I lose a book?"
- Bottom section: a "Still need help?" card with a short line of text and
  a primary button "Ask the Assistant" that implies returning to the chat
  screen.

Style: same rounded-card design language as other screens, icon-led tiles
with soft background tint (light blue/teal), deep blue/indigo primary,
clean and scannable layout suited to quick reference lookups.
```

---

## Notes for Using These Prompts

- Generate screens in the order listed above so Stitch has visual context
  to stay consistent (Stitch tends to carry style forward within a
  session).
- After each generation, if the output drifts from the color scheme or
  spacing of the previous screen, add a short follow-up prompt like:
  *"Match the exact color palette and card style from the previous
  screen."*
- Export each screen's code once approved. Since the actual app will pull
  live data from Supabase, treat all book titles/dates/names in the
  generated designs as **placeholder data only** — they'll be replaced
  with real values from the `books`, `loans`, and `rules` tables when
  wiring up the frontend.
- If Stitch offers a "dark mode" variant option, generate it only after
  all light-mode screens are finalized, referencing the same prompts with
  "design a dark mode version" appended.
