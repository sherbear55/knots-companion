'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getJournalEntries, SavedEntry } from '@/lib/progress-store';
import { getKnotById } from '@/lib/knots-data';
import { getCurrentUser, getJournalEntriesCloud } from '@/lib/supabase/db';

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function HistoryPage() {
  const [entries, setEntries]       = useState<SavedEntry[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      const loggedIn = !!user;
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const cloudEntries = await getJournalEntriesCloud();
        setEntries(cloudEntries);
      } else {
        setEntries(getJournalEntries());
      }
      setLoading(false);
    }
    load();
  }, []);

  const mostRecentKnot = entries.length > 0 && entries[0].knotId != null
    ? getKnotById(entries[0].knotId)
    : null;

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>My Journal</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            {loading ? 'Loading…' : `${entries.length} reflection${entries.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        {isLoggedIn && (
          <span className="text-xs px-2 py-1 rounded-full mt-1" style={{ backgroundColor: '#4A7C6F18', color: '#4A7C6F' }}>
            ☁ Cloud saved
          </span>
        )}
      </div>

      {/* No-account nudge */}
      {!isLoggedIn && entries.length > 0 && (
        <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3"
          style={{ backgroundColor: '#C49A6C12', border: '1px solid #C49A6C44' }}>
          <p className="text-xs leading-snug" style={{ color: '#7D5C2E' }}>
            These entries are stored on this device only.{' '}
            <Link href="/signup" className="font-semibold underline">Create an account</Link> to save them permanently.
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ backgroundColor: '#E8F0ED' }} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #E8F0ED' }}>
          <p className="text-3xl mb-3">📓</p>
          <p className="text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Your journal is empty</p>
          <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>Choose a knot to write your first reflection</p>
          <Link href="/journey"
            className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#4A7C6F' }}>
            Choose a Knot →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const knot = entry.knotId != null ? getKnotById(entry.knotId) : undefined;
            const displayName = knot?.fullName
              ?? (entry.movementName ? `${entry.movementName} · Deep Dive` : entry.knotName);

            const questionDisplay = entry.type === 'truth'
              ? "Reflecting on the Knot's Truth"
              : entry.type === 'movement'
              ? (entry.questionLabel ?? 'Movement reflection')
              : entry.question;

            return (
              <div key={entry.id} className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid #E8F0ED' }}>
                <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2"
                  style={{ borderBottom: '1px solid #E8F0ED' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{displayName}</span>
                    {entry.isFromBook && (
                      <span className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: '#4A7C6F12', color: '#4A7C6F' }}>📖 book</span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium" style={{ color: '#6B7280' }}>{timeAgo(entry.createdAt)}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{formatDate(entry.createdAt)}</p>
                  </div>
                </div>

                <div className="px-4 pt-3">
                  <p className="text-xs leading-relaxed italic"
                    style={{ color: '#9CA3AF', borderLeft: '2px solid #4A7C6F', paddingLeft: '10px' }}>
                    {questionDisplay}
                  </p>
                </div>

                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#2C2C2C' }}>{entry.response}</p>
                </div>

                <div className="px-4 pb-3">
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    {entry.response.trim().split(/\s+/).length} words
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mostRecentKnot && (
        <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: 'rgba(232,240,237,0.92)', border: '1px solid #C8DED9' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4A7C6F' }}>Knot&apos;s Truth</p>
          <p className="text-xs leading-relaxed italic" style={{ color: '#2C2C2C' }}>
            &ldquo;{mostRecentKnot.knotsTruth}&rdquo;
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: '#4A7C6F' }}>— {mostRecentKnot.fullName}</p>
        </div>
      )}
    </div>
  );
}
