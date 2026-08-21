// =============================================================================
// Natural Language Understanding (NLU) & Intent Resolution Engine
// Supports NVIDIA DeepSeek V4 LLM + High-Fidelity Heuristic Semantic Fallback
// =============================================================================

import { ExtractedFilters, IntentCategory, NLUResponse, Book, Rule, Loan } from './types';
import { queryBooks, fetchRules, fetchMemberLoans, fetchAllBooks } from './supabase';

const NLU_SYSTEM_PROMPT = `You are the NLU (Natural Language Understanding) layer of a smart university library assistant.
Given a user query, extract the intent and search filters. Output ONLY a valid JSON object without markdown or extra text:

{
  "intent": "<one of: search_by_subject, search_by_author, search_by_category_location, check_availability, multi_condition_search, borrowing_rules, due_date_fine, renewal, library_timings, digital_resources, membership_info, check_my_loans, general_smalltalk>",
  "filters": {
    "title": null,
    "author": null,
    "subject": null,
    "category": null,
    "availability": null,
    "shelf_section": null,
    "is_digital": null,
    "published_after": null,
    "published_before": null
  },
  "raw_query": "<original user query>"
}`;

// Semantic rule-based parser for instantaneous or offline execution
export function parseIntentOffline(query: string): { intent: IntentCategory; filters: ExtractedFilters } {
  const text = query.toLowerCase().trim();
  const filters: ExtractedFilters = {
    title: null,
    author: null,
    subject: null,
    category: null,
    availability: null,
    shelf_section: null,
    is_digital: null,
    published_after: null,
    published_before: null
  };

  // 1. Library Timings / Hours
  if (/\b(time|timing|timings|open|close|hours|schedule)\b/.test(text)) {
    return { intent: 'library_timings', filters };
  }

  // 2. Fines & Due Dates
  if (/\b(fine|fines|fee|fees|penalty|charge|cost of late|late return|overdue)\b/.test(text)) {
    return { intent: 'due_date_fine', filters };
  }

  // 3. Renewals
  if (/\b(renew|renewal|extend|extend loan|keep longer)\b/.test(text)) {
    return { intent: 'renewal', filters };
  }

  // 4. Borrowing Rules & Limits
  if (/\b(how many books|borrow limit|borrowing rule|allowance|max books|rules)\b/.test(text)) {
    return { intent: 'borrowing_rules', filters };
  }

  // 5. Membership Info
  if (/\b(join|card|register|sign up|membership|account|guest)\b/.test(text)) {
    return { intent: 'membership_info', filters };
  }

  // 6. Check My Loans
  if (/\b(my loans|my books|borrowed by me|what do i have|checked out|due date)\b/.test(text)) {
    return { intent: 'check_my_loans', filters };
  }

  // 7. Check Availability specific phrase
  if (/\b(available|in stock|copies left|is .* available|do you have)\b/.test(text)) {
    filters.availability = true;
  }

  // Digital check
  if (/\b(ebook|e-book|digital|online|pdf)\b/.test(text)) {
    filters.is_digital = true;
  }

  // Specific Author checks
  if (/\b(andrew ng|ng)\b/.test(text)) {
    filters.author = 'Andrew Ng';
    return { intent: 'search_by_author', filters };
  }
  if (/\b(martin|robert martin|uncle bob)\b/.test(text)) {
    filters.author = 'Robert C. Martin';
    return { intent: 'search_by_author', filters };
  }
  if (/\b(geron|aurelien|aurélien)\b/.test(text)) {
    filters.author = 'Aurélien Géron';
    return { intent: 'search_by_author', filters };
  }
  if (/\b(bishop)\b/.test(text)) {
    filters.author = 'Christopher M. Bishop';
    return { intent: 'search_by_author', filters };
  }
  if (/\b(norman|don norman)\b/.test(text)) {
    filters.author = 'Don Norman';
    return { intent: 'search_by_author', filters };
  }
  if (/\b(strang|gilbert strang)\b/.test(text)) {
    filters.author = 'Gilbert Strang';
    return { intent: 'search_by_author', filters };
  }
  if (/\b(kleppmann)\b/.test(text)) {
    filters.author = 'Martin Kleppmann';
    return { intent: 'search_by_author', filters };
  }

  // Specific Subjects / Categories
  if (/\b(machine learning|ml)\b/.test(text)) {
    filters.subject = 'Machine Learning';
    return { intent: filters.availability ? 'multi_condition_search' : 'search_by_subject', filters };
  }
  if (/\b(deep learning|neural network|neural networks)\b/.test(text)) {
    filters.subject = 'Deep Learning';
    return { intent: filters.availability ? 'multi_condition_search' : 'search_by_subject', filters };
  }
  if (/\b(python|python programming)\b/.test(text)) {
    filters.subject = 'Python';
    return { intent: filters.availability ? 'multi_condition_search' : 'search_by_subject', filters };
  }
  if (/\b(linear algebra|algebra|matrices)\b/.test(text)) {
    filters.subject = 'Linear Algebra';
    return { intent: 'search_by_subject', filters };
  }
  if (/\b(artificial intelligence|ai)\b/.test(text)) {
    filters.category = 'Artificial Intelligence';
    return { intent: 'search_by_subject', filters };
  }
  if (/\b(data engineering|distributed systems|database)\b/.test(text)) {
    filters.category = 'Data Engineering';
    return { intent: 'search_by_subject', filters };
  }
  if (/\b(design|architecture|everyday things)\b/.test(text)) {
    filters.category = 'Design & Architecture';
    return { intent: 'search_by_subject', filters };
  }
  if (/\b(shelf|location|floor|where is|where can i find)\b/.test(text)) {
    return { intent: 'search_by_category_location', filters };
  }

  // Smalltalk check
  if (/^(hi|hello|hey|good morning|good evening|thanks|thank you|who are you|help)$/.test(text)) {
    return { intent: 'general_smalltalk', filters };
  }

  // Default to general search
  filters.title = query;
  return { intent: 'search_by_subject', filters };
}

