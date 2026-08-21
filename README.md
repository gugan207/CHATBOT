# 🏛️ Smart Library Assistant

<p align="center">
  <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80" alt="Smart Library Assistant Banner" width="100%" style="border-radius: 16px;" />
</p>

<p align="center">
  <strong>An AI-powered conversational university library assistant and catalog management platform with grounded NLU, real-time PostgreSQL inventory, and digital eBook access.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL_15-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/NVIDIA-DeepSeek_V4-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA DeepSeek" />
  <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License" />
</p>

---

## 📖 Table of Contents
- [🌟 Key Capabilities](#-key-capabilities)
- [🏗️ System Architecture & Data Flow](#️-system-architecture--data-flow)
- [💻 Tech Stack Matrix](#-tech-stack-matrix)
- [🖥️ UI & Screen Modules](#️-ui--screen-modules)
- [🗄️ Database Relational Schema](#️-database-relational-schema)
- [🧠 2-Stage Grounded NLU Strategy](#-2-stage-grounded-nlu-strategy)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🔌 API Route Reference](#-api-route-reference)
- [☁️ Supabase Cloud Deployment](#️-supabase-cloud-deployment)
- [📄 Documentation](#-documentation)

---

## 🌟 Key Capabilities

### 1. 🤖 AI Chat Assistant with Factual Grounding
- **Zero Hallucination Guarantee**: The LLM (*NVIDIA DeepSeek V4 Flash*) is utilized strictly for intent understanding and conversational response formatting. All book data, copy counts, due dates, and fine rates originate directly from verified PostgreSQL records.
- **Multi-Slot Extraction**: Automatically understands parameters like `subject`, `author`, `availability`, `category`, `is_digital`, and `shelf_section`.
- **Interactive Inline Cards**: Bot responses display actionable book result cards directly inside the chat stream with 1-click details and borrow triggers.
- **Live Grounding Inspector**: Real-time debug pill that lets students and admins verify exact extracted intent slots and SQL queries.
- **Voice Input**: Web Speech API integration for hands-free voice search.

### 2. 🔍 Advanced Catalog Search & Dynamic Filtering
- **Multi-Condition Query Engine**: Search across titles, authors, categories, subjects, summaries, and ISBNs simultaneously.
- **Sidebar Filter Suite**: Filter by Subject/Category checkboxes, Availability (*Available Copies Only* vs *Show All*), Publication Year range (*From/To*), and Resource Format (*Physical Book*, *eBook*, *Audiobook*).
- **Instant Sorting**: Relevance, Newest Edition, Oldest Edition, and Title (A-Z).
- **Physical Shelf Locator**: Every book card indicates exact physical shelf locations (e.g. `📍 Shelf CS-2, 2nd Floor`).

### 3. 📖 Built-in Digital eBook Reader
- **In-App Digital Reader**: Open and read digital editions directly in the browser with no external PDF viewers required.
- **Multiple Reading Themes**: Switch between **Light**, **Sepia**, and **Dark** modes.
- **Ergonomic Typography Controls**: Increase/decrease font sizes (12px – 24px), track reading progress percentage, and navigate chapters.

### 4. 💳 Student Loan & Overdue Fine Management (`My Loans`)
- **Borrowing Capacity Donut**: 30% SVG visualization tracking current student allowance (3 items max for undergraduates, 10 items for faculty).
- **Action Required Fine Banner**: Highlights pending fines with an integrated **Pay Fine Online** modal that instantly clears account blocks and awards celebratory confetti feedback.
- **1-Click 14-Day Renewals**: Instantly extend eligible loans with automated validation against maximum renewal caps (2x max) and hold checks.
- **Return Workflow**: Immediately returns books and restores available copy counts to the public catalog.
- **Historical Timeline**: Review past returned books and cleared transactions.

### 5. 📋 Library Rules, Timings & Interactive FAQ Center
- **4 Quick Reference Tiles**: Open Hours (24/7 Digital / 8AM–8PM Desk), Borrow Limits, Loan Periods (14 Days), and Fine Rate (₹5 / $0.50 per day).
- **Category Filter Tabs**: General Borrowing, Digital Resources, and Facilities & Study Spaces.
- **Expandable Accordion FAQ**: One-click Expand All / Collapse All controls.

### 6. 🎛️ Control Center & Live Diagnostics Modal
- **AI Model Selection**: Switch or test NVIDIA DeepSeek V4 Cloud API with live connection status ping.
- **Database Switcher**: Connect to live remote Supabase PostgreSQL or run in persistent local store mode.
- **Patron Role Switcher**: Switch between **Alex Rivera** *(Student: 3 books, 14-day loan)* and **Dr. Elena Rostova** *(Faculty: 10 books, 30-day loan)* to test permission rules.
- **Demonstration Reset**: 1-click restore to reset all catalog copies, loans, and fines back to initial seed data.

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             STUDENT / CLIENT BROWSER                        │
│                                                                             │
│  ┌─────────────────┐   ┌──────────────────┐   ┌──────────────────────────┐  │
│  │ Assistant Chat  │   │  Catalog Search  │   │ My Loans & Overdue Fines │  │
│  │  (Natural Lang) │   │ (Multi-Filter UI)│   │  (Donut Chart & Pay Now) │  │
│  └────────┬────────┘   └────────┬─────────┘   └────────────┬─────────────┘  │
│           │                     │                          │                │
└───────────┼─────────────────────┼──────────────────────────┼────────────────┘
            │                     │                          │
            ▼                     ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            NEXT.JS 14 BACKEND API                           │
│                                                                             │
│       /api/chat                     /api/books                 /api/loans   │
│  ┌──────────────────┐           ┌──────────────────┐       ┌─────────────┐  │
│  │ Intent & Filter  │           │ Parameterized    │       │ Loan State  │  │
│  │ Extraction Layer │           │ Dynamic Search   │       │ Management  │  │
│  └────────┬─────────┘           └────────┬─────────┘       └──────┬──────┘  │
└───────────┼──────────────────────────────┼────────────────────────┼─────────┘
            │                              │                        │
            ├──────────────────────────────┴────────────────────────┘
            ▼
┌──────────────────────────────────────┐     ┌────────────────────────────────┐
│        NVIDIA DEEPSEEK V4            │     │    SUPABASE POSTGRESQL DB      │
│                                      │     │                                │
│  • Intent categorization             │     │  • books (catalog metadata)    │
│  • Slot extraction (author, subject) │────▶│  • loans (active & history)    │
│  • Factual response grounding        │     │  • members (student accounts)  │
│                                      │     │  • rules (timings, fines, caps)│
└──────────────────────────────────────┘     └────────────────────────────────┘
```

---

## 💻 Tech Stack Matrix

| Area | Technology | Role |
|---|---|---|
| **Frontend Framework** | **Next.js 14 (App Router)** | Client/Server rendering, dynamic routing (`/`, `/catalog`, `/loans`, `/faq`), and API routes. |
| **Language** | **TypeScript 5.6** | Full end-to-end type safety across database entities, loans, and NLU responses. |
| **Styling** | **Tailwind CSS 3.4** | Clean, responsive implementation of the *Academic Pulse Desktop* design system. |
| **Typography** | **Hanken Grotesk** | Optimized typography for long-form academic reading and dense catalog layouts. |
| **Icons** | **Lucide React & Material Symbols** | Consistent, lightweight iconography for UI controls and metadata tags. |
| **Database** | **Supabase (PostgreSQL 15)** | Scalable relational database with Row Level Security (RLS) policies. |
| **AI / NLU Engine** | **NVIDIA DeepSeek V4 Flash** | Reasoning-capable LLM (`deepseek-ai/deepseek-v4-flash-0731`) for structured slot extraction. |
| **Offline Fallback** | **Semantic Hybrid Parser** | Built-in regex rule engine ensuring instant <1ms query responses even without internet. |
| **Visual Effects** | **Canvas-Confetti** | Rewarding visual feedback upon settling overdue library accounts. |

---

## 🖥️ UI & Screen Modules

```
smart-library-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── books/route.ts      # REST API: multi-condition catalog search
│   │   │   ├── chat/route.ts       # REST API: NLU resolution & grounded chat
│   │   │   └── loans/route.ts      # REST API: borrow, renew, return & pay fine
│   │   ├── catalog/page.tsx        # Direct URL: /catalog
│   │   ├── faq/page.tsx            # Direct URL: /faq
│   │   ├── loans/page.tsx          # Direct URL: /loans
│   │   ├── rules/page.tsx          # Direct URL: /rules
│   │   ├── search/page.tsx         # Direct URL: /search
│   │   ├── globals.css             # Design tokens & glassmorphism styling
│   │   ├── layout.tsx              # Root HTML wrapper & Google Fonts loader
│   │   └── page.tsx                # Main single-page interactive application
│   ├── components/
│   │   ├── BookDetailModal.tsx     # Book metadata, shelf locator & 1-click borrow
│   │   ├── ChatView.tsx            # AI Chat thread, chips, inline cards & voice input
│   │   ├── EbookReaderModal.tsx    # Digital eBook reader (Light/Sepia/Dark)
│   │   ├── Header.tsx              # Navigation header, live status indicator & profile badge
│   │   ├── MainApp.tsx             # State orchestrator for tabs, modals & active member
│   │   ├── MyLoansView.tsx         # Loans list, 30% donut chart & fine payment gateway
│   │   ├── RulesFAQView.tsx        # 4 summary tiles & accordion FAQ items
│   │   ├── SearchView.tsx          # Search bar, category checklist & format pills
│   │   └── SettingsModal.tsx       # AI test connection, DB setup & patron switcher
│   └── lib/
│       ├── mockData.ts             # Seed catalog books, rules, members & storage sync
│       ├── nluEngine.ts            # DeepSeek cloud client & local semantic rule engine
│       ├── supabase.ts             # Supabase client SDK with resilient fallback layer
│       └── types.ts                # TypeScript interfaces (Book, Loan, Member, Rule)
└── supabase/
    ├── functions/library-chat/     # Deno Edge Function for cloud deployment
    └── migrations/                 # PostgreSQL migration SQL script
```

---

## 🗄️ Database Relational Schema

```sql
-- 1. Books Catalog Table
CREATE TABLE books (
    book_id          TEXT PRIMARY KEY,
    title            TEXT NOT NULL,
    author           TEXT NOT NULL,
    category         TEXT NOT NULL,           -- e.g. Computer Science, AI, Math
    subject          TEXT NOT NULL,           -- e.g. Machine Learning, Python
    isbn             TEXT,
    edition          TEXT,
    publish_year     INTEGER DEFAULT 2023,
    total_copies     INTEGER NOT NULL DEFAULT 5,
    available_copies INTEGER NOT NULL DEFAULT 5,
    shelf_section    TEXT NOT NULL,           -- e.g. "Shelf CS-2 (2nd Floor)"
    is_digital       BOOLEAN DEFAULT FALSE,
    digital_link     TEXT,
    cover_image_url  TEXT,
    summary          TEXT
);

-- 2. Member Accounts Table
CREATE TABLE members (
    member_id          TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    email              TEXT,
    membership_type    TEXT NOT NULL DEFAULT 'student', -- 'student', 'faculty', 'guest'
    max_books_allowed  INTEGER NOT NULL DEFAULT 3,
    max_days_allowed   INTEGER NOT NULL DEFAULT 14,
    active             BOOLEAN DEFAULT TRUE,
    fine_balance       NUMERIC(10, 2) DEFAULT 0.00
);

-- 3. Loans Table
CREATE TABLE loans (
    loan_id            BIGSERIAL PRIMARY KEY,
    book_id            TEXT NOT NULL REFERENCES books(book_id),
    member_id          TEXT NOT NULL REFERENCES members(member_id),
    issue_date         DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date           DATE NOT NULL,
    return_date        DATE,
    fine_amount        NUMERIC(10, 2) DEFAULT 0.00,
    renewal_count      INTEGER DEFAULT 0,
    status             TEXT NOT NULL DEFAULT 'active'
);

-- 4. Dynamic Library Rules
CREATE TABLE rules (
    rule_key           TEXT PRIMARY KEY,
    rule_value         TEXT NOT NULL,
    category           TEXT DEFAULT 'general',
    description        TEXT
);
```

---

## 🧠 2-Stage Grounded NLU Strategy

```
[ User Query: "Do you have books on machine learning?" ]
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: Intent & Slot Extraction (NVIDIA DeepSeek V4)      │
│ Extracted JSON:                                             │
│ {                                                           │
│   "intent": "multi_condition_search",                       │
│   "filters": { "subject": "Machine Learning", "availability": true } │
│ }                                                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: PostgreSQL Catalog Query Execution                 │
│ SELECT * FROM books WHERE subject ILIKE '%Machine Learning%'│
│   AND available_copies > 0;                                 │
│ Returned: 4 verified book rows from inventory               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: Grounded Conversational Response Generation        │
│ "I found 4 books on Machine Learning available right now,   │
│  including 'Hands-On Machine Learning' by Aurélien Géron    │
│  (Shelf CS-2) and 'Pattern Recognition' by Bishop."         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js `18.x` or later (tested on Node `24.x`)
- npm `9.x` or later

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gugan207/CHATBOT.git
   cd CHATBOT/smart-library-assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit **[http://localhost:3000](http://localhost:3000)** (or direct routes `/catalog`, `/loans`, `/faq`).

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the `smart-library-assistant` root folder:

```env
# Optional: NVIDIA DeepSeek API Key (from https://build.nvidia.com)
NVIDIA_API_KEY=nvapi-your-key-here

# Optional: Supabase PostgreSQL Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Defaults
NEXT_PUBLIC_DEFAULT_MEMBER_ID=MEM-2026-001
NEXT_PUBLIC_APP_NAME="Smart Library Assistant"
```

> **💡 Zero-Config Fallback**: If keys are omitted, the application runs in local mode using its embedded PostgreSQL engine and local semantic parser with full localStorage persistence!

---

## 🔌 API Route Reference

### 1. `POST /api/chat`
Resolves user queries in natural language.
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What time does the library close?"}'
```

### 2. `GET /api/books`
Searches catalog with dynamic query parameters.
```bash
curl "http://localhost:3000/api/books?q=Python&availability=available_only&sortBy=newest"
```

### 3. `POST /api/loans`
Executes member loan operations (`borrow`, `renew`, `return`, `pay_fine`).
```bash
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{"action": "borrow", "bookId": "BK-CS-001", "memberId": "MEM-2026-001"}'
```

---

## ☁️ Supabase Cloud Deployment

To link your live Supabase cloud project:

1. Open your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql).
2. Copy the entire contents of [`supabase/migrations/20260821000000_init_library_schema.sql`](supabase/migrations/20260821000000_init_library_schema.sql).
3. Click **Run** to generate all tables, foreign keys, RLS security policies, and catalog records.
4. Set your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` or inside the in-app **Control Center Settings**.

---

## 📄 Documentation

- [Technical Architecture & Specifications](TECH_STACK_AND_ARCHITECTURE.md)
- [Design Prompts & Specifications](stitch_design/stitch_design_specification_development/stitch_design_prompts.md)
- [Academic Pulse Design Tokens](stitch_design/stitch_design_specification_development/academic_pulse_desktop/DESIGN.md)

---

## 📜 License

This project is licensed under the **MIT License**.
