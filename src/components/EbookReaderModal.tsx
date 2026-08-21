'use client';

import React, { useState } from 'react';
import { Book } from '@/lib/types';
import { X, BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Moon, Sun, Bookmark } from 'lucide-react';

interface EbookReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const totalPages = 420;

  if (!book) return null;

  const themeClasses = {
    light: 'bg-white text-gray-900',
    sepia: 'bg-[#fbf0d9] text-[#5f4b32]',
    dark: 'bg-[#181a1b] text-[#e8e6e3]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30">
        {/* Top Control Bar */}
        <div className="h-16 px-6 bg-surface-container flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface line-clamp-1">{book.title}</h3>
              <p className="text-xs text-on-surface-variant">Digital eBook Reader • {book.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center gap-1 bg-surface-container-highest p-1 rounded-xl">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-semibold ${theme === 'light' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant'}`}
                title="Light Theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${theme === 'sepia' ? 'bg-[#fbf0d9] text-[#5f4b32] shadow-xs' : 'text-on-surface-variant'}`}
                title="Sepia Theme"
              >
                Sepia
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-semibold ${theme === 'dark' ? 'bg-[#181a1b] text-white shadow-xs' : 'text-on-surface-variant'}`}
                title="Dark Theme"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            {/* Font Zoom Controls */}
            <div className="flex items-center gap-1 bg-surface-container-highest p-1 rounded-xl">
              <button
                onClick={() => setFontSize(f => Math.max(12, f - 2))}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary"
                title="Decrease Font"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold px-1 text-on-surface-variant">{fontSize}px</span>
              <button
                onClick={() => setFontSize(f => Math.min(24, f + 2))}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary"
                title="Increase Font"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body */}
        <div className={`flex-1 overflow-y-auto p-8 sm:p-14 transition-colors duration-200 ${themeClasses[theme]}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="border-b border-current/20 pb-4 text-center">
              <span className="text-xs uppercase tracking-widest opacity-60">Chapter 1 • Foundations & Architecture</span>
              <h1 className="text-2xl font-bold mt-2">{book.title}</h1>
              <p className="text-sm opacity-80 mt-1">Author: {book.author}</p>
            </div>

            <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }} className="space-y-4">
              <p>
                In an era dominated by rapid technological evolution and computational breakthroughs, mastering the underlying theoretical principles is critical. Every intelligent system fundamentally rests on the harmonization of data engineering, robust statistical models, and reproducible algorithms.
              </p>
              <p>
                As demonstrated throughout modern literature, high-performance architectures require decoupling the feature extraction layer from the execution runtime. When dealing with large-scale data representations, vector embeddings and continuous spaces provide the optimal paradigm for rapid similarity searches and inferential deduction.
              </p>
              <div className="my-6 p-4 rounded-xl border border-current/20 bg-current/5 font-mono text-xs">
                <code>
                  // Pseudocode representation of optimization loop<br/>
                  function optimizeGradient(weights, gradients, learningRate) {'{'}<br/>
                  &nbsp;&nbsp;return weights.map((w, i) =&gt; w - learningRate * gradients[i]);<br/>
                  {'}'}
                </code>
              </div>
              <p>
                Furthermore, empirical validation has consistently shown that model interpretability is just as vital as raw predictive accuracy. Without clear grounding and provenance, predictive outputs risk degrading into opaque heuristics.
              </p>
              <p>
                This textbook guides university researchers and students through the end-to-end design, implementation, and evaluation of modern computational algorithms with mathematical rigor and real-world case studies.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="h-16 px-6 bg-surface-container flex items-center justify-between border-t border-outline-variant/30">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-on-surface-variant">Page {currentPage} of {totalPages}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-highest text-xs font-bold text-on-surface-variant hover:text-primary disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-bold px-2 py-1 rounded bg-primary-fixed text-primary">
              {Math.round((currentPage / totalPages) * 100)}% Complete
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-highest text-xs font-bold text-on-surface-variant hover:text-primary disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
