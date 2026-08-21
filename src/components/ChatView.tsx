'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Book, ChatMessage, ExtractedFilters, IntentCategory } from '@/lib/types';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Bot, 
  User, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Eye, 
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';
import { resolveLibraryQuery } from '@/lib/nluEngine';

interface ChatViewProps {
  onSelectBook: (book: Book) => void;
  onNavigateTab: (tab: 'chat' | 'search' | 'loans' | 'faq') => void;
  activeMemberId?: string;
}

const SUGGESTED_QUERIES = [
  { icon: '📚', label: 'Books on Machine Learning', query: 'Do you have books on machine learning?' },
  { icon: '👤', label: 'Books by Andrew Ng', query: 'Show me something by Andrew Ng' },
  { icon: '🕐', label: 'Library timings', query: 'What time does the library close?' },
  { icon: '💰', label: 'Check my fines', query: 'What is the fine if I return a book 5 days late?' },
  { icon: '📖', label: 'Check my loans', query: 'What books do I currently have checked out?' },
  { icon: '🔍', label: 'Is Clean Code available?', query: 'Is Clean Code by Robert Martin available right now?' },
  { icon: '📐', label: 'Linear Algebra books', query: 'Show me available Linear Algebra books with eBooks' }
];

export const ChatView: React.FC<ChatViewProps> = ({ 
  onSelectBook, 
  onNavigateTab,
  activeMemberId = 'MEM-2026-001'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      role: 'assistant',
      content: `Hello! I'm your **Smart Library Assistant**. I can help you search our catalog across physical and digital collections, locate shelves, check loan due dates, renew books, or explain library borrowing policies.\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showGroundingDebug, setShowGroundingDebug] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = typeof window !== 'undefined' ? localStorage.getItem('smart_lib_nvidia_key') || undefined : undefined;
      const nluRes = await resolveLibraryQuery(text, apiKey, activeMemberId);

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        role: 'assistant',
        content: nluRes.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: nluRes.intent,
        filters: nluRes.filters,
        books: Array.isArray(nluRes.results) && nluRes.results.length > 0 && nluRes.results[0]?.book_id 
          ? (nluRes.results as Book[]) 
          : undefined,
        loanData: Array.isArray(nluRes.results) && nluRes.results.length > 0 && nluRes.results[0]?.loan_id 
          ? nluRes.results 
          : undefined
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble processing that request right now. Please try again or search directly in the Catalog tab.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content: "Chat session refreshed! How can I assist your studies or research today?",
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-[1100px] mx-auto px-4 md:px-6 pt-4 pb-4">
      {/* Top Banner Toolbar */}
      <div className="flex items-center justify-between py-2 px-4 mb-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-bold text-primary">NLU Grounding Engine Active</span>
          <span className="text-on-surface-variant hidden sm:inline">• Pure factual answers from library Postgres catalog</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGroundingDebug(!showGroundingDebug)}
            className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              showGroundingDebug ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showGroundingDebug ? 'Hide NLU Inspector' : 'Inspect NLU / SQL'}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1 rounded-lg text-on-surface-variant hover:text-error transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Chat Thread Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-bubble`}
          >
            <div className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                msg.role === 'user' 
                  ? 'bg-primary-container text-white' 
                  : 'bg-primary text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-secondary-fixed" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col space-y-2">
                <div className={`p-4 sm:p-5 rounded-2xl shadow-xs leading-relaxed text-sm sm:text-base ${
                  msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-tr-xs'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-tl-xs shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content.split('\n\n').map((para, i) => (
                      <p key={i}>
                        {para.split('**').map((chunk, j) => 
                          j % 2 === 1 ? <strong key={j} className={msg.role === 'user' ? 'font-bold text-white' : 'font-bold text-primary'}>{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Message Timestamp */}
                  <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-primary-fixed/80 text-right' : 'text-on-surface-variant'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Grounding & NLU Debug Inspector Pill (If enabled) */}
                {showGroundingDebug && msg.intent && (
                  <div className="p-3 rounded-xl bg-surface-container text-xs font-mono border border-primary/20 space-y-1 text-on-surface-variant">
                    <div className="flex items-center justify-between text-primary font-bold">
                      <span>Detected Intent: <code className="bg-primary-fixed px-1.5 py-0.5 rounded text-primary">{msg.intent}</code></span>
                      <ShieldCheck className="w-3.5 h-3.5 text-success" />
                    </div>
                    {msg.filters && Object.keys(msg.filters).some(k => (msg.filters as any)[k] !== null) && (
                      <div>
                        <span className="font-semibold">Extracted Slots: </span>
                        <code>{JSON.stringify(msg.filters)}</code>
                      </div>
                    )}
                  </div>
                )}

                {/* Inline Book Cards Rendering if results exist */}
                {msg.books && msg.books.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 w-full">
                    {msg.books.slice(0, 4).map((book) => {
                      const isAvail = book.available_copies > 0;
                      return (
                        <div
                          key={book.book_id}
                          onClick={() => onSelectBook(book)}
                          className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md hover:border-primary/40 transition-all cursor-pointer flex gap-3 group"
                        >
                          <img
                            src={book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                            alt={book.title}
                            className="w-16 h-22 object-cover rounded-lg shrink-0 bg-surface-container group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="flex-1 flex flex-col justify-between overflow-hidden">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block truncate">
                                {book.subject}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight mt-0.5">
                                {book.title}
                              </h4>
                              <p className="text-xs text-on-surface-variant truncate mt-0.5">{book.author}</p>
                            </div>

                            <div className="flex items-center justify-between pt-2 mt-auto">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isAvail ? 'bg-success-container text-on-success-container' : 'bg-error-container text-on-error-container'
                              }`}>
                                {isAvail ? `✅ ${book.available_copies} Avail` : '❌ Borrowed'}
                              </span>
                              <span className="text-[11px] font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                                Details <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-bubble">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4 text-secondary-fixed" />
            </div>
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 rounded-tl-xs shadow-xs flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Analyzing intent & querying library catalog...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-outline-variant/20">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Suggestions:
        </span>
        {SUGGESTED_QUERIES.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            disabled={isLoading}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-surface-container-lowest hover:bg-primary-fixed text-on-surface hover:text-primary text-xs font-semibold border border-outline-variant/30 shadow-2xs hover:border-primary/40 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Message Input Box */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1.5"
        >
          <button
            type="button"
            onClick={handleMicToggle}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ml-1 ${
              isListening 
                ? 'bg-error text-white animate-pulse' 
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about books, shelf locations, borrowing rules, or your loan due dates..."
            className="flex-1 px-4 py-3 bg-transparent text-sm sm:text-base text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/20 hover:bg-on-primary-fixed-variant disabled:opacity-40 disabled:hover:bg-primary transition-all shrink-0 mr-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-center text-on-surface-variant mt-1.5">
          Grounds every answer in verified Postgres library records. Never hallucinates book data.
        </p>
      </div>
    </div>
  );
};