// Full Intent + Data Grounding Resolver
export async function resolveLibraryQuery(
  userQuery: string,
  apiKey?: string,
  memberId: string = 'MEM-2026-001'
): Promise<NLUResponse> {
  const startTime = Date.now();
  let intent: IntentCategory = 'general_smalltalk';
  let filters: ExtractedFilters = {};

  const effectiveKey = apiKey || process.env.NVIDIA_API_KEY;

  // Try LLM Extraction if API key is provided
  if (effectiveKey && !effectiveKey.includes('your-key')) {
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-ai/deepseek-v4-flash-0731',
          messages: [
            { role: 'system', content: NLU_SYSTEM_PROMPT },
            { role: 'user', content: userQuery }
          ],
          temperature: 0.1,
          max_tokens: 512
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawContent = data.choices?.[0]?.message?.content || '';
        const cleanJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        intent = parsed.intent || intent;
        filters = parsed.filters || {};
      } else {
        const offline = parseIntentOffline(userQuery);
        intent = offline.intent;
        filters = offline.filters;
      }
    } catch (e) {
      console.warn('NVIDIA DeepSeek Extraction fallback to rule engine:', e);
      const offline = parseIntentOffline(userQuery);
      intent = offline.intent;
      filters = offline.filters;
    }
  } else {
    // Offline Rule Engine
    const offline = parseIntentOffline(userQuery);
    intent = offline.intent;
    filters = offline.filters;
  }

  // Query Real Database / Grounding Layer
  let results: any = null;
  let reply = '';
  const groundedFacts: string[] = [];

  switch (intent) {
    case 'library_timings': {
      const rules = await fetchRules();
      const openTime = rules.find(r => r.rule_key === 'library_open_time')?.rule_value || '08:00 AM';
      const closeTime = rules.find(r => r.rule_key === 'library_close_time')?.rule_value || '08:00 PM';
      groundedFacts.push(`Staffed Desk: ${openTime} - ${closeTime}`);
      groundedFacts.push('Digital Resources & Study Rooms: 24/7 Access');
      reply = `The library's physical circulation desk is open **Monday through Saturday from ${openTime} to ${closeTime}**. Online eBook portals and quiet study facilities are accessible **24/7** with your active student badge.`;
      results = rules.filter(r => r.category === 'timings');
      break;
    }

    case 'borrowing_rules': {
      const rules = await fetchRules();
      const maxBooks = rules.find(r => r.rule_key === 'max_books_student')?.rule_value || '3';
      const maxDays = rules.find(r => r.rule_key === 'max_days_student')?.rule_value || '14';
      const renewalLimit = rules.find(r => r.rule_key === 'renewal_limit')?.rule_value || '2';
      groundedFacts.push(`Student Borrow Limit: ${maxBooks} items`);
      groundedFacts.push(`Loan Duration: ${maxDays} days`);
      groundedFacts.push(`Max Renewals: ${renewalLimit} times`);
      reply = `As a student, you can borrow up to **${maxBooks} books simultaneously** for **${maxDays} days**. Each book can be renewed up to **${renewalLimit} times** provided there is no pending hold or overdue fine.`;
      results = rules.filter(r => r.category === 'borrowing' || r.category === 'renewals');
      break;
    }

    case 'due_date_fine': {
      const rules = await fetchRules();
      const finePerDay = rules.find(r => r.rule_key === 'fine_per_day')?.rule_value || '5';
      const loans = await fetchMemberLoans(memberId);
      const overdueLoans = loans.filter(l => l.status === 'overdue' || l.fine_amount > 0);
      const totalFine = overdueLoans.reduce((sum, l) => sum + (l.fine_amount || 0), 0);

      groundedFacts.push(`Fine Rate: ₹${finePerDay} / $0.50 per day`);
      if (totalFine > 0) {
        groundedFacts.push(`Current Account Balance: $${totalFine.toFixed(2)}`);
        reply = `The library charges **₹${finePerDay} / $0.50 per day** for overdue items. You currently have **$${totalFine.toFixed(2)}** in pending fines across ${overdueLoans.length} overdue item(s). You can pay via the *My Loans* screen to restore full borrowing privileges.`;
      } else {
        reply = `Overdue books accrue a late fee of **₹${finePerDay} / $0.50 per day**. Your account currently has **$0.00 in outstanding fines** with all loans in good standing.`;
      }
      results = overdueLoans;
      break;
    }

    case 'check_my_loans': {
      const loans = await fetchMemberLoans(memberId);
      const activeLoans = loans.filter(l => l.status !== 'returned');
      groundedFacts.push(`Active Loans Count: ${activeLoans.length}`);
      if (activeLoans.length > 0) {
        const titles = activeLoans.map(l => `• **${l.book?.title || l.book_id}** (Due: ${l.due_date})`).join('\n');
        reply = `You currently have **${activeLoans.length} book(s) checked out**:\n\n${titles}\n\nYou can renew eligible items directly from the *My Loans* tab.`;
      } else {
        reply = `You do not have any active loans right now. You can borrow up to 3 books anytime from our catalog!`;
      }
      results = activeLoans;
      break;
    }

    case 'membership_info': {
      reply = `All enrolled university students automatically receive library privileges linked to their student ID card (**${memberId}**). Guests and alumni can register for guest access at the circulation desk on the 1st floor with government ID.`;
      groundedFacts.push(`Patron ID: ${memberId}`);
      break;
    }

    case 'general_smalltalk': {
      reply = `Hello! 👋 I am your **Smart Library Assistant**. I can help you find books across Computer Science, AI, and Mathematics, check copy availability & shelf locations, view borrowing rules, calculate fines, and manage your active loans. What would you like to explore today?`;
      break;
    }

    case 'search_by_author':
    case 'search_by_subject':
    case 'search_by_category_location':
    case 'check_availability':
    case 'multi_condition_search':
    case 'digital_resources':
    default: {
      const searchParams: any = {};
      if (filters.subject) searchParams.query = filters.subject;
      if (filters.author) searchParams.query = filters.author;
      if (filters.title) searchParams.query = filters.title;
      if (filters.category) searchParams.categories = [filters.category];
      if (filters.availability === true) searchParams.availability = 'available_only';
      if (filters.is_digital === true) searchParams.formats = ['eBook'];

      let matchingBooks = await queryBooks(searchParams);

      // If no direct query matched, fallback to general match on userQuery
      if (matchingBooks.length === 0 && userQuery.length > 2) {
        matchingBooks = await queryBooks({ query: userQuery });
      }

      results = matchingBooks;

      if (matchingBooks.length > 0) {
        const totalAvail = matchingBooks.filter(b => b.available_copies > 0).length;
        const topBooks = matchingBooks.slice(0, 3);
        groundedFacts.push(`Found ${matchingBooks.length} match(es), ${totalAvail} currently available`);

        const listPreview = topBooks.map(b => 
          `• **${b.title}** by *${b.author}* — 📍 ${b.shelf_section} (${b.available_copies > 0 ? `✅ ${b.available_copies} available` : '❌ All copies borrowed'})`
        ).join('\n');

        reply = `I found **${matchingBooks.length} book(s)** matching your query (${totalAvail} available right now):\n\n${listPreview}\n\nTap any card below to view full details or reserve a copy!`;
      } else {
        reply = `I couldn't find any books matching "${userQuery}" in our catalog. Try searching by a broad topic like *Machine Learning*, *Python*, *Algorithms*, or *Linear Algebra*.`;
      }
      break;
    }
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    intent,
    filters,
    raw_query: userQuery,
    results,
    reply,
    groundedFacts,
    executionTimeMs
  };
}
