'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChatView } from '@/components/ChatView';
import { SearchView } from '@/components/SearchView';
import { MyLoansView } from '@/components/MyLoansView';
import { RulesFAQView } from '@/components/RulesFAQView';
import { BookDetailModal } from '@/components/BookDetailModal';
import { EbookReaderModal } from '@/components/EbookReaderModal';
import { SettingsModal } from '@/components/SettingsModal';
import { Book } from '@/lib/types';
import { fetchMemberLoans } from '@/lib/supabase';

interface MainAppProps {
  initialTab?: 'chat' | 'search' | 'loans' | 'faq';
}

export const MainApp: React.FC<MainAppProps> = ({ initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'loans' | 'faq'>(initialTab);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fineAmount, setFineAmount] = useState(0);

  const checkFines = async () => {
    try {
      const loans = await fetchMemberLoans('MEM-2026-001');
      const total = loans
        .filter(l => l.status !== 'returned')
        .reduce((sum, l) => sum + (l.fine_amount || 0), 0);
      setFineAmount(total);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkFines();
  }, [activeTab]);

  const handleTabChange = (tab: 'chat' | 'search' | 'loans' | 'faq') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const pathMap: Record<string, string> = {
        chat: '/',
        search: '/search',
        loans: '/loans',
        faq: '/faq'
      };
      window.history.pushState(null, '', pathMap[tab] || '/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        openSettings={() => setIsSettingsOpen(true)}
        fineAmount={fineAmount}
      />

      {/* Main Screen Container with padding for fixed header */}
      <main className="flex-1 pt-20">
        {activeTab === 'chat' && (
          <ChatView
            onSelectBook={(book) => setSelectedBook(book)}
            onNavigateTab={handleTabChange}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            onSelectBook={(book) => setSelectedBook(book)}
            onOpenEbook={(book) => setReadingBook(book)}
          />
        )}

        {activeTab === 'loans' && (
          <MyLoansView
            onSelectBook={(book) => setSelectedBook(book)}
            onNavigateTab={handleTabChange}
          />
        )}

        {activeTab === 'faq' && (
          <RulesFAQView
            onNavigateTab={handleTabChange}
          />
        )}
      </main>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onBookUpdated={() => {
          checkFines();
        }}
        onOpenEbook={(book) => {
          setSelectedBook(null);
          setReadingBook(book);
        }}
      />

      {/* Interactive eBook Reader Modal */}
      <EbookReaderModal
        book={readingBook}
        onClose={() => setReadingBook(null)}
      />

      {/* Settings / API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataReset={() => {
          checkFines();
        }}
      />
    </div>
  );
};
