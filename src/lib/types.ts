// =============================================================================
// Smart Library Assistant Types Definition
// =============================================================================

export interface Book {
  book_id: string;
  title: string;
  author: string;
  category: string;
  subject: string;
  isbn?: string;
  edition?: string;
  publish_year?: number;
  total_copies: number;
  available_copies: number;
  shelf_section: string;
  is_digital: boolean;
  digital_link?: string | null;
  cover_image_url?: string;
  summary?: string;
  format?: 'Physical Book' | 'eBook' | 'Audiobook';
}

export interface Member {
  member_id: string;
  name: string;
  email?: string;
  membership_type: 'student' | 'faculty' | 'guest';
  max_books_allowed: number;
  max_days_allowed: number;
  active: boolean;
  fine_balance: number;
}

export interface Loan {
  loan_id: number;
  book_id: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string | null;
  fine_amount: number;
  renewal_count: number;
  status: 'active' | 'returned' | 'overdue';
  book?: Book;
}

export interface Rule {
  rule_key: string;
  rule_value: string;
  category?: string;
  description?: string;
}

export type IntentCategory =
  | 'search_by_subject'
  | 'search_by_author'
  | 'search_by_category_location'
  | 'check_availability'
  | 'multi_condition_search'
  | 'borrowing_rules'
  | 'due_date_fine'
  | 'renewal'
  | 'library_timings'
  | 'digital_resources'
  | 'membership_info'
  | 'check_my_loans'
  | 'general_smalltalk';

export interface ExtractedFilters {
  title?: string | null;
  author?: string | null;
  subject?: string | null;
  category?: string | null;
  availability?: boolean | null;
  shelf_section?: string | null;
  is_digital?: boolean | null;
  published_after?: number | null;
  published_before?: number | null;
}

export interface NLUResponse {
  intent: IntentCategory;
  filters: ExtractedFilters;
  raw_query?: string;
  results?: Book[] | Loan[] | Rule[] | any;
  reply: string;
  groundedFacts?: string[];
  executionTimeMs?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: IntentCategory;
  filters?: ExtractedFilters;
  books?: Book[];
  loanData?: Loan[];
  isPending?: boolean;
}

export interface SearchFiltersState {
  query: string;
  categories: string[];
  availability: 'all' | 'available_only';
  yearFrom?: number;
  yearTo?: number;
  formats: string[];
  sortBy: 'relevance' | 'newest' | 'oldest' | 'title';
}
