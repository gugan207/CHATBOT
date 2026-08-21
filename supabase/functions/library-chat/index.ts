// =============================================================================
// Supabase Edge Function: library-chat
// Deno TypeScript Runtime
// Connects to NVIDIA DeepSeek API for structured NLU & grounded response generation
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// CORS Headers for client invocation
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NVIDIA_API_KEY = Deno.env.get("NVIDIA_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const NLU_SYSTEM_PROMPT = `You are the NLU (Natural Language Understanding) layer of a smart university library assistant.
Given a user query, analyze the intent and extract relevant search and filter parameters.
Output ONLY a raw, valid JSON object with the following structure, with no markdown fences, no explanatory text, and nothing else:

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
}

Rules:
1. "title": string or null
2. "author": string or null (e.g. "Andrew Ng", "Robert C. Martin", "Bishop")
3. "subject": string or null (e.g. "Machine Learning", "Python", "Linear Algebra")
4. "category": string or null (e.g. "Computer Science", "Artificial Intelligence", "Mathematics", "Design & Architecture", "Data Engineering")
5. "availability": boolean (true if user asks for available/in-stock, false/null otherwise)
6. "is_digital": boolean or null (true if user mentions ebook, online, digital)
7. Only fill slots you are confident about; leave others null.`;

async function callDeepSeek(messages: Array<{ role: string; content: string }>, temperature = 0.2) {
  if (!NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not configured in Supabase secrets.");
  }

  const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/deepseek-v4-flash-0731",
      messages,
      temperature,
      top_p: 0.95,
      max_tokens: 600,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`NVIDIA API call failed with status ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || "";
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_message, member_id = "MEM-2026-001" } = await req.json();

    if (!user_message || typeof user_message !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'user_message' in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: NLU Intent and Slot Extraction Call
    let intent = "general_smalltalk";
    let filters: Record<string, any> = {};

    try {
      const nluRaw = await callDeepSeek([
        { role: "system", content: NLU_SYSTEM_PROMPT },
        { role: "user", content: user_message }
      ], 0.1);

      // Clean response in case LLM added markdown fences
      const cleaned = nluRaw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      intent = parsed.intent || "general_smalltalk";
      filters = parsed.filters || {};
    } catch (nluErr) {
      console.warn("NLU parsing fallback triggered:", nluErr);
      // Heuristic fallback if LLM is unavailable or unparseable
      const lower = user_message.toLowerCase();
      if (lower.includes("time") || lower.includes("open") || lower.includes("close") || lower.includes("hour")) {
        intent = "library_timings";
      } else if (lower.includes("fine") || lower.includes("due") || lower.includes("late") || lower.includes("fee")) {
        intent = "due_date_fine";
      } else if (lower.includes("renew")) {
        intent = "renewal";
      } else if (lower.includes("loan") || lower.includes("my book") || lower.includes("borrowed")) {
        intent = "check_my_loans";
      } else if (lower.includes("rule") || lower.includes("limit") || lower.includes("how many")) {
        intent = "borrowing_rules";
      } else if (lower.includes("machine learning") || lower.includes("ml")) {
        intent = "search_by_subject";
        filters.subject = "Machine Learning";
      } else if (lower.includes("python")) {
        intent = "search_by_subject";
        filters.subject = "Python";
      } else if (lower.includes("andrew ng")) {
        intent = "search_by_author";
        filters.author = "Andrew Ng";
      } else {
        intent = "search_by_subject";
        filters.subject = user_message;
      }
    }

    // Step 2: Query Resolver / Fact Retrieval from Postgres
    let dbResults: any = null;
    let contextData: any = null;

    if (intent === "library_timings" || intent === "borrowing_rules" || intent === "due_date_fine" || intent === "renewal" || intent === "membership_info") {
      const { data: rulesData } = await supabase.from("rules").select("*");
      contextData = { rules: rulesData || [] };
    } else if (intent === "check_my_loans") {
      const { data: memberLoans } = await supabase
        .from("loans")
        .select("*, books(*)")
        .eq("member_id", member_id)
        .order("due_date", { ascending: true });
      contextData = { loans: memberLoans || [] };
      dbResults = memberLoans;
    } else if (intent !== "general_smalltalk") {
      // Books search with dynamic query builder
      let query = supabase.from("books").select("*");
      if (filters.subject) query = query.ilike("subject", `%${filters.subject}%`);
      if (filters.author) query = query.ilike("author", `%${filters.author}%`);
      if (filters.title) query = query.ilike("title", `%${filters.title}%`);
      if (filters.category) query = query.ilike("category", `%${filters.category}%`);
      if (filters.availability === true) query = query.gt("available_copies", 0);
      if (filters.is_digital === true) query = query.eq("is_digital", true);
      if (filters.shelf_section) query = query.ilike("shelf_section", `%${filters.shelf_section}%`);

      const { data: booksData } = await query.limit(10);
      dbResults = booksData || [];
      contextData = { books: dbResults };
    }

    // Step 3: Grounded Natural-Language Response Generation
    const systemPrompt = `You are the friendly, accurate, and concise Smart Library Assistant for university students.
CRITICAL INSTRUCTIONS:
- Ground your answer STRICTLY on the provided database facts.
- NEVER invent or hallucinate books, authors, loan due dates, shelf locations, or fine rates that are not present in the data.
- If no books match, suggest searching by broader category or exploring the catalog.
- Keep responses pleasant, professional, and formatted in readable markdown with bullet points where appropriate.`;

    const userPrompt = `User Query: "${user_message}"
Detected Intent: ${intent}
Extracted Filters: ${JSON.stringify(filters)}
Database Facts / Context: ${JSON.stringify(contextData)}

Write a helpful, concise response:`;

    let reply = "";
    try {
      reply = await callDeepSeek([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ], 0.6);
    } catch (genErr) {
      console.warn("Generation fallback triggered:", genErr);
      if (dbResults && dbResults.length > 0) {
        reply = `I found ${dbResults.length} relevant book(s) in our catalog matching your request, including **${dbResults[0].title}** by ${dbResults[0].author} (${dbResults[0].shelf_section}, ${dbResults[0].available_copies} available).`;
      } else if (intent === "library_timings") {
        reply = "The library is open from **8:00 AM to 8:00 PM** for physical desk circulation, with 24/7 access to digital resources and quiet study spaces.";
      } else if (intent === "due_date_fine") {
        reply = "Overdue fines are **₹5 / $0.50 per day** per overdue item. Please return or renew items before their due date to avoid blocks on borrowing privileges.";
      } else {
        reply = "I am ready to help you search for books, check availability and shelf locations, review loan due dates, or check library rules and policies.";
      }
    }

    return new Response(
      JSON.stringify({
        intent,
        filters,
        results: dbResults,
        reply,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
