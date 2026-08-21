'use client';

import React, { useState, useEffect } from 'react';
import { Loan, Book } from '@/lib/types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  Undo2, 
  Clock, 
  DollarSign, 
  CreditCard, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  History
} from 'lucide-react';
import { fetchMemberLoans, renewLoan, returnLoan, payMemberFine } from '@/lib/supabase';
import confetti from 'canvas-confetti';

interface MyLoansViewProps {
  onSelectBook: (book: Book) => void;
  onNavigateTab: (tab: 'chat' | 'search' | 'loans' | 'faq') => void;
}

export const MyLoansView: React.FC<MyLoansViewProps> = ({ onSelectBook, onNavigateTab }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPayingFine, setIsPayingFine] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loadLoans = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMemberLoans('MEM-2026-001');
      setLoans(data);
    } catch (e) {
      console.error('Failed to load loans', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const activeLoans = loans.filter(l => l.status !== 'returned');
  const returnedLoans = loans.filter(l => l.status === 'returned');
  const totalFines = activeLoans.reduce((sum, l) => sum + (l.fine_amount || 0), 0);

  const handleRenew = async (loanId: number) => {
    const res = await renewLoan(loanId);
    if (res.success) {
      setActionMessage({ text: res.message, isError: false });
      loadLoans();
    } else {
      setActionMessage({ text: res.message, isError: true });
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleReturn = async (loanId: number) => {
    const res = await returnLoan(loanId);
    if (res.success) {
      setActionMessage({ text: res.message, isError: false });
      loadLoans();
    } else {
      setActionMessage({ text: res.message, isError: true });
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handlePayFineConfirm = async () => {
    setIsPayingFine(true);
    const res = await payMemberFine('MEM-2026-001');
    setIsPayingFine(false);
    setShowPaymentModal(false);

    if (res.success) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setActionMessage({ text: res.message, isError: false });
      loadLoans();
    } else {
      setActionMessage({ text: res.message, isError: true });
    }
    setTimeout(() => setActionMessage(null), 5000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Action Notification Alert */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-300 shadow-md ${
          actionMessage.isError 
            ? 'bg-error-container text-on-error-container border border-error/30' 
            : 'bg-success-container text-on-success-container border border-success/30'
        }`}>
          {actionMessage.isError ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Urgent Fine Banner (If fines exist) */}
      {totalFines > 0 && (
        <div className="w-full bg-error-container text-on-error-container p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-error/30 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-error text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-error">Action Required • Borrowing Blocked</span>
              <h3 className="text-base sm:text-lg font-bold text-on-error-container mt-0.5">
                You have an outstanding fine of ${totalFines.toFixed(2)} (₹{(totalFines * 83).toFixed(0)})
              </h3>
              <p className="text-xs sm:text-sm opacity-90">
                Please settle pending overdue late charges to renew items and restore full borrowing privileges.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full md:w-auto bg-error text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all shrink-0 hover:bg-error/90"
          >
            Pay Fine Online Now
          </button>
        </div>
      )}

      {/* 3 Summary Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Stat Box 1: Active Loans */}
        <div className="md:col-span-4 bg-primary text-on-primary rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[190px]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-fixed opacity-10 rounded-full blur-2xl" />
          <div>
            <h2 className="text-lg font-bold text-primary-fixed-dim">Active Loans</h2>
            <p className="text-xs text-primary-fixed mt-1">Items currently checked out by you</p>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-5xl font-extrabold tracking-tight">{activeLoans.length}</span>
            <span className="text-sm font-semibold text-primary-fixed">of 3 allowed items</span>
          </div>
        </div>

        {/* Stat Box 2: Borrowing Limit Donut */}
        <div className="md:col-span-4 bg-surface-container-lowest text-on-surface rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-5 min-h-[190px]">
          <div className="relative w-24 h-24 shrink-0">
            {/* SVG Donut Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container-high"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${Math.round((activeLoans.length / 3) * 100)}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-base font-extrabold text-primary">
                {Math.round((activeLoans.length / 3) * 100)}%
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-base font-bold text-on-surface">Borrowing Capacity</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              You have {3 - activeLoans.length} slot(s) remaining for immediate checkout.
            </p>
            <button
              onClick={() => onNavigateTab('search')}
              className="inline-flex items-center gap-1 mt-3 text-primary text-xs font-bold hover:underline"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stat Box 3: Holds & Reservations */}
        <div className="md:col-span-4 bg-secondary-container text-on-secondary-container rounded-2xl p-6 shadow-sm border border-secondary/30 relative overflow-hidden flex flex-col justify-between min-h-[190px]">
          <BookOpen className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 text-secondary" />
          <div>
            <h2 className="text-lg font-bold text-on-secondary-container">Ready for Pickup</h2>
            <p className="text-xs text-secondary mt-1">Hold requests waiting at front circulation desk</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-5xl font-extrabold tracking-tight">1</span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-secondary text-white shadow-xs">
              Desk Hold #42
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Currently Borrowed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Currently Borrowed Items</h2>
            <p className="text-xs text-on-surface-variant">Review due dates, renew loans, or return items</p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1.5 rounded-full">
            Student Allowance: 14 Days
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(n => <div key={n} className="h-44 rounded-2xl bg-surface-container animate-pulse" />)}
          </div>
        ) : activeLoans.length > 0 ? (
          <div className="space-y-4">
            {activeLoans.map((loan) => {
              const book = loan.book;
              const isOverdue = loan.status === 'overdue' || (loan.fine_amount > 0);
              return (
                <div
                  key={loan.loan_id}
                  className={`bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md border border-outline-variant/30 relative overflow-hidden flex flex-col sm:flex-row gap-5 transition-all ${
                    isOverdue ? 'ring-1 ring-error/40' : ''
                  }`}
                >
                  {/* Status Indicator Stripe */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${isOverdue ? 'bg-error' : 'bg-success'}`} />

                  {/* Cover */}
                  <div 
                    onClick={() => book && onSelectBook(book)}
                    className="w-24 sm:w-28 h-36 shrink-0 rounded-xl overflow-hidden shadow-xs bg-surface-container cursor-pointer group"
                  >
                    <img
                      src={book?.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt={book?.title || 'Book cover'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                          {book?.category || 'Library Collection'}
                        </span>
                        <h3 
                          onClick={() => book && onSelectBook(book)}
                          className="text-base sm:text-lg font-bold text-on-surface hover:text-primary transition-colors cursor-pointer line-clamp-1 mt-0.5"
                        >
                          {book?.title || `Book ID: ${loan.book_id}`}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {book?.author || 'University Catalog'}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isOverdue ? 'bg-error-container text-on-error-container' : 'bg-success-container text-on-success-container'
                        }`}>
                          {isOverdue ? '⚠️ Overdue' : 'Active Loan'}
                        </span>
                        <span className={`text-xs font-bold mt-1 ${isOverdue ? 'text-error' : 'text-on-surface'}`}>
                          Due: {loan.due_date}
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-auto border-t border-outline-variant/20">
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                        <span>Issued: {loan.issue_date}</span>
                        <span>•</span>
                        <span>Renewals: {loan.renewal_count}/2</span>
                        {loan.fine_amount > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-error">Accrued Fine: ${loan.fine_amount.toFixed(2)}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRenew(loan.loan_id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-primary bg-primary-fixed hover:bg-primary-fixed-dim transition-colors flex items-center gap-1.5"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Renew (+14 Days)</span>
                        </button>

                        <button
                          onClick={() => handleReturn(loan.loan_id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-primary bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-3">
            <BookOpen className="w-10 h-10 text-on-surface-variant mx-auto opacity-50" />
            <h3 className="text-base font-bold text-on-surface">No active borrowed books</h3>
            <p className="text-xs text-on-surface-variant">You can borrow up to 3 books simultaneously from our catalog.</p>
            <button
              onClick={() => onNavigateTab('search')}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm"
            >
              Browse Catalog
            </button>
          </div>
        )}
      </div>

      {/* Loan History Section */}
      {returnedLoans.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span>Past Borrowing History</span>
          </h3>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs">
            <div className="divide-y divide-outline-variant/20">
              {returnedLoans.map((loan) => (
                <div key={loan.loan_id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{loan.book?.title || loan.book_id}</h4>
                      <p className="text-on-surface-variant">Author: {loan.book?.author || 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-success font-bold block">Returned on {loan.return_date || 'Past date'}</span>
                    <span className="text-[10px] text-on-surface-variant">Loan closed in good standing</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pay Fine Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl p-6 border border-outline-variant/30 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Pay Overdue Fine</h3>
                <p className="text-xs text-on-surface-variant">Student Portal Online Payment Gateway</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Student ID:</span>
                <span className="font-bold font-mono">MEM-2026-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Overdue Days:</span>
                <span className="font-bold">6 Days</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/20 pt-2 text-sm">
                <span className="font-bold text-on-surface">Total Balance Due:</span>
                <span className="font-extrabold text-error">${totalFines.toFixed(2)} / ₹{(totalFines * 83).toFixed(0)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                onClick={handlePayFineConfirm}
                disabled={isPayingFine}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-on-primary-fixed-variant disabled:opacity-50"
              >
                {isPayingFine ? 'Processing...' : 'Confirm & Settle Fine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
