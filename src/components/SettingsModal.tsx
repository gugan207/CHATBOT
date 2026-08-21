'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Database, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Shield, Cpu } from 'lucide-react';
import { resetLibraryStorage } from '@/lib/mockData';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataReset
}) => {
  const [apiKey, setApiKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('smart_lib_nvidia_key') || '');
      setSupabaseUrl(localStorage.getItem('smart_lib_supabase_url') || '');
      setSupabaseKey(localStorage.getItem('smart_lib_supabase_key') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_lib_nvidia_key', apiKey.trim());
      localStorage.setItem('smart_lib_supabase_url', supabaseUrl.trim());
      localStorage.setItem('smart_lib_supabase_key', supabaseKey.trim());
      setSaveStatus('Settings successfully saved to local session storage!');
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const handleResetData = () => {
    if (confirm('Reset all catalog books, loans, and fines back to initial seed data?')) {
      resetLibraryStorage();
      if (onDataReset) onDataReset();
      setSaveStatus('Database restored to original initial demo records.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Assistant & Backend Configuration</h2>
              <p className="text-xs text-on-surface-variant">LLM API Key, Supabase Integration & Diagnostics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Overview Card */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
            <h3 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>System & Engine Status</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex flex-col">
                <span className="text-on-surface-variant">NLU Engine</span>
                <span className="font-bold text-primary mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {apiKey ? 'NVIDIA DeepSeek V4' : 'Smart Semantic Hybrid Engine'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex flex-col">
                <span className="text-on-surface-variant">Database Mode</span>
                <span className="font-bold text-secondary mt-0.5 flex items-center gap-1">
                  <Database className="w-3 h-3 text-secondary" />
                  {isSupabaseConfigured ? 'Supabase Postgres Live' : 'Persistent Local PG Store'}
                </span>
              </div>
            </div>
          </div>

          {/* NVIDIA API Key Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-primary" />
              <span>NVIDIA API Key (Optional)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="nvapi-..."
              className="w-full h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <p className="text-[11px] text-on-surface-variant">
              Get an API key from <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline">build.nvidia.com</a>. If omitted, the high-performance local semantic parser handles queries with zero latency.
            </p>
          </div>

          {/* Supabase Connection Fields */}
          <div className="space-y-3 pt-2 border-t border-outline-variant/20">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-secondary" />
              <span>Supabase Connection (Optional)</span>
            </label>

            <div className="space-y-2">
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="NEXT_PUBLIC_SUPABASE_URL (e.g. https://xyz.supabase.co)"
                className="w-full h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="NEXT_PUBLIC_SUPABASE_ANON_KEY (eyJhbGci...)"
                className="w-full h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Reset Seed Data */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-on-surface">Reset Catalog & Loans</h4>
              <p className="text-[11px] text-on-surface-variant">Restore default demo books, active loans, and fine records</p>
            </div>
            <button
              onClick={handleResetData}
              className="px-3.5 py-2 rounded-xl bg-surface-container-highest hover:bg-surface-container-high text-xs font-bold text-on-surface-variant flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>

          {/* Feedback message */}
          {saveStatus && (
            <div className="p-3 rounded-xl bg-success-container text-on-success-container border border-success/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-on-primary-fixed-variant transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
