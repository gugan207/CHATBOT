// =============================================================================
// Next.js API Route: /api/books
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { queryBooks } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const availability = searchParams.get('availability') as any || 'all';
    const sortBy = searchParams.get('sortBy') as any || 'relevance';

    const books = await queryBooks({
      query,
      categories: category ? [category] : [],
      availability,
      sortBy
    });

    return NextResponse.json({ books, count: books.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
