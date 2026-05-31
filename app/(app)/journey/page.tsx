'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KNOTS, MOVEMENTS, MOVEMENT_REFLECTIONS } from '@/lib/knots-data';
import {
  getAllProgress,
  getAllMovementProgress,
  getUserTier,
  BOOK_QUESTION_INDICES,
  DEMO_SAVE_LIMIT,
  getDemoSaveCount,
  KnotProgress,
  MovementProgress,
  UserTier,
} from '@/lib/progress-store';

const movementColors: Record<string, { bg: string; text: string; border: string; dark: string }> = {
  'Surviving the Current':       { bg: '#4A7C6F18', text: '#4A7C6F', border: '#4A7C6F33', dark: '#2E5249' },
  'Loosening the Weight':        { bg: '#C49A6C18', text: '#8B5E2A', border: '#C49A6C33', dark: '#6B4420' },
  'Return to Self & the Sacred': { bg: '#B8847A18', text: '#7D4A43', border: '#B8847A33', dark: '#5C2F2A' },
  'Trust':                       { bg: '#7C6F4A18', text: '#5A4F30', border: '#7C6F4A33', dark: '#3D3520' },
};

export default function JourneyPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Record<number, KnotProgress>>({});
  const [movementProgress, setMovementProgress] = useState<Record<string, MovementProgress>>({});
  const [activeMovement, setActiveMovement] = useState<number | null>(null);
  const [tier, setTier] = useState<UserTier>('demo');
  const [demoCount, setDemoCount] = useState(0);

  useEffect(() => {
    setProgress(getAllProgress());
    setMovementProgress(getAllMovementProgress());
    setTier(getUserTier());
    setDemoCount(getDemoSaveCount());
  }, []);

  const isLocked = tier === 'demo' || tier === 'free'; // Movement deep dives need builder

  /** For a given knot, how many questions are usable in current tier */
  const getQuestionPool = () => (tier === 'free' ? BOOK_QUESTION_INDICES.length : 21);

  const getKnotStats = (knotId: number) => {
    const kp = progress[knotId];
    const pool = getQuestionPool();
    if (!kp) return { done: 0, total: pool, pct: 0, truthDone: false };
    const used = kp.usedIndices.filter(i =>
      tier === 'free' ? BOOK_QUESTION_INDICES.includes(i) : true
    ).length;
    return { done: used, total: pool, pct: Math.round((used / pool) * 100), truthDone: kp.completedTruth };
  };

  const getMovementDeepDiveStats = (movementName: string) => {
    const mp = movementProgress[movementName];
    const used = mp?.usedQuestionIds ?? [];
    const total = MOVEMENT_REFLECTIONS[movementName]?.questions.length ?? 2;
    return { used, total, done: used.length };
  };

  const handleKnotSelect = (knotId: number) => router.push(`/today/${knotId}`);
  const handleMovementDeepDive = (movementName: string) => {
    if (tier === 'demo' || tier === 'free') return; // locked
    router.push(`/today/movement/${encodeURIComponent(movementName)}`);
  };

  const filteredMovements = MOVEMENTS.filter((m) => activeMovement === null || m.number === activeMovement);

  const demoRemaining = Math.max(0, DEMO_SAVE_LIMIT - demoCount);

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>Choose Your Knot</h1>
        <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>
          Select any knot — the app picks a fresh reflection for you.
        </p>
      </div>

      {/* Tier banner */}
      {tier === 'demo' && (
        <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3"
          style={{ backgroundColor: '#C49A6C12', border: '1px solid #C49A6C44' }}>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#7D5C2E' }}>
              Exploring for free · {demoRemaining} save{demoRemaining !== 1 ? 's' : ''} remaining
            </p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              3 book questions per knot · Journal doesn&apos;t persist
            </p>
          </div>
          <Link href="/signup"
            className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#4A7C6F', color: '#ffffff' }}>
            Upgrade
          </Link>
        </div>
      )}

      {tier === 'free' && (
        <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3"
          style={{ backgroundColor: '#4A7C6F12', border: '1px solid #4A7C6F33' }}>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#2E5249' }}>
              Free Tier · 3 book questions per knot
            </p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              Upgrade to unlock all 21 questions + Movement Deep Dives
            </p>
          </div>
          <Link href="/signup"
            className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#4A7C6F', color: '#ffffff' }}>
            Unlock All
          </Link>
        </div>
      )}

      {/* Movement filter */}
      <div className="mb-5">
        <button
          onClick={() => setActiveMovement(null)}
          className="w-full text-sm font-semibold px-4 py-2 rounded-xl border mb-2 transition-all"
          style={{
            backgroundColor: activeMovement === null ? '#4A7C6F' : 'rgba(255,255,255,0.75)',
            color: activeMovement === null ? '#ffffff' : '#4A4A4A',
            borderColor: activeMovement === null ? '#4A7C6F' : '#E8F0ED',
          }}>
          All 17 Knots
        </button>
        <div className="grid grid-cols-2 gap-2">
          {MOVEMENTS.map((m) => {
            const c = movementColors[m.name];
            const isActive = activeMovement === m.number;
            return (
              <button
                key={m.number}
                onClick={() => setActiveMovement(isActive ? null : m.number)}
                className="text-xs font-semibold px-3 py-2.5 rounded-xl border text-left transition-all leading-tight"
                style={{
                  backgroundColor: isActive ? c.dark : 'rgba(255,255,255,0.75)',
                  color: isActive ? '#ffffff' : c.dark,
                  borderColor: isActive ? c.dark : c.border,
                }}>
                <span className="font-bold">{m.number} ·</span> {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Knot list by movement */}
      <div className="space-y-6">
        {filteredMovements.map((movement) => {
          const movementKnots = KNOTS.filter((k) => movement.knotIds.includes(k.id));
          const c = movementColors[movement.name];
          const deepDive = MOVEMENT_REFLECTIONS[movement.name];
          const ddStats = getMovementDeepDiveStats(movement.name);
          const ddLocked = tier !== 'builder';

          return (
            <div key={movement.number}>
              {/* Movement heading */}
              <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: c.bg, color: c.dark }}>
                  Movement {movement.number}
                </span>
                <span className="text-sm font-bold" style={{ color: c.dark }}>{movement.name}</span>
                <span className="text-xs" style={{ color: '#5A5A5A' }}>— {movement.description}</span>
              </div>

              <div className="space-y-2">
                {movementKnots.map((knot) => {
                  const stats = getKnotStats(knot.id);
                  const isComplete = stats.done > 0 && stats.done >= stats.total;
                  const hasStarted = stats.done > 0;
                  const pool = getQuestionPool();

                  return (
                    <button key={knot.id} onClick={() => handleKnotSelect(knot.id)}
                      className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
                      style={{
                        backgroundColor: isComplete ? c.bg : 'rgba(255,255,255,0.92)',
                        border: isComplete ? `1.5px solid ${c.dark}` : '1px solid #E8F0ED',
                        boxShadow: hasStarted && !isComplete ? '0 1px 6px rgba(0,0,0,0.06)' : 'none',
                      }}>

                      {/* Knot number circle */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{
                          backgroundColor: isComplete ? c.dark : hasStarted ? '#E8F0ED' : '#FAF7F2',
                          color: isComplete ? '#ffffff' : hasStarted ? c.dark : '#9CA3AF',
                        }}>
                        {isComplete ? '✓' : knot.id}
                      </div>

                      {/* Knot info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#1A1A1A' }}>{knot.fullName}</p>
                        <p className="text-xs truncate" style={{ color: '#5A5A5A' }}>{knot.theme}</p>
                        {/* Free-tier question count hint */}
                        {(tier === 'demo' || tier === 'free') && !hasStarted && (
                          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                            3 book questions · <span style={{ color: '#C49A6C' }}>18 locked</span>
                          </p>
                        )}
                        {hasStarted && (
                          <div className="mt-1.5 h-1 rounded-full" style={{ backgroundColor: '#E8F0ED' }}>
                            <div className="h-1 rounded-full transition-all"
                              style={{ width: `${stats.pct}%`, backgroundColor: c.dark }} />
                          </div>
                        )}
                      </div>

                      {/* Right action */}
                      <div className="flex-shrink-0 text-right">
                        {isComplete ? (
                          <span className="text-xs font-semibold" style={{ color: c.dark }}>Complete</span>
                        ) : hasStarted ? (
                          <div>
                            <p className="text-xs font-semibold" style={{ color: c.dark }}>{stats.done}/{pool}</p>
                            <p className="text-xs" style={{ color: '#6B7280' }}>done</p>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold" style={{ color: c.dark }}>Begin →</span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Movement Deep Dive card */}
                {deepDive && (
                  <button
                    onClick={() => handleMovementDeepDive(movement.name)}
                    className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98] mt-1"
                    style={{
                      backgroundColor: ddLocked ? 'rgba(255,255,255,0.6)' : ddStats.done === ddStats.total ? c.bg : 'rgba(255,255,255,0.92)',
                      border: `1.5px dashed ${ddLocked ? '#E8F0ED' : c.border}`,
                      opacity: ddLocked ? 0.85 : 1,
                    }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                      style={{
                        backgroundColor: ddLocked ? '#F3F4F6' : c.bg,
                        color: ddLocked ? '#9CA3AF' : c.dark,
                      }}>
                      {ddLocked ? '🔒' : '✦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: ddLocked ? '#9CA3AF' : c.dark }}>
                        {movement.name} · Deep Dive
                      </p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>
                        {ddLocked ? 'Unlocks with Builder subscription' : '2 movement reflections'}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {ddLocked ? (
                        <Link href="/signup" onClick={e => e.stopPropagation()}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: '#4A7C6F', color: '#ffffff' }}>
                          Unlock
                        </Link>
                      ) : ddStats.done === ddStats.total ? (
                        <span className="text-xs font-semibold" style={{ color: c.dark }}>Complete</span>
                      ) : ddStats.done > 0 ? (
                        <div>
                          <p className="text-xs font-semibold" style={{ color: c.dark }}>{ddStats.done}/{ddStats.total}</p>
                          <p className="text-xs" style={{ color: '#6B7280' }}>done</p>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold" style={{ color: c.dark }}>Explore →</span>
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      {tier === 'builder' ? (
        <p className="text-xs text-center mt-6" style={{ color: '#5A5A5A' }}>
          Each knot: 1 Knot&apos;s Truth + 21 reflection questions<br />
          Plus 2 Deep Dive reflections per movement = <strong>365 days</strong>
        </p>
      ) : (
        <div className="mt-6 rounded-2xl p-5 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid #E8F0ED' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#2C2C2C' }}>
            365 days of guided reflection
          </p>
          <p className="text-xs leading-relaxed mb-4" style={{ color: '#6B7280' }}>
            Unlock all 21 questions per knot + 4 Movement Deep Dives.<br />
            Save your journal, track your growth.
          </p>
          <Link href="/signup"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#4A7C6F' }}>
            Start 14-Day Free Trial →
          </Link>
          <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>$6.99/month · Cancel anytime</p>
        </div>
      )}
    </div>
  );
}
