'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface RulesFAQViewProps {
  onNavigateTab: (tab: 'chat' | 'search' | 'loans' | 'faq') => void;
}

interface FAQItem {
  id: string;
  category: 'borrowing' | 'digital' | 'facilities';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'borrowing',
    question: 'How do I renew my borrowed books?',
    answer: 'You can renew standard books up to 2 times, provided no other patron has placed a hold on them and your account has no pending fines. Renewals can be processed directly in the "My Loans" tab online or in person at the circulation desk.'
  },
  {
    id: 'faq-2',
    category: 'borrowing',
    question: 'What is the penalty for late returns?',
    answer: 'The overdue fine is ₹5 ($0.50) per day per overdue item. When a book becomes overdue, automated renewal blocks and new checkout restrictions are placed on the student account until the balance is settled.'
  },
  {
    id: 'faq-3',
    category: 'borrowing',
    question: 'What happens if I lose or damage a book?',
    answer: 'Lost or damaged items must be reported immediately to library staff. You will be responsible for the replacement cost of the book plus a standard ₹100 ($15) cataloging fee. If the original item is recovered in good condition within 30 days, a partial refund is issued.'
  },
  {
    id: 'faq-4',
    category: 'digital',
    question: 'How do I access digital eBooks and research databases?',
    answer: 'All enrolled students have instant 24/7 access to digital resources using their university SSO credentials. Simply look for books marked with the "eBook" badge in our catalog or ask the AI Assistant for digital links.'
  },
  {
    id: 'faq-5',
    category: 'digital',
    question: 'Are there limits on how many eBooks I can read?',
    answer: 'No! Unlike physical books which have limited physical copies, digital eBook resources can be read concurrently by multiple students without checkout caps.'
  },
  {
    id: 'faq-6',
    category: 'facilities',
    question: 'Can I reserve private group study rooms?',
    answer: 'Yes! Group study rooms can be reserved up to 14 days in advance through the campus portal. Reservations are allocated in 3-hour slots per group per day to ensure equitable access across departments.'
  },
  {
    id: 'faq-7',
    category: 'facilities',
    question: 'What are the quiet study floor policies?',
    answer: 'The 3rd and 4th floors are designated strictly as Silent Study Zones. Mobile phone calls, audio without headphones, and group discussions are permitted only on the 1st floor collaborative lounge and cafe area.'
  }
];

export const RulesFAQView: React.FC<RulesFAQViewProps> = ({ onNavigateTab }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'borrowing' | 'digital' | 'facilities'>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>(['faq-1', 'faq-2']);

  const toggleItem = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedIds(FAQ_DATA.map(f => f.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const filteredFaqs = activeCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(f => f.category === activeCategory);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <section className="w-full flex flex-col lg:flex-row gap-8 items-center bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/30 relative overflow-hidden">
        <div className="flex-1 space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Campus Policies</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
            Library Rules & Policies
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Everything you need to know about borrowing privileges, catalog navigation, loan periods, overdue fine schedules, and campus study spaces.
          </p>
        </div>

        <div className="w-full lg:w-96 aspect-video rounded-2xl overflow-hidden shadow-xl relative shrink-0">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
            alt="Modern University Library"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-secondary/20" />
        </div>
      </section>

      {/* 4 Quick Info Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Open Hours */}
        <div className="bg-surface-container rounded-2xl p-6 flex flex-col items-start gap-2 shadow-xs hover:shadow-md transition-all group border border-outline-variant/20">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">Open Hours</h3>
          <p className="text-base font-semibold text-primary">24/7 Digital & Study</p>
          <p className="text-xs text-on-surface-variant">Staffed desk: 8:00 AM – 8:00 PM</p>
        </div>

        {/* Borrow Limit */}
        <div className="bg-surface-container rounded-2xl p-6 flex flex-col items-start gap-2 shadow-xs hover:shadow-md transition-all group border border-outline-variant/20">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">Borrow Limit</h3>
          <p className="text-base font-semibold text-secondary">3 Books (Students)</p>
          <p className="text-xs text-on-surface-variant">10 Books for Faculty members</p>
        </div>

        {/* Loan Period */}
        <div className="bg-surface-container rounded-2xl p-6 flex flex-col items-start gap-2 shadow-xs hover:shadow-md transition-all group border border-outline-variant/20">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">Loan Period</h3>
          <p className="text-base font-semibold text-amber-700">14 Days Standard</p>
          <p className="text-xs text-on-surface-variant">2 renewals allowed per book</p>
        </div>

        {/* Late Fees */}
        <div className="bg-surface-container rounded-2xl p-6 flex flex-col items-start gap-2 shadow-xs hover:shadow-md transition-all group border border-outline-variant/20">
          <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">Late Fees</h3>
          <p className="text-base font-semibold text-error">₹5 / $0.50 / Day</p>
          <p className="text-xs text-on-surface-variant">Per overdue library item</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Frequently Asked Questions</h2>
            <p className="text-xs text-on-surface-variant">Click any topic to expand and read details</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={expandAll}
              className="font-bold text-primary hover:underline"
            >
              Expand All
            </button>
            <span className="text-outline-variant">|</span>
            <button
              onClick={collapseAll}
              className="font-bold text-on-surface-variant hover:text-on-surface"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Category Tabs */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveCategory('borrowing')}
              className={`text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeCategory === 'borrowing'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              General Borrowing
            </button>
            <button
              onClick={() => setActiveCategory('digital')}
              className={`text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeCategory === 'digital'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Digital & eBooks
            </button>
            <button
              onClick={() => setActiveCategory('facilities')}
              className={`text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeCategory === 'facilities'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Facilities & Spaces
            </button>
          </div>

          {/* FAQ Accordion List */}
          <div className="lg:col-span-9 space-y-3">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs border border-outline-variant/30 transition-all"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-on-surface pr-4">
                      {faq.question}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 bg-surface-container-lowest animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA Card */}
      <section className="bg-primary text-on-primary rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <h3 className="text-2xl font-bold text-white">Still Have Questions?</h3>
          <p className="text-sm text-primary-fixed max-w-xl">
            Ask our AI-powered library assistant in natural language. It can check real-time availability, locate shelves on campus, and answer policy queries instantly.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('chat')}
          className="px-6 py-3.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-bold text-sm shadow-md hover:bg-secondary-fixed-dim transition-all flex items-center gap-2 shrink-0 z-10"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask the Assistant</span>
        </button>
      </section>
    </div>
  );
};
