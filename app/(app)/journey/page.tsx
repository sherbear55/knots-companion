'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KNOTS, MOVEMENTS, MOVEMENT_REFLECTIONS } from '@/lib/knots-data';
import { getAllProgress, getAllMovementProgress, KnotProgress, MovementProgress } from '@/lib/progress-store';

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

  useEffect(() => {
    setProgress(getAllProgress());
    setMovementProgress(getAllMovementProgress());
  }, []);

  const getKnotStats = (knotId: number) => {
    const kp = progress[knotId];
    if (!kp) return { done: 0, total: 21, pct: 0, truthDone: false };
    const questions = kp.usedIndices.length;
    return { done: questions, total: 21, pct: Math.round((questions / 21) * 100), truthDone: kp.completedTruth };
  };

  const getMovementDeepDiveStats = (movementName: string) => {
    const mp = movementProgress[movementName];
    const used = mp?.usedQuestionIds ?? [];
    const total = MOVEMENT_REFLECTIONS[movementName]?.questions.length ?? 2;
    return { used, total, done: used.length };
  };

  const handleKnotSelect = (knotId: number) => router.push(`/today/${knotId}`);
  const handleMovementDeepDive = (movementName: string) => router.push(`/today/movement/${encodeURIComponent(movementName)}`);

  const filteredMovements = MOVEMENTS.filter((m) => activeMovement === null || m.number === activeMovement);

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>Choose Your Knot</h1>
        <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>
          Select any knot — the app picks a fresh reflection for you.
        </p>
      </div>

      {/* Movement filter — wrapping grid layout */}
      <div className="mb-5">
        {/* All 17 button — full width row */}
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

        {/* 2×2 grid for 4 movements */}
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
                  const isComplete = stats.pct === 100;
                  const hasStarted = stats.done > 0;

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
                            <p className="text-xs font-semibold" style={{ color: c.dark }}>{stats.done}/21</p>
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
                      backgroundColor: ddStats.done === ddStats.total ? c.bg : 'rgba(255,255,255,0.92)',
                      border: `1.5px dashed ${c.border}`,
                    }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                      style={{ backgroundColor: c.bg, color: c.dark }}>
                      ✦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: c.dark }}>
                        {movement.name} · Deep Dive
                      </p>
                      <p className="text-xs" style={{ color: '#5A5A5A' }}>
                        2 movement reflections
                      </p>
                      {ddStats.done > 0 && (
                        <div className="mt-1.5 h-1 rounded-full" style={{ backgroundColor: '#E8F0ED' }}>
                          <div className="h-1 rounded-full transition-all"
                            style={{ width: `${Math.round((ddStats.done / ddStats.total) * 100)}%`, backgroundColor: c.dark }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {ddStats.done === ddStats.total ? (
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

      <p className="text-xs text-center mt-6" style={{ color: '#5A5A5A' }}>
        Each knot: 1 Knot&apos;s Truth + 21 reflection questions<br />
        Plus 2 Deep Dive reflections per movement = <strong>365 days</strong>
      </p>
    </div>
  );
}
