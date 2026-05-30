'use client';
import { useEffect, useState } from 'react';
import { getJournalEntries, SavedEntry } from '@/lib/progress-store';
import { getKnotById } from '@/lib/knots-data';

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
  const [entries, setEntries] = useState<SavedEntry[]>([]);

  useEffect(() => { setEntries(getJournalEntries()); }, []);

  // Bottom box: most recent entry's knot truth
  const mostRecentKnot = entries.length > 0 && entries[0].knotId != null
    ? getKnotById(entries[0].knotId)
    : null;

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>My Journal</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {entries.length} reflection{entries.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #E8F0ED' }}>
          <p className="text-3xl mb-3">📓</p>
          <p className="text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Your journal is empty</p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Choose a knot to write your first reflection</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const knot = entry.knotId != null ? getKnotById(entry.knotId) : undefined;
            // Display name: full knot name, or movement deep dive label
            const displayName = knot?.fullName
              ?? (entry.movementName ? `${entry.movementName} · Deep Dive` : entry.knotName);

            // Question label shown in the card
            // For truth entries the question IS the truth — show a brief label instead of repeating it
            const questionDisplay = entry.type === 'truth'
              ? 'Reflecting on the Knot\'s Truth'
              : entry.type === 'movement'
              ? (entry.questionLabel ?? 'Movement reflection')
              : entry.question;

            return (
              <div key={entry.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid #E8F0ED' }}>
                {/* Header — knot name only, no type badge */}
                <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2" style={{ borderBottom: '1px solid #E8F0ED' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{displayName}</span>
                    {entry.isFromBook && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#4A7C6F12', color: '#4A7C6F' }}>📖 book</span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium" style={{ color: '#6B7280' }}>{timeAgo(entry.createdAt)}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{formatDate(entry.createdAt)}</p>
                  </div>
                </div>

                {/* Question being reflected on */}
                <div className="px-4 pt-3">
                  <p className="text-xs leading-relaxed italic" style={{ color: '#9CA3AF', borderLeft: '2px solid #4A7C6F', paddingLeft: '10px' }}>
                    {questionDisplay}
                  </p>
                </div>

                {/* Journal response */}
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

      {/* Bottom box — Knot's Truth from most recent entry's knot */}
      {mostRecentKnot && (
        <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: 'rgba(232,240,237,0.92)', border: '1px solid #C8DED9' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4A7C6F' }}>
            Knot&apos;s Truth
          </p>
          <p className="text-xs leading-relaxed italic" style={{ color: '#2C2C2C' }}>
            &ldquo;{mostRecentKnot.knotsTruth}&rdquo;
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: '#4A7C6F' }}>— {mostRecentKnot.fullName}</p>
        </div>
      )}
    </div>
  );
}
