'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MOVEMENT_REFLECTIONS } from '@/lib/knots-data';
import {
  getMovementProgress,
  markMovementQuestionUsed,
  saveJournalEntry,
} from '@/lib/progress-store';

const movementColors: Record<string, string> = {
  Awareness: '#4A7C6F',
  Embodiment: '#C49A6C',
  Integration: '#B8847A',
  Peace: '#7C6F4A',
};

export default function MovementDeepDivePage() {
  const router = useRouter();
  const params = useParams();
  const movementName = decodeURIComponent(params.movementName as string);

  const [response, setResponse] = useState('');
  const [saved, setSaved] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const reflection = MOVEMENT_REFLECTIONS[movementName];
  const color = movementColors[movementName] ?? '#4A7C6F';

  // Pick next unused question
  useEffect(() => {
    if (!reflection) return;
    const mp = getMovementProgress(movementName);
    const unused = reflection.questions.filter(
      (q) => !mp.usedQuestionIds.includes(q.id)
    );
    if (unused.length > 0) {
      setCurrentQuestionId(unused[0].id);
    } else {
      setCurrentQuestionId(null);
    }
  }, [movementName, reflection]);

  if (!reflection) {
    return (
      <div className="px-4 pt-12 text-center">
        <p style={{ color: '#9CA3AF' }}>Movement not found.</p>
        <button onClick={() => router.push('/journey')} className="mt-4 text-sm underline" style={{ color: '#4A7C6F' }}>
          Back to Journey
        </button>
      </div>
    );
  }

  const currentQuestion = reflection.questions.find((q) => q.id === currentQuestionId);
  const allDone = !currentQuestion;

  const handleSave = () => {
    if (!currentQuestion || !response.trim()) return;
    markMovementQuestionUsed(movementName, currentQuestion.id);
    saveJournalEntry({
      id: `${currentQuestion.id}-${Date.now()}`,
      knotId: null,
      knotName: `${movementName} Deep Dive`,
      flatIndex: -1,
      type: 'movement',
      question: currentQuestion.text,
      isFromBook: false,
      movementName,
      questionLabel: currentQuestion.label,
      response: response.trim(),
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  const handleNext = () => {
    const mp = getMovementProgress(movementName);
    const unused = reflection.questions.filter(
      (q) => !mp.usedQuestionIds.includes(q.id)
    );
    if (unused.length > 0) {
      setCurrentQuestionId(unused[0].id);
      setResponse('');
      setSaved(false);
    } else {
      setCurrentQuestionId(null);
    }
  };

  return (
    <div className="px-4 pt-8 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/journey')} className="text-sm" style={{ color: '#9CA3AF' }}>
          ← Knots
        </button>
      </div>

      {/* Movement badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ backgroundColor: color + '18', color }}>
          {movementName} · Deep Dive
        </span>
      </div>

      {allDone ? (
        /* All done screen */
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{ backgroundColor: color + '18' }}>
            ✦
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#2C2C2C' }}>
            {movementName} Complete
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B7280' }}>
            You&apos;ve reflected on both deep dive questions for this movement.<br />
            That is not a small thing.
          </p>
          <button
            onClick={() => router.push('/journey')}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: color }}>
            Back to Journey
          </button>
        </div>
      ) : (
        <>
          {/* Question label */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color }}>
            {currentQuestion?.label}
          </p>

          {/* Question */}
          <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: color + '12', border: `1px solid ${color}30` }}>
            <p className="text-base font-medium leading-relaxed" style={{ color: '#2C2C2C' }}>
              {currentQuestion?.text}
            </p>
          </div>

          {/* Theme note */}
          <p className="text-xs italic mb-4" style={{ color: '#9CA3AF' }}>
            {reflection.theme}
          </p>

          {/* Journal */}
          {!saved ? (
            <>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Take your time. Write what is true for you..."
                rows={7}
                className="w-full rounded-2xl p-4 text-sm resize-none outline-none transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.88)',
                  border: '1.5px solid #E8F0ED',
                  color: '#2C2C2C',
                  lineHeight: '1.7',
                }}
              />
              <button
                onClick={handleSave}
                disabled={!response.trim()}
                className="w-full mt-4 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity"
                style={{
                  backgroundColor: color,
                  opacity: response.trim() ? 1 : 0.4,
                }}>
                Save This Reflection
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl p-4 text-sm leading-relaxed"
                style={{ backgroundColor: 'rgba(255,255,255,0.88)', border: '1px solid #E8F0ED', color: '#2C2C2C' }}>
                {response}
              </div>
              <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>Saved to your journal ✓</p>

              {/* Check if there's another question */}
              {reflection.questions.filter((q) => {
                const mp = getMovementProgress(movementName);
                return !mp.usedQuestionIds.includes(q.id);
              }).length > 0 ? (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl text-sm font-semibold border transition-colors"
                  style={{ borderColor: color, color }}>
                  Next Deep Dive Question →
                </button>
              ) : (
                <button
                  onClick={() => router.push('/journey')}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: color }}>
                  Back to Journey
                </button>
              )}
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-5">
            {reflection.questions.map((q) => {
              const mp = getMovementProgress(movementName);
              const isUsed = mp.usedQuestionIds.includes(q.id);
              const isCurrent = q.id === currentQuestionId;
              return (
                <div key={q.id} className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: isUsed ? color : isCurrent ? color + '80' : '#E8F0ED',
                    transform: isCurrent ? 'scale(1.3)' : 'scale(1)',
                  }} />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
