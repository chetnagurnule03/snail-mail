-- ==========================================
-- SNAIL EMAIL - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase Dashboard SQL Editor
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Letters Table
CREATE TABLE IF NOT EXISTS public.letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  deliver_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_transit', -- 'draft', 'in_transit', 'delivered'
  stamp_type TEXT DEFAULT 'royal_snail', -- 'royal_snail', 'golden_leaf', 'vintage_owl', 'time_capsule'
  stationery_theme TEXT DEFAULT 'classic_parchment', -- 'classic_parchment', 'midnight_star', 'rose_velvet', 'cyber_postal'
  wax_color TEXT DEFAULT '#9b111e', -- Crimson, Navy, Gold, Emerald
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Index for fast querying by delivery date and recipient/sender
CREATE INDEX IF NOT EXISTS idx_letters_sender ON public.letters(sender_id);
CREATE INDEX IF NOT EXISTS idx_letters_recipient ON public.letters(recipient_email);
CREATE INDEX IF NOT EXISTS idx_letters_deliver_at ON public.letters(deliver_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Senders can see their own sent letters
CREATE POLICY "Senders can view their sent letters"
  ON public.letters
  FOR SELECT
  USING (auth.uid() = sender_id OR recipient_email = auth.jwt() ->> 'email');

-- Authenticated users can insert new letters
CREATE POLICY "Authenticated users can create letters"
  ON public.letters
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Senders can update their pending letters before delivery
CREATE POLICY "Senders can update their own pending letters"
  ON public.letters
  FOR UPDATE
  USING (auth.uid() = sender_id AND status = 'in_transit');

-- Senders can delete their letters
CREATE POLICY "Senders can delete their letters"
  ON public.letters
  FOR DELETE
  USING (auth.uid() = sender_id);

-- 5. Auto-update status function for delivered letters
CREATE OR REPLACE FUNCTION update_delivered_letters_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deliver_at <= NOW() AND NEW.status = 'in_transit' THEN
    NEW.status := 'delivered';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_letter_status
  BEFORE INSERT OR UPDATE ON public.letters
  FOR EACH ROW
  EXECUTE FUNCTION update_delivered_letters_status();
