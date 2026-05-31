-- ═══════════════════════════════════════════════════════════
-- Knots of Survival: Caregiver Companion — Database Schema
-- Run this once in Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- ── profiles ─────────────────────────────────────────────────
-- Auto-created for every new user via trigger below
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name          TEXT,
  tier          TEXT DEFAULT 'free' CHECK (tier IN ('free', 'builder', 'full')),
  is_founding   BOOLEAN DEFAULT false,
  founding_plan TEXT CHECK (founding_plan IN ('monthly', '6month', '12month')),
  trial_ends_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── journal_entries ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_entries (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  knot_id      INTEGER,
  knot_name    TEXT NOT NULL,
  flat_index   INTEGER NOT NULL DEFAULT -1,
  type         TEXT NOT NULL CHECK (type IN ('truth','why','what','where','movement')),
  question     TEXT NOT NULL,
  is_from_book BOOLEAN DEFAULT false,
  movement_name TEXT,
  response     TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON journal_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON journal_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON journal_entries FOR DELETE USING (auth.uid() = user_id);

-- ── knot_progress ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knot_progress (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  knot_id          INTEGER NOT NULL,
  completed_truth  BOOLEAN DEFAULT false,
  used_indices     INTEGER[] DEFAULT '{}',
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, knot_id)
);

ALTER TABLE knot_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own knot progress"
  ON knot_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own knot progress"
  ON knot_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own knot progress"
  ON knot_progress FOR UPDATE USING (auth.uid() = user_id);

-- ── movement_progress ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS movement_progress (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movement_name     TEXT NOT NULL,
  used_question_ids TEXT[] DEFAULT '{}',
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movement_name)
);

ALTER TABLE movement_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own movement progress"
  ON movement_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own movement progress"
  ON movement_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own movement progress"
  ON movement_progress FOR UPDATE USING (auth.uid() = user_id);

-- ── auto-create profile on signup ─────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── founding seat count (used by app to show live counter) ────
CREATE OR REPLACE FUNCTION get_founding_seats_taken()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM profiles WHERE is_founding = true;
$$ LANGUAGE sql SECURITY DEFINER;
