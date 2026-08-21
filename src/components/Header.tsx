'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, SlidersHorizontal, MessageSquare, Search, BookMarked, HelpCircle, Sparkles, ChevronDown } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface HeaderProps {
  activeTab: 'chat' | 'search' | 'loans' | 'faq';
  setActiveTab: (tab: 'chat' | 'search' | 'loans' | 'faq') => void;
  openSettings: () => void;
  fineAmount?: number;
  activeMemberId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
  fineAmount = 0,
  activeMemberId = 'MEM-2026-001'
}) => {
  const [avatarError, setAvatarError] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = localStorage.getItem('smart_lib_nvidia_key');
      setHasApiKey(Boolean(key && key.startsWith('nvapi-')));
    }
  }, []);

  const isAlex = activeMemberId === 'MEM-2026-001';
  const memberName = isAlex ? 'Alex Rivera' : 'Dr. Elena Rostova';
  const memberRole = isAlex ? 'Student' : 'Faculty';
  const memberAvatar = isAlex 
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80';

  return (
    <header className="fixed top-0 w-full z-40 glass-header">
      <div className="h-20 max-w-[1360px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => setActiveTab('chat')}
        >
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-secondary-fixed" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-primary tracking-tight">Smart Library</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary-fixed text-primary">AI Assistant</span>
            </div>
            <p className="text-xs text-on-surface-variant hidden sm:block">Campus Knowledge & Catalog Hub</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-4 bg-surface-container/60 p-1.5 rounded-2xl border border-outline-variant/30">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-primary text-on-primary shadow-sm shadow-primary/30'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-primary text-on-primary shadow-sm shadow-primary/30'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
              activeTab === 'loans'
                ? 'bg-primary text-on-primary shadow-sm shadow-primary/30'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>My Loans</span>
            {fineAmount > 0 && (
              <span className="w-2 h-2 rounded-full bg-error absolute top-1.5 right-1.5 ring-2 ring-surface animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'faq'
                ? 'bg-primary text-on-primary shadow-sm shadow-primary/30'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Rules & FAQ</span>
            <span className="sm:hidden">FAQ</span>
          </button>
        </nav>

        {/* Right Utility: Control Center Settings & Profile Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Settings / Engine Control Center Button */}
          <button 
            onClick={openSettings}
            title="Open AI Engine, Database & Settings Control Center"
            className="h-10 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center gap-2 transition-all border border-outline-variant/30 shadow-2xs hover:shadow-xs group"
          >
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              <span className="w-2 h-2 rounded-full bg-success absolute -top-0.5 -right-0.5 ring-2 ring-surface animate-pulse" />
            </div>
            <span className="text-xs font-bold text-primary hidden md:inline">Settings</span>
          </button>

          {/* Patron Profile Badge */}
          <div 
            onClick={openSettings}
            title="Click to switch patron profile or view account details"
            className="flex items-center gap-2.5 pl-1.5 py-1 pr-3 rounded-full bg-surface-container-lowest border border-outline-variant/30 shadow-xs cursor-pointer hover:border-primary/50 transition-all hover:bg-surface-container-low"
          >
            {!avatarError ? (
              <img
                alt={memberName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                src={memberAvatar}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center ring-2 ring-primary/20">
                {isAlex ? 'AR' : 'ER'}
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-on-surface leading-tight">{memberName}</span>
              <span className="text-[10px] text-on-surface-variant font-medium">{activeMemberId} ({memberRole})</span>
            </div>
            <ChevronDown className="w-3 h-3 text-on-surface-variant hidden lg:block opacity-60" />
          </div>
        </div>
      </div>
    </header>
  );
};
