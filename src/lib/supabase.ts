// =============================================================================
// Supabase Client with Resilient Fallback Layer
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Book, Loan, Member, Rule, SearchFiltersState } from './types';
import {
  getStoredBooks,
  saveStoredBooks,
  getStoredLoans,
  saveStoredLoans,
  getStoredRules,
  getStoredMembers,
  saveStoredMembers
} from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Fast timeout wrapper to ensure zero hanging or latency spikes
async function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Supabase request timed out')), ms))
  ]);
}

// =============================================================================
// Unified Database Operations
// =============================================================================

export async function fetchAllBooks(): Promise<Book[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('books')
          .select('*')
          .order('title', { ascending: true })
      );
      if (!error && data && data.length > 0) return data as Book[];
    } catch (e) {
      // Graceful fallback to persistent local storage
    }
  }
  return getStoredBooks();
}

export async function queryBooks(filters: Partial<SearchFiltersState>): Promise<Book[]> {
  let books = await fetchAllBooks();

  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    books = books.filter(b => 
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.isbn && b.isbn.includes(q))
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    books = books.filter(b => filters.categories!.includes(b.category));
  }

  if (filters.availability === 'available_only') {
    books = books.filter(b => b.available_copies > 0);
  }

  if (filters.yearFrom) {
    books = books.filter(b => (b.publish_year || 0) >= filters.yearFrom!);
  }

  if (filters.yearTo) {
    books = books.filter(b => (b.publish_year || 9999) <= filters.yearTo!);
  }

  if (filters.formats && filters.formats.length > 0) {
    books = books.filter(b => {
      if (filters.formats!.includes('eBook') && b.is_digital) return true;
      if (filters.formats!.includes('Physical Book') && !b.is_digital) return true;
      return false;
    });
  }

  if (filters.sortBy) {
    if (filters.sortBy === 'newest') {
      books.sort((a, b) => (b.publish_year || 0) - (a.publish_year || 0));
    } else if (filters.sortBy === 'oldest') {
      books.sort((a, b) => (a.publish_year || 0) - (b.publish_year || 0));
    } else if (filters.sortBy === 'title') {
      books.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  return books;
}

export async function fetchMemberLoans(memberId: string = 'MEM-2026-001'): Promise<Loan[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('loans')
          .select('*, book:books(*)')
          .eq('member_id', memberId)
          .order('due_date', { ascending: true })
      );
      if (!error && data && data.length > 0) return data as Loan[];
    } catch (e) {
      // Graceful fallback to local store
    }
  }
  const loans = getStoredLoans();
  return loans.filter(l => l.member_id === memberId);
}

export async function fetchRules(): Promise<Rule[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase.from('rules').select('*')
      );
      if (!error && data && data.length > 0) return data as Rule[];
    } catch (e) {
      // Graceful fallback to local store
    }
  }
  return getStoredRules();
}

export async function borrowBook(bookId: string, memberId: string = 'MEM-2026-001'): Promise<{ success: boolean; message: string; loan?: Loan }> {
  const books = getStoredBooks();
  const bookIndex = books.findIndex(b => b.book_id === bookId);
  if (bookIndex === -1) {
    return { success: false, message: 'Book not found.' };
  }

  const book = books[bookIndex];
  if (book.available_copies <= 0) {
    return { success: false, message: 'Sorry, no copies are currently available.' };
  }

  // Check member borrowing limit dynamically
  const isFaculty = memberId.includes('002');
  const maxLimit = isFaculty ? 10 : 3;

  const loans = getStoredLoans();
  const activeLoans = loans.filter(l => l.member_id === memberId && l.status !== 'returned');
  if (activeLoans.length >= maxLimit) {
    return { success: false, message: `Borrowing limit reached (maximum ${maxLimit} active books for ${isFaculty ? 'faculty' : 'students'}).` };
  }

  // Update book copies
  book.available_copies -= 1;
  books[bookIndex] = book;
  saveStoredBooks(books);

  // Create new loan
  const today = new Date();
  const dueDate = new Date();
  const loanDays = isFaculty ? 30 : 14;
  dueDate.setDate(today.getDate() + loanDays);

  const newLoan: Loan = {
    loan_id: Date.now(),
    book_id: bookId,
    member_id: memberId,
    issue_date: today.toISOString().split('T')[0],
    due_date: dueDate.toISOString().split('T')[0],
    return_date: null,
    fine_amount: 0,
    renewal_count: 0,
    status: 'active',
    book: book
  };

  loans.unshift(newLoan);
  saveStoredLoans(loans);

  // Also sync to Supabase if reachable
  if (isSupabaseConfigured && supabase) {
    try {
      withTimeout(
        supabase.from('books').update({ available_copies: book.available_copies }).eq('book_id', bookId)
      ).catch(() => {});

      withTimeout(
        supabase.from('loans').insert({
          book_id: bookId,
          member_id: memberId,
          issue_date: newLoan.issue_date,
          due_date: newLoan.due_date,
          status: 'active'
        })
      ).catch(() => {});
    } catch (e) {}
  }

  return { success: true, message: `Successfully checked out "${book.title}". Due date: ${newLoan.due_date}.`, loan: newLoan };
}

