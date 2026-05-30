'use client';
import { useEffect, useState } from 'react';
import { getJournalEntries, SavedEntry } from '@/lib/progress-store';
import { getKnotById } from '@/lib/knots-data';

const typeColors: Record<string, string> = { truth: '#C49A6C', why: '#4A7C6F', what: '#B8847A', where: '#7C6F4A' };
const typeLabels: Record<string, string> = { truth: 'Truth', why: 'Why', what: 'What', where: 'Where' };

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

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>My Journal</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {entries.length} reflection{entries.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
          <p className="text-3xl mb-3">📓</p>
          <p className="text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Your journal is empty</p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Choose a knot to write your first reflection</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const knot = entry.knotId != null ? getKnotById(entry.knotId) : undefined;
            const color = typeColors[entry.type];
            return (
              <div key={entry.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
                <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2" style={{ borderBottom: '1px solid #E8F0ED' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: color + '18', color }}>
                      {typeLabels[entry.type]}
                    </span>
                    <span className="text-xs font-medium" style={{ color: '#2C2C2C' }}>{knot?.name}</span>
                    {entry.isFromBook && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#4A7C6F12', color: '#4A7C6F' }}>📖 book</span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{timeAgo(entry.createdAt)}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{formatDate(entry.createdAt)}</p>
                  </div>
                </div>
                <div className="px-4 pt-3">
                  <p className="text-xs leading-relaxed italic line-clamp-2" style={{ color: '#9CA3AF', borderLeft: `2px solid ${color}`, paddingLeft: '10px' }}>
                    {entry.question}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#2C2C2C' }}>{entry.response}</p>
                </div>
                <div className="px-4 pb-3">
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    {entry.response.trim().split(/\s+/).length} words
                    {entry.isFromBook ? '' : ' · App exclusive question'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 rounded-2xl p-4 text-center" style={{ backgroundColor: '#E8F0ED' }}>
        <p className="text-xs leading-relaxed italic" style={{ color: '#4A7C6F' }}>
          &ldquo;You don&apos;t have to earn the right to feel. Everything you&apos;re feeling is allowed. All of it.&rdquo;
        </p>
        <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>— Knot of Grace</p>
      </div>
    </div>
  );
}
