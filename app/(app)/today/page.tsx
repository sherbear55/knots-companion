'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// /today redirects to the journey knot selector
export default function TodayPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/journey'); }, [router]);
  return null;
}
