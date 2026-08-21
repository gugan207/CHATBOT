# 🏛️ Smart Library Assistant — Tech Stack & Architecture Document

This document provides a comprehensive technical overview of all technologies, libraries, architectural patterns, database schemas, and AI models utilized in the **Smart Library Assistant** project.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Complete Technology Stack](#-complete-technology-stack)
   - [Frontend Layer](#frontend-layer)
   - [Backend & API Layer](#backend--api-layer)
   - [Database & Storage Layer](#database--storage-layer)
   - [AI & NLU Layer](#ai--nlu-layer)
3. [System Architecture & Data Flow](#-system-architecture--data-flow)
4. [Relational Database Schema](#-relational-database-schema)
5. [NLU & Grounding Strategy](#-nlu--grounding-strategy)
6. [Design System & UI Specifications](#-design-system--ui-specifications)
7. [Screens & Feature Modules](#-screens--feature-modules)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Security & Fallback Mechanisms](#-security--fallback-mechanisms)
10. [Repository & Environment Configuration](#-repository--environment-configuration)

---

## 🌟 Project Overview

The **Smart Library Assistant** is an intelligent, full-stack campus library web application. It combines a conversational AI interface with a structured catalog database, allowing university students to search books in natural language, verify real-time copy availability, look up shelf locations, manage loans and renewals, pay overdue fines, and access digital eBooks.

---

## 🛠️ Complete Technology Stack

### Frontend Layer

| Technology / Package | Version | Purpose & Usage |
|---|---|---|
| **Next.js** | `14.2.35` | React framework providing App Router, SSR/CSR, client page routes (`/`, `/catalog`, `/search`, `/loans`, `/faq`, `/rules`), and API routes. |
| **React** | `18.3.1` | Component-based UI library with reactive state hooks (`useState`, `useEffect`, `useRef`). |
| **TypeScript** | `5.6.2` | Strong static typing for catalog models, loan records, database queries, and intent interfaces. |
| **Tailwind CSS** | `3.4.11` | Utility-first CSS engine implementing the *Academic Pulse Desktop* design tokens. |
| **PostCSS & Autoprefixer** | `8.4.47` / `10.4.20` | CSS compilation, autoprefixing, and vendor compatibility. |
| **Lucide React** | `0.441.0` | Clean, modern SVG icon system for UI controls and navigation. |
| **Google Fonts** | `Hanken Grotesk` | High-legibility modern sans-serif typography tailored for academic research interfaces. |
| **Material Symbols** | `Google Opsz` | Additional specialized icons (schedule, payments, library books). |
| **Canvas Confetti** | `1.9.4` | Micro-animation celebration effect when paying overdue library fines. |
| **Web Speech API** | Browser Native | Voice speech-to-text recognition simulation for accessibility. |

---

### Backend & API Layer

| Technology | Implementation | Description |
|---|---|---|
| **Next.js Serverless Route Handlers** | Node.js / TypeScript | High-performance backend endpoints located in `src/app/api/`: `/api/chat`, `/api/books`, `/api/loans`. |
| **Supabase Edge Functions** | Deno TypeScript Runtime | Serverless cloud edge function (`supabase/functions/library-chat/index.ts`) for invoking cloud models securely without exposing secrets. |
| **In-Memory & Storage Persistence Layer** | Browser Local Storage Sync | Offline resilience layer that preserves loan updates, borrowed copies, and fine receipts even before connecting remote databases. |

---

### Database & Storage Layer

| Component | Technology | Description |
|---|---|---|
| **Primary Database** | **PostgreSQL 15 (Supabase)** | Relational database hosting structured catalog tables: `books`, `members`, `loans`, and `rules`. |
| **Client SDK** | `@supabase/supabase-js (2.45.4)` | Official isomorphic client for executing parameterized PostgreSQL queries. |
| **Row Level Security (RLS)** | PostgreSQL RLS Policies | Secures student records, allowing public catalog reads while restricting loan modifications. |
| **Migrations** | SQL (`supabase/migrations/`) | Version-controlled DDL script creating tables, foreign keys, B-tree indexes, and seed records. |

---

### AI & NLU Layer

| Component | Model / Provider | Description |
|---|---|---|
| **LLM Provider** | **NVIDIA API Catalog** (`integrate.api.nvidia.com`) | Cloud LLM host for high-throughput inference. |
| **Primary Model** | **DeepSeek V4 Flash** (`deepseek-ai/deepseek-v4-flash-0731`) | Reasoning-capable language model used for intent/slot extraction and natural language phrasing. |
| **Offline Fallback Engine** | **Smart Semantic Rule Parser** | Built-in regex and semantic parser in `src/lib/nluEngine.ts` that executes instant queries offline if API limits/keys are unavailable. |

---

## 🏛️ System Architecture & Data Flow

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

## 🗄️ Relational Database Schema

```sql
-- 1. Books Catalog
CREATE TABLE books (
    book_id          TEXT PRIMARY KEY,
    title            TEXT NOT NULL,
    author           TEXT NOT NULL,
    category         TEXT NOT NULL,
    subject          TEXT NOT NULL,
    isbn             TEXT,
    edition          TEXT,
    publish_year     INTEGER DEFAULT 2023,
    total_copies     INTEGER NOT NULL DEFAULT 5,
    available_copies INTEGER NOT NULL DEFAULT 5,
    shelf_section    TEXT NOT NULL,
    is_digital       BOOLEAN DEFAULT FALSE,
    digital_link     TEXT,
    cover_image_url  TEXT,
    summary          TEXT
);

-- 2. Student & Faculty Members
CREATE TABLE members (
    member_id          TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    email              TEXT,
    membership_type    TEXT NOT NULL DEFAULT 'student',
    max_books_allowed  INTEGER NOT NULL DEFAULT 3,
    max_days_allowed   INTEGER NOT NULL DEFAULT 14,
    active             BOOLEAN DEFAULT TRUE,
    fine_balance       NUMERIC(10, 2) DEFAULT 0.00
);

-- 3. Loans & Borrowing Records
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

## 🧠 NLU & Grounding Strategy

To eliminate LLM hallucinations regarding book inventory, fines, or loan dates, the system employs a **Two-Stage Grounding Pattern**:

1. **Stage 1 (Intent & Slot Extraction)**:
   The LLM parses the user prompt into structured JSON containing intent (`search_by_subject`, `search_by_author`, `library_timings`, `due_date_fine`, `check_my_loans`, etc.) and filters (`author`, `subject`, `availability`, `category`).
2. **Stage 2 (Database Query & Response Generation)**:
   The backend executes a parameterized query against Postgres. The real returned rows are supplied as the single source of truth for generating the natural language response.

---

## 🎨 Design System & UI Specifications

Based on the **Academic Pulse Desktop** design system exported from Google Stitch:

- **Primary Brand Color**: Deep Indigo (`#12266b` / `#2c3e82`)
- **Secondary Accent**: Warm Teal (`#006b5f` / `#14b8a6`)
- **Error / Late Fine**: Crimson Red (`#EF4444` / `#ffdad6`)
- **Surface & Background**: Cool-tinted blue-white (`#f8f9ff` / `#eceef3` / `#ffffff`)
- **Border Radii**: Smooth 16px (`rounded-2xl`) cards with subtle ambient elevation shadows.
- **Glassmorphism**: Backdrop blurred navigation header (`backdrop-blur-xl`).

---

## 📱 Screens & Feature Modules

1. **AI Chat Assistant Screen (`/`)**:
   - Message bubbles with timestamps, interactive suggestion chips, speech-to-text input, and inline book cards.
   - Live NLU / SQL Inspector for debugging intents in real time.
2. **Catalog Search Screen (`/catalog` & `/search`)**:
   - Instant search input with filter count.
   - Filter sidebar with category checkboxes, copy availability radio buttons, publication year sliders, and format pills.
   - Responsive cards grid with real-time status badges.
3. **Book Detail Modal & eBook Reader**:
   - Comprehensive book metadata, physical shelf locator (`📍 Shelf CS-2, 2nd Floor`), and instant 1-click borrow.
   - Built-in eBook reader supporting Light, Sepia, and Dark reading themes.
4. **My Loans & Overdue Fines Screen (`/loans`)**:
   - Urgent fine banner with interactive online payment gateway.
   - 3 stat cards: Active Loans, SVG Donut Borrowing Capacity Gauge, and Desk Holds.
   - 1-Click 14-day renewal and instant return actions.
5. **Library Rules & FAQ Screen (`/faq` & `/rules`)**:
   - 4 quick-reference summary tiles (Hours, Limits, Loan Period, Rates).
   - Accordion FAQ list with expandable answers.
6. **Settings Modal**:
   - In-app configuration for NVIDIA API keys, Supabase URLs, and demo database reset.

---

## 🔌 API Endpoints Reference

### 1. `POST /api/chat`
Resolves natural language queries and returns grounded responses.
- **Request Body**:
  ```json
  { "message": "Do you have books on machine learning?" }
  ```
- **Response**:
  ```json
  {
    "intent": "multi_condition_search",
    "filters": { "subject": "Machine Learning", "availability": true },
    "results": [ ... ],
    "reply": "I found 4 book(s) matching your query...",
    "executionTimeMs": 1
  }
  ```

### 2. `GET /api/books`
Searches catalog with multi-condition filters (`q`, `category`, `availability`, `sortBy`).

### 3. `GET / POST /api/loans`
- `GET`: Returns active and past loans for student `memberId`.
- `POST`: Executes actions (`borrow`, `renew`, `return`, `pay_fine`).

---

## 🔒 Security & Fallback Mechanisms

- **Environment Isolation**: API keys and service tokens remain server-side in `.env.local` or Supabase Secrets.
- **Parameterized SQL**: All filter inputs are sanitized to prevent SQL injection.
- **Resilient Fallback**: If the NVIDIA API or remote Supabase instance is unreachable, the system automatically falls back to the embedded PostgreSQL store and local semantic parser with zero downtime.

---

## 📦 Repository & Environment

- **GitHub Repository**: [https://github.com/gugan207/CHATBOT](https://github.com/gugan207/CHATBOT)
- **Branch**: `main`
- **Port**: `http://localhost:3000`
