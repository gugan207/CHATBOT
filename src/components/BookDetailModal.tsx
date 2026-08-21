'use client';

import React, { useState } from 'react';
import { Book } from '@/lib/types';
import { X, CheckCircle, AlertTriangle, BookOpen, MapPin, Bookmark, ExternalLink, Sparkles } from 'lucide-react';
import { borrowBook } from '@/lib/supabase';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onBookUpdated?: () => void;
  onOpenEbook?: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onBookUpdated,
  onOpenEbook
}) => {
  const [isReserving, setIsReserving] = useState(false);
  const [reserveMessage, setReserveMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!book) return null;

  const isAvailable = book.available_copies > 0;

  const handleReserve = async () => {
    setIsReserving(true);
    setReserveMessage(null);

    const res = await borrowBook(book.book_id);
    setIsReserving(false);

    if (res.success) {
      setReserveMessage({ text: res.message, isError: false });
      if (onBookUpdated) onBookUpdated();
    } else {
      setReserveMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-fixed text-primary">
              {book.category}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              ID: {book.book_id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl transition-colors ${
                isSaved ? 'text-primary bg-primary-fixed' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              title="Bookmark book"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-primary' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-36 h-52 shrink-0 rounded-xl overflow-hidden shadow-md bg-surface-container border border-outline-variant/20">
              <img
                src={book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-on-surface leading-snug">
                {book.title}
              </h2>
              <p className="text-base text-on-surface-variant font-medium">
                By <span className="text-primary font-semibold">{book.author}</span>
              </p>

              {/* Quick Metadata Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1 rounded-lg bg-surface-container text-xs font-semibold text-on-surface-variant">
                  {book.subject}
                </span>
                {book.edition && (
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-xs font-semibold text-on-surface-variant">
                    {book.edition}
                  </span>
                )}
                {book.publish_year && (
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-xs font-semibold text-on-surface-variant">
                    Year: {book.publish_year}
                  </span>
                )}
                {book.isbn && (
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-xs font-semibold text-on-surface-variant">
                    ISBN: {book.isbn}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Availability Status Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isAvailable 
              ? 'bg-success-container/40 border-success/30 text-on-success-container' 
              : 'bg-error-container/40 border-error/30 text-on-error-container'
          }`}>
            <div className="flex items-center gap-3">
              {isAvailable ? (
                <div className="w-10 h-10 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-error/20 text-error flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {isAvailable ? 'Available for Checkout' : 'All Copies Currently Borrowed'}
                </h4>
                <p className="text-xs opacity-90">
                  {isAvailable 
                    ? `${book.available_copies} of ${book.total_copies} copies currently available on shelf.`
                    : `0 of ${book.total_copies} available. Next expected return within 7 days.`}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isAvailable ? 'bg-success text-white' : 'bg-error text-white'
            }`}>
              {isAvailable ? `${book.available_copies} Available` : 'Borrowed'}
            </span>
          </div>

          {/* Shelf Location Card */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">Physical Shelf Location</h4>
                <p className="text-sm font-bold text-primary mt-0.5">{book.shelf_section}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
              Interactive Map ↗
            </span>
          </div>

          {/* Summary / Description */}
          {book.summary && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Description</h3>
              <p className="text-sm text-on-surface leading-relaxed bg-surface-container/30 p-4 rounded-xl border border-outline-variant/20">
                {book.summary}
              </p>
            </div>
          )}

          {/* Digital Resource Banner */}
          {book.is_digital && (
            <div className="p-4 rounded-xl bg-secondary-container/30 border border-secondary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Digital eBook Edition Available</h4>
                  <p className="text-xs text-on-surface-variant">Read instantly on your laptop, tablet, or mobile.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onOpenEbook) onOpenEbook(book);
                  else window.open(book.digital_link || '#', '_blank');
                }}
                className="px-4 py-2 rounded-lg bg-secondary text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open eBook</span>
              </button>
            </div>
          )}

          {/* Action Feedback Message */}
          {reserveMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              reserveMessage.isError 
                ? 'bg-error-container text-on-error-container border border-error/30' 
                : 'bg-success-container text-on-success-container border border-success/30'
            }`}>
              {reserveMessage.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
              <span>{reserveMessage.text}</span>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Action Bar */}
        <div className="p-4 px-6 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Close
          </button>

          {isAvailable ? (
            <button
              onClick={handleReserve}
              disabled={isReserving}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-md shadow-primary/20 hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isReserving ? 'Reserving...' : 'Borrow / Reserve This Book'}</span>
            </button>
          ) : (
            <button
              onClick={() => setReserveMessage({ text: 'You have been added to the notification waitlist for this book.', isError: false })}
              className="px-6 py-2.5 rounded-xl bg-surface-container-highest text-primary text-sm font-bold hover:bg-surface-container-high transition-colors"
            >
              Notify Me When Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
