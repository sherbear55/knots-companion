import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_founding', true)
      .eq('tier', 'founder');

    if (error) throw error;

    return NextResponse.json({ taken: count ?? 0 });
  } catch (err) {
    console.error('Founding seats fetch error:', err);
    // Fall back to 0 on error so the page still loads
    return NextResponse.json({ taken: 0 });
  }
}
