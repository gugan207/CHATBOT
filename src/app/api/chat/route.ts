// =============================================================================
// Next.js API Route: /api/chat
// Provides REST endpoint for the Smart Library Assistant chat interface
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveLibraryQuery } from '@/lib/nluEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, apiKey, memberId = 'MEM-2026-001' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing "message" parameter in request body.' },
        { status: 400 }
      );
    }

    const nluResult = await resolveLibraryQuery(message, apiKey, memberId);

    return NextResponse.json(nluResult);
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during chat processing.' },
      { status: 500 }
    );
  }
}
