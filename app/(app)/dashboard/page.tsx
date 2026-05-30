'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { KNOTS, getKnotById } from '@/lib/knots-data';
import { getAllProgress, getJournalEntries, getOverallStats, KnotProgress, SavedEntry } from '@/lib/progress-store';

const movementColors: Record<string, string> = {
  Awareness: '#4A7C6F', Embodiment: '#C49A6C', Integration: '#B8847A', Peace: '#7C6F4A',
};

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<Record<number, KnotProgress>>({});
  const [recentEntries, setRecentEntries] = useState<SavedEntry[]>([]);
  const [stats, setStats] = useState({ totalDone: 0, knotsStarted: 0, knotsFinished: 0 });

  useEffect(() => {
    setProgress(getAllProgress());
    setRecentEntries(getJournalEntries().slice(0, 3));
    setStats(getOverallStats());
  }, []);

  // Find knots in progress (started but not finished)
  const knotsInProgress = KNOTS.filter((k) => {
    const kp = progress[k.id];
    if (!kp) return false;
    const done = kp.usedIndices.length + (kp.completedTruth ? 1 : 0);
    return done > 0 && done < 22;
  });

  return (
    <div className="px-4 pt-8 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#9CA3AF' }}>Welcome back</p>
          <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>Caregiver</h1>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4A7C6F' }}>
          <span className="text-white font-semibold text-sm">C</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Reflections', value: stats.totalDone || 0, sub: 'completed' },
          { label: 'Knots Active', value: stats.knotsStarted || 0, sub: 'in progress' },
          { label: 'Complete', value: stats.knotsFinished || 0, sub: 'of 17 knots' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#E8F0ED' }}>
            <p className="text-lg font-bold" style={{ color: '#4A7C6F' }}>{s.value}</p>
            <p className="text-xs font-medium" style={{ color: '#2C2C2C' }}>{s.label}</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main CTA */}
      <Link href="/journey"
        className="block rounded-2xl p-5 mb-5 text-center"
        style={{ backgroundColor: '#4A7C6F', boxShadow: '0 4px 16px rgba(74,124,111,0.2)' }}>
        <p className="text-2xl mb-2">🪢</p>
        <p className="text-base font-bold text-white mb-1">Begin Today&apos;s Reflection</p>
        <p className="text-sm" style={{ color: '#C8DED9' }}>
          Choose a knot — the app selects a fresh question for you
        </p>
      </Link>

      {/* Knots in progress */}
      {knotsInProgress.length > 0 && (
        <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#2C2C2C' }}>Continue Where You Left Off</h3>
          <div className="space-y-2">
            {knotsInProgress.slice(0, 4).map((knot) => {
              const kp = progress[knot.id]!;
              const done = kp.usedIndices.length + (kp.completedTruth ? 1 : 0);
              const pct = Math.round((done / 22) * 100);
              const color = movementColors[knot.movement];
              return (
                <Link key={knot.id} href={`/today/${knot.id}`}
                  className="flex items-center gap-3 py-2 rounded-xl px-2 hover:bg-[#FAF7F2] transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: color + '22', color }}>
                    {knot.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#2C2C2C' }}>{knot.fullName}</p>
                    <div className="h-1 rounded-full mt-1" style={{ backgroundColor: '#E8F0ED' }}>
                      <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                  <span className="text-xs font-medium flex-shrink-0" style={{ color }}>{done}/22</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent journal */}
      {recentEntries.length > 0 ? (
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>Recent Reflections</h3>
            <Link href="/history" className="text-xs font-medium" style={{ color: '#4A7C6F' }}>View all →</Link>
          </div>
          <div className="space-y-3">
            {recentEntries.map((entry) => {
              const knot = entry.knotId != null ? getKnotById(entry.knotId) : undefined;
              const color = movementColors[knot?.movement ?? 'Awareness'];
              return (
                <div key={entry.id} className="rounded-xl p-3" style={{ backgroundColor: '#FAF7F2' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ backgroundColor: color + '22', color }}>{entry.type}</span>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>{knot?.name}</span>
                    <span className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>{timeAgo(entry.createdAt)}</span>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#2C2C2C' }}>{entry.response}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
          <p className="text-sm mb-1" style={{ color: '#2C2C2C' }}>No reflections yet</p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>Choose a knot above to write your first entry</p>
        </div>
      )}
    </div>
  );
}
