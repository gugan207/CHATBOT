'use client';

import React, { useState, useEffect } from 'react';
import { Book, SearchFiltersState } from '@/lib/types';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  BookOpen, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { queryBooks } from '@/lib/supabase';

interface SearchViewProps {
  onSelectBook: (book: Book) => void;
  onOpenEbook?: (book: Book) => void;
  initialQuery?: string;
}

const CATEGORY_OPTIONS = [
  'Computer Science',
  'Artificial Intelligence',
  'Mathematics',
  'Data Engineering',
  'Design & Architecture'
];

export const SearchView: React.FC<SearchViewProps> = ({ 
  onSelectBook, 
  onOpenEbook,
  initialQuery = '' 
}) => {
  const [filters, setFilters] = useState<SearchFiltersState>({
    query: initialQuery,
    categories: [],
    availability: 'all',
    yearFrom: undefined,
    yearTo: undefined,
    formats: [],
    sortBy: 'relevance'
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const results = await queryBooks(filters);
      setBooks(results);
    } catch (e) {
      console.error('Search query failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [filters]);

  const toggleCategory = (cat: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleFormat = (format: string) => {
    setFilters(prev => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter(f => f !== format)
        : [...prev.formats, format]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      categories: [],
      availability: 'all',
      yearFrom: undefined,
      yearTo: undefined,
      formats: [],
      sortBy: 'relevance'
    });
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-8 relative items-start">
        {/* Mobile Filters Toggle Button */}
        <div className="lg:hidden w-full flex items-center justify-between bg-surface-container p-3 rounded-xl border border-outline-variant/30">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-sm font-bold text-primary"
          >
            <Filter className="w-4 h-4" />
            <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Books & Topics'}</span>
          </button>
          <span className="text-xs text-on-surface-variant">{books.length} Books</span>
        </div>

        {/* Sidebar Filters Panel */}
        <aside className={`w-full lg:w-[280px] shrink-0 sticky top-[100px] bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30 ${
          mobileFilterOpen ? 'block' : 'hidden lg:flex'
        }`}>
          <div className="p-5 bg-surface-container-highest flex items-center justify-between border-b border-outline-variant/20">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Catalog Filters</span>
            </h2>
            {(filters.categories.length > 0 || filters.availability !== 'all' || filters.formats.length > 0 || filters.query) && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="p-5 flex flex-col gap-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Category
              </label>
              <div className="flex flex-col gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isChecked = filters.categories.includes(cat);
                  return (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat)}
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary-fixed-dim accent-primary cursor-pointer"
                      />
                      <span className={`text-xs sm:text-sm font-medium transition-colors ${
                        isChecked ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'
                      }`}>
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="h-[1px] w-full bg-outline-variant/30" />

            {/* Availability Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Availability
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === 'available_only'}
                    onChange={() => setFilters(f => ({ ...f, availability: 'available_only' }))}
                    className="w-4 h-4 border-outline-variant text-primary focus:ring-primary-fixed-dim accent-primary cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    Available Copies Only
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === 'all'}
                    onChange={() => setFilters(f => ({ ...f, availability: 'all' }))}
                    className="w-4 h-4 border-outline-variant text-primary focus:ring-primary-fixed-dim accent-primary cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    Show All Catalog Items
                  </span>
                </label>
              </div>
            </div>

            <div className="h-[1px] w-full bg-outline-variant/30" />

            {/* Publication Year Range Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Publication Year
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="From (e.g. 2015)"
                  value={filters.yearFrom || ''}
                  onChange={(e) => setFilters(f => ({ ...f, yearFrom: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <span className="text-on-surface-variant text-xs">-</span>
                <input
                  type="number"
                  placeholder="To (2026)"
                  value={filters.yearTo || ''}
                  onChange={(e) => setFilters(f => ({ ...f, yearTo: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-outline-variant/30" />

            {/* Format Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Resource Format
              </label>
              <div className="flex flex-wrap gap-2">
                {['Physical Book', 'eBook', 'Audiobook'].map((fmt) => {
                  const active = filters.formats.includes(fmt);
                  return (
                    <button
                      key={fmt}
                      onClick={() => toggleFormat(fmt)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        active
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-dim'
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Search Header Bar */}
          <div className="space-y-4">
            <div className="relative w-full shadow-md rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/40 group focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters(f => ({ ...f, query: e.target.value }))}
                placeholder="Search titles, authors, topics (e.g. Machine Learning, Andrew Ng, Python, Algorithms)..."
                className="w-full h-14 pl-14 pr-28 bg-transparent text-base sm:text-lg font-medium text-on-surface outline-none placeholder:text-outline-variant"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters(f => ({ ...f, query: '' }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-bold bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results Count & Sort By */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-on-surface-variant px-1">
              <div>
                Showing <strong className="text-on-surface">{books.length}</strong> catalog results
                {filters.query && <span> for "<strong className="text-primary">{filters.query}</strong>"</span>}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as any }))}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-2.5 py-1 text-primary font-bold text-xs cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest Edition First</option>
                  <option value="oldest">Oldest Edition First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-56 rounded-2xl bg-surface-container-low animate-pulse" />
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {books.map((book) => {
                const isAvail = book.available_copies > 0;
                return (
                  <article
                    key={book.book_id}
                    onClick={() => onSelectBook(book)}
                    className="group bg-surface-container-lowest rounded-2xl shadow-xs hover:shadow-lg border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-[230px] cursor-pointer ambient-card-hover"
                  >
                    {/* Book Cover Thumbnail */}
                    <div className="w-full sm:w-[150px] h-48 sm:h-full shrink-0 relative overflow-hidden bg-surface-container">
                      <img
                        src={book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      {book.is_digital && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-secondary text-white text-[10px] font-bold shadow-xs">
                          eBook
                        </span>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-hidden">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider truncate">
                            {book.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                            isAvail ? 'bg-success-container text-on-success-container' : 'bg-error-container text-on-error-container'
                          }`}>
                            {isAvail ? `Available (${book.available_copies})` : 'All Copies Borrowed'}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {book.author}
                        </p>
                      </div>

                      {/* Location & Tags */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-semibold text-primary truncate">{book.shelf_section}</span>
                        </div>

                        {/* Bottom Actions Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                          <span className="text-[11px] text-on-surface-variant">
                            {book.publish_year ? `Pub: ${book.publish_year}` : 'Active Edition'}
                          </span>

                          <div className="flex items-center gap-2">
                            {book.is_digital && onOpenEbook && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenEbook(book);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary text-secondary hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>Read</span>
                              </button>
                            )}
                            <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Details <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest mx-auto flex items-center justify-center text-on-surface-variant">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-on-surface">No books matched your search filters</h3>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                Try searching for broader keywords like <em>Machine Learning</em>, <em>Data Engineering</em>, or reset your active filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md shadow-primary/20 hover:bg-on-primary-fixed-variant transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