export async function renewLoan(loanId: number): Promise<{ success: boolean; message: string; newDueDate?: string }> {
  const loans = getStoredLoans();
  const loanIndex = loans.findIndex(l => l.loan_id === loanId);
  if (loanIndex === -1) {
    return { success: false, message: 'Loan record not found.' };
  }

  const loan = loans[loanIndex];
  if (loan.fine_amount > 0) {
    return { success: false, message: 'Renewal blocked: please settle outstanding overdue fines first.' };
  }

  if (loan.renewal_count >= 2) {
    return { success: false, message: 'Maximum renewal limit (2 times) has been reached for this book.' };
  }

  // Extend due date by 14 days
  const currentDue = new Date(loan.due_date);
  currentDue.setDate(currentDue.getDate() + 14);
  const newDueDate = currentDue.toISOString().split('T')[0];

  loan.due_date = newDueDate;
  loan.renewal_count += 1;
  loan.status = 'active';
  loans[loanIndex] = loan;
  saveStoredLoans(loans);

  if (isSupabaseConfigured && supabase) {
    try {
      withTimeout(
        supabase.from('loans').update({
          due_date: newDueDate,
          renewal_count: loan.renewal_count,
          status: 'active'
        }).eq('loan_id', loanId)
      ).catch(() => {});
    } catch (e) {}
  }

  return { success: true, message: `Loan renewed successfully! New due date is ${newDueDate}.`, newDueDate };
}

export async function returnLoan(loanId: number): Promise<{ success: boolean; message: string }> {
  const loans = getStoredLoans();
  const loanIndex = loans.findIndex(l => l.loan_id === loanId);
  if (loanIndex === -1) {
    return { success: false, message: 'Loan record not found.' };
  }

  const loan = loans[loanIndex];
  const books = getStoredBooks();
  const bookIndex = books.findIndex(b => b.book_id === loan.book_id);
  if (bookIndex !== -1) {
    books[bookIndex].available_copies = Math.min(books[bookIndex].total_copies, books[bookIndex].available_copies + 1);
    saveStoredBooks(books);
  }

  loan.return_date = new Date().toISOString().split('T')[0];
  loan.status = 'returned';
  loan.fine_amount = 0;
  loans[loanIndex] = loan;
  saveStoredLoans(loans);

  if (isSupabaseConfigured && supabase) {
    try {
      withTimeout(
        supabase.from('loans').update({
          return_date: loan.return_date,
          status: 'returned',
          fine_amount: 0
        }).eq('loan_id', loanId)
      ).catch(() => {});

      if (bookIndex !== -1) {
        withTimeout(
          supabase.from('books').update({ available_copies: books[bookIndex].available_copies }).eq('book_id', loan.book_id)
        ).catch(() => {});
      }
    } catch (e) {}
  }

  return { success: true, message: `Book returned successfully. Thank you!` };
}

export async function payMemberFine(memberId: string = 'MEM-2026-001'): Promise<{ success: boolean; message: string }> {
  const loans = getStoredLoans();
  let totalCleared = 0;

  loans.forEach(loan => {
    if (loan.member_id === memberId && (loan.fine_amount || 0) > 0) {
      totalCleared += loan.fine_amount;
      loan.fine_amount = 0;
      if (loan.status === 'overdue') {
        loan.status = 'active';
      }
    }
  });

  saveStoredLoans(loans);

  const members = getStoredMembers();
  const memberIndex = members.findIndex(m => m.member_id === memberId);
  if (memberIndex !== -1) {
    members[memberIndex].fine_balance = 0;
    saveStoredMembers(members);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      withTimeout(
        supabase.from('loans').update({ fine_amount: 0 }).eq('member_id', memberId)
      ).catch(() => {});

      withTimeout(
        supabase.from('members').update({ fine_balance: 0 }).eq('member_id', memberId)
      ).catch(() => {});
    } catch (e) {}
  }

  return {
    success: true,
    message: `Payment successful! $${totalCleared.toFixed(2)} in fines has been settled. Borrowing privileges restored.`
  };
}
