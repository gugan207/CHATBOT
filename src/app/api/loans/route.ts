// =============================================================================
// Next.js API Route: /api/loans
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { fetchMemberLoans, borrowBook, renewLoan, returnLoan, payMemberFine } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId') || 'MEM-2026-001';
    const loans = await fetchMemberLoans(memberId);
    return NextResponse.json({ loans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, bookId, loanId, memberId = 'MEM-2026-001' } = body;

    if (action === 'borrow') {
      const res = await borrowBook(bookId, memberId);
      return NextResponse.json(res);
    }

    if (action === 'renew') {
      const res = await renewLoan(loanId);
      return NextResponse.json(res);
    }

    if (action === 'return') {
      const res = await returnLoan(loanId);
      return NextResponse.json(res);
    }

    if (action === 'pay_fine') {
      const res = await payMemberFine(memberId);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: 'Unknown action parameter' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
