'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { KNOTS, getKnotById } from '@/lib/knots-data';
import {
  getKnotProgress,
  getRandomUnusedQuestion,
  markQuestionUsed,
  markTruthCompleted,
  saveJournalEntry,
  getDemoSaveCount,
  getUserTier,
  DEMO_SAVE_LIMIT,
  BOOK_QUESTION_INDICES,
  ResolvedQuestion,
} from '@/lib/progress-store';

const typeConfig: Record<string, { label: string; color: string; bg: string; prompt: string }> = {
  truth: { label: "The Knot's Truth",  color: '#C49A6C', bg: '#C49A6C18', prompt: 'Sit with this truth. What does it stir in you?' },
  why:   { label: 'Why Reflection',    color: '#4A7C6F', bg: '#4A7C6F18', prompt: 'Take your time. There are no wrong answers here.' },
  what:  { label: 'What Reflection',   color: '#B8847A', bg: '#B8847A18', prompt: 'Be honest with yourself. This journal is only for you.' },
  where: { label: 'Where Reflection',  color: '#7C6F4A', bg: '#7C6F4A18', prompt: 'Consider where in your life this is landing right now.' },
};

type Phase = 'truth' | 'question' | 'allDone';

// ── Signup prompt modal ───────────────────────────────────────────────────────
function SignupModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-3xl p-7 text-center"
        style={{ backgroundColor: '#FAF7F2', boxShadow: '0 -4px 40px rgba(0,0,0,0.2)' }}>
        <p className="text-3xl mb-3">🪢</p>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>
          Your words matter.
        </h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B7280' }}>
          You&apos;ve written {DEMO_SAVE_LIMIT} reflections. Create an account to save your journey and keep building — your entries will always be there when you return.
        </p>
        <Link href="/signup"
          className="block w-full py-3.5 rounded-xl text-sm font-semibold text-white mb-3"
          style={{ backgroundColor: '#4A7C6F' }}>
          Start My Free Trial — $6.99/mo
        </Link>
        <button onClick={onClose}
          className="block w-full py-2.5 text-sm font-medium rounded-xl"
          style={{ color: '#9CA3AF', border: '1px solid #E8F0ED' }}>
          Keep exploring (entries won&apos;t be saved)
        </button>
        <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>
          14-day free trial · Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default function TodayKnotPage() {
  const params = useParams();
  const knotId = Number(params.knotId);
  const knot = getKnotById(knotId);

  const [phase, setPhase] = useState<Phase>('truth');
  const [resolved, setResolved] = useState<ResolvedQuestion | null>(null);
  const [response, setResponse] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(21);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [tier, setTier] = useState<'demo' | 'free' | 'builder'>('demo');

  useEffect(() => {
    if (!knot) return;
    const currentTier = getUserTier();
    setTier(currentTier);
    const bookOnly = currentTier === 'free';
    const kp = getKnotProgress(knotId);

    const pool = bookOnly ? BOOK_QUESTION_INDICES : Array.from({ length: 21 }, (_, i) => i);
    const left = pool.filter(i => !kp.usedIndices.includes(i)).length;
    setQuestionsLeft(left);

    if (!kp.completedTruth) {
      setPhase('truth');
    } else if (left === 0) {
      setPhase('allDone');
    } else {
      const q = getRandomUnusedQuestion(knotId, knot, bookOnly);
      setResolved(q);
      setPhase('question');
    }
  }, [knotId, knot]);

  if (!knot) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: '#9CA3AF' }}>Knot not found.</p>
      </div>
    );
  }

  /** Returns true if we should block saving (demo limit reached) */
  const isDemoLimitReached = () => tier === 'demo' && getDemoSaveCount() >= DEMO_SAVE_LIMIT;

  const handleSaveTruth = async () => {
    if (!response.trim()) return;
    if (isDemoLimitReached()) { setShowSignupModal(true); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    markTruthCompleted(knotId);
    saveJournalEntry({
      id: Date.now().toString(),
      knotId, knotName: knot.name,
      flatIndex: -1, type: 'truth',
      question: knot.knotsTruth,
      isFromBook: true,
      response,
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    setSaved(true);
  };

  const handleSaveQuestion = async () => {
    if (!response.trim() || !resolved) return;
    if (isDemoLimitReached()) { setShowSignupModal(true); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    markQuestionUsed(knotId, resolved.flatIndex);
    saveJournalEntry({
      id: Date.now().toString(),
      knotId, knotName: knot.name,
      flatIndex: resolved.flatIndex,
      type: resolved.type,
      question: resolved.question,
      isFromBook: resolved.isFromBook,
      response,
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    setSaved(true);
    setQuestionsLeft((q) => q - 1);
  };

  const handleNextQuestion = () => {
    setSaved(false);
    setResponse('');
    setPhase('question');
    const bookOnly = tier === 'free';
    const q = getRandomUnusedQuestion(knotId, knot, bookOnly);
    setResolved(q);
  };

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;
  const demoCount = tier === 'demo' ? getDemoSaveCount() : 0;
  const demoRemaining = Math.max(0, DEMO_SAVE_LIMIT - demoCount);

  // ── All done ──────────────────────────────────────────────────────────────
  if (phase === 'allDone') {
    const isBookLimit = tier === 'free';
    return (
      <div className="px-4 pt-8 pb-4">
        <Link href="/journey" className="flex items-center gap-2 mb-6 text-sm" style={{ color: '#4A7C6F' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          All Knots
        </Link>
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
          <p className="text-4xl mb-4">🪢</p>
          {isBookLimit ? (
            <>
              <h2 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>You&apos;ve completed the 3 book questions</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
                {knot.fullName} has 18 more exclusive reflection questions waiting for you.
              </p>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white mb-3"
                style={{ backgroundColor: '#4A7C6F' }}>
                Unlock All 21 Questions — $6.99/mo →
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-2" style={{ color: '#2C2C2C' }}>You&apos;ve completed {knot.fullName}</h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B7280' }}>
                All 21 reflections in this knot are done. Every question has been answered, every truth has been witnessed.
              </p>
            </>
          )}
          <p className="text-xs italic mb-6" style={{ color: '#C49A6C', borderLeft: '3px solid #C49A6C', paddingLeft: '12px', textAlign: 'left' }}>
            {knot.knotsTruth}
          </p>
          <Link href="/journey" className="block w-full text-center py-3 rounded-xl text-sm font-semibold border"
            style={{ borderColor: '#E8F0ED', color: '#6B7280' }}>
            Choose Another Knot
          </Link>
        </div>
      </div>
    );
  }

  const isTruth = phase === 'truth';
  const currentType = isTruth ? 'truth' : (resolved?.type ?? 'why');
  const currentQuestion = isTruth ? knot.knotsTruth : (resolved?.question ?? '');
  const config = typeConfig[currentType];
  const isFromBook = isTruth || resolved?.isFromBook;

  return (
    <>
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}

      <div className="px-4 pt-8 pb-4">
        {/* Back + header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/journey" className="p-1.5 rounded-lg" style={{ color: '#4A7C6F' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div className="flex-1">
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              {isTruth
                ? 'Beginning this knot'
                : tier === 'demo'
                  ? `${demoRemaining} free save${demoRemaining !== 1 ? 's' : ''} remaining · ${questionsLeft} question${questionsLeft !== 1 ? 's' : ''} left`
                  : `${questionsLeft} reflection${questionsLeft !== 1 ? 's' : ''} remaining`}
            </p>
            <h1 className="text-base font-semibold" style={{ color: '#2C2C2C' }}>{knot.fullName}</h1>
          </div>
        </div>

        {/* Demo nudge banner */}
        {tier === 'demo' && demoRemaining <= 1 && demoRemaining > 0 && !isTruth && (
          <div className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
            style={{ backgroundColor: '#C49A6C18', border: '1px solid #C49A6C44' }}>
            <span className="text-base">✨</span>
            <p className="text-xs leading-snug" style={{ color: '#7D5C2E' }}>
              This is your last free save. <Link href="/signup" className="font-semibold underline">Create an account</Link> to keep your journey.
            </p>
          </div>
        )}

        {/* Type badge */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
            style={{ backgroundColor: config.bg, color: config.color }}>
            {config.label}
          </span>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>{knot.theme}</span>
          {!isTruth && (
            <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
              style={{
                backgroundColor: isFromBook ? '#4A7C6F18' : '#E8F0ED',
                color: isFromBook ? '#4A7C6F' : '#9CA3AF',
              }}>
              {isFromBook ? '📖 Also in the book' : '✦ App exclusive'}
            </span>
          )}
        </div>

        {/* The question / truth */}
        <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
          {isTruth && (
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#C49A6C' }}>
              Start Here — The Knot&apos;s Truth
            </p>
          )}
          <p className="text-base leading-relaxed font-medium"
            style={{ color: '#2C2C2C', borderLeft: `3px solid ${config.color}`, paddingLeft: '14px' }}>
            {currentQuestion}
          </p>
          <p className="text-xs mt-4 italic" style={{ color: '#9CA3AF' }}>{config.prompt}</p>

          {isTruth && (
            <p className="text-xs mt-3 leading-relaxed" style={{ color: '#6B7280' }}>
              After reflecting on this truth, your reflection questions for this knot will begin — each visit, a fresh question chosen just for you.
            </p>
          )}
        </div>

        {/* Journal area */}
        <div className="rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E8F0ED' }}>
          <div className="px-4 pt-4 pb-2" style={{ borderBottom: '1px solid #E8F0ED' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>Your Reflection</p>
          </div>
          <textarea
            value={response} onChange={(e) => setResponse(e.target.value)}
            placeholder="Begin writing here… There is no right way to do this. Only your way."
            rows={8} disabled={saved}
            className="w-full px-4 py-4 text-sm leading-relaxed resize-none border-0"
            style={{ backgroundColor: '#ffffff', color: '#2C2C2C', outline: 'none', fontFamily: 'inherit' }} />
          <div className="px-4 py-2 flex items-center justify-between" style={{ borderTop: '1px solid #E8F0ED' }}>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>
              {wordCount > 0 ? `${wordCount} word${wordCount !== 1 ? 's' : ''}` : 'No minimum — write what comes'}
            </span>
            {saved && <span className="text-xs font-medium" style={{ color: '#4A7C6F' }}>✓ Saved</span>}
          </div>
        </div>

        {/* Save / next */}
        {!saved ? (
          <button
            onClick={isTruth ? handleSaveTruth : handleSaveQuestion}
            disabled={!response.trim() || saving}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: response.trim() ? '#4A7C6F' : '#E8F0ED',
              color: response.trim() ? '#ffffff' : '#9CA3AF',
              cursor: response.trim() ? 'pointer' : 'not-allowed',
            }}>
            {saving ? 'Saving…' : 'Save My Reflection'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="w-full py-3.5 rounded-xl text-sm font-semibold text-center" style={{ backgroundColor: '#E8F0ED', color: '#4A7C6F' }}>
              ✓ Reflection saved
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/journey" className="block text-center py-3 rounded-xl text-sm font-medium border"
                style={{ borderColor: '#E8F0ED', color: '#9CA3AF' }}>
                Choose Another Knot
              </Link>
              <button onClick={handleNextQuestion}
                className="py-3 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: '#4A7C6F', color: '#ffffff' }}
                disabled={questionsLeft <= 0}>
                {questionsLeft > 0 ? 'Another Question →' : 'All Done!'}
              </button>
            </div>
          </div>
        )}

        {/* Knot's truth footer (on question view) */}
        {!isTruth && (
          <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: '#FAF7F2', border: '1px solid #C49A6C33' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#C49A6C' }}>The Knot&apos;s Truth</p>
            <p className="text-xs leading-relaxed italic" style={{ color: '#6B7280' }}>{knot.knotsTruth}</p>
          </div>
        )}
      </div>
    </>
  );
}
