'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KNOTS, MOVEMENTS } from '@/lib/knots-data';
import { getAllProgress, KnotProgress } from '@/lib/progress-store';

const movementColors: Record<string, { bg: string; text: string; border: string }> = {
  Awareness:   { bg: '#4A7C6F18', text: '#4A7C6F', border: '#4A7C6F33' },
  Embodiment:  { bg: '#C49A6C18', text: '#C49A6C', border: '#C49A6C33' },
  Integration: { bg: '#B8847A18', text: '#B8847A', border: '#B8847A33' },
  Peace:       { bg: '#7C6F4A18', text: '#7C6F4A', border: '#7C6F4A33' },
};

export default function JourneyPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Record<number, KnotProgress>>({});
  const [activeMovement, setActiveMovement] = useState<number | null>(null);

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  const getKnotStats = (knotId: number) => {
    const kp = progress[knotId];
    if (!kp) return { done: 0, total: 22, pct: 0, truthDone: false };
    const done = kp.usedIndices.length + (kp.completedTruth ? 1 : 0);
    return { done, total: 22, pct: Math.round((done / 22) * 100), truthDone: kp.completedTruth };
  };

  const handleKnotSelect = (knotId: number) => {
    router.push(`/today/${knotId}`);
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>Choose Your Knot</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          Select any knot — the app will choose a fresh reflection question for you.
        </p>
      </div>

      {/* Movement filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
        <button
          onClick={() => setActiveMovement(null)}
          className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
          style={{
            backgroundColor: activeMovement === null ? '#4A7C6F' : 'transparent',
            color: activeMovement === null ? '#ffffff' : '#9CA3AF',
            borderColor: activeMovement === null ? '#4A7C6F' : '#E8F0ED',
          }}>
          All 17
        </button>
        {MOVEMENTS.map((m) => {
          const c = movementColors[m.name];
          const isActive = activeMovement === m.number;
          return (
            <button key={m.number} onClick={() => setActiveMovement(isActive ? null : m.number)}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
              style={{
                backgroundColor: isActive ? c.text : 'transparent',
                color: isActive ? '#ffffff' : c.text,
                borderColor: isActive ? c.text : c.border,
              }}>
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Knot grid by movement */}
      <div className="space-y-6">
        {MOVEMENTS.filter((m) => activeMovement === null || m.number === activeMovement).map((movement) => {
          const movementKnots = KNOTS.filter((k) => movement.knotIds.includes(k.id));
          const c = movementColors[movement.name];

          return (
            <div key={movement.number}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: c.bg, color: c.text }}>
                  Movement {movement.number}
                </span>
                <span className="text-xs font-semibold" style={{ color: c.text }}>{movement.name}</span>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>— {movement.description}</span>
              </div>

              <div className="space-y-2">
                {movementKnots.map((knot) => {
                  const stats = getKnotStats(knot.id);
                  const isComplete = stats.pct === 100;
                  const hasStarted = stats.done > 0;

                  return (
                    <button key={knot.id} onClick={() => handleKnotSelect(knot.id)}
                      className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98]"
                      style={{
                        backgroundColor: isComplete ? c.bg : '#ffffff',
                        border: isComplete ? `1.5px solid ${c.text}` : '1px solid #E8F0ED',
                        boxShadow: hasStarted && !isComplete ? '0 1px 6px rgba(74,124,111,0.08)' : 'none',
                      }}>

                      {/* Knot number */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{
                          backgroundColor: isComplete ? c.text : hasStarted ? '#E8F0ED' : '#FAF7F2',
                          color: isComplete ? '#ffffff' : hasStarted ? c.text : '#9CA3AF',
                        }}>
                        {isComplete ? '✓' : knot.id}
                      </div>

                      {/* Knot info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#2C2C2C' }}>{knot.fullName}</p>
                        <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{knot.theme}</p>

                        {/* Progress bar */}
                        {hasStarted && (
                          <div className="mt-1.5 h-1 rounded-full" style={{ backgroundColor: '#E8F0ED' }}>
                            <div className="h-1 rounded-full transition-all"
                              style={{ width: `${stats.pct}%`, backgroundColor: c.text }} />
                          </div>
                        )}
                      </div>

                      {/* Right side */}
                      <div className="flex-shrink-0 text-right">
                        {isComplete ? (
                          <span className="text-xs font-semibold" style={{ color: c.text }}>Complete</span>
                        ) : hasStarted ? (
                          <div>
                            <p className="text-xs font-semibold" style={{ color: c.text }}>{stats.done}/22</p>
                            <p className="text-xs" style={{ color: '#9CA3AF' }}>done</p>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: '#C49A6C' }}>Begin →</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center mt-6" style={{ color: '#9CA3AF' }}>
        Each knot has 22 reflections — the Knot&apos;s Truth + 21 questions.<br />
        The app picks a fresh one each time you visit.
      </p>
    </div>
  );
}
