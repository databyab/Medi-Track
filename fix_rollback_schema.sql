-- Run this in your Supabase SQL Editor to ensure your schema is clean after the rollback

-- 1. Remove inventory columns from medications table if they exist
ALTER TABLE public.medications DROP COLUMN IF EXISTS current_stock;
ALTER TABLE public.medications DROP COLUMN IF EXISTS refill_threshold;

-- 2. Remove notes column from dose_history table if it exists
ALTER TABLE public.dose_history DROP COLUMN IF EXISTS notes;

-- 3. Ensure essential columns exist and have correct types (just in case)
-- This won't affect data if they already exist correctly
ALTER TABLE public.medications ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.medications ALTER COLUMN dosage SET NOT NULL;
ALTER TABLE public.medications ALTER COLUMN unit SET NOT NULL;
ALTER TABLE public.medications ALTER COLUMN times SET NOT NULL;
ALTER TABLE public.medications ALTER COLUMN start_date SET NOT NULL;

-- 4. Re-verify RLS policies (simple versions)
-- Owners can do everything
DROP POLICY IF EXISTS "Users can insert their own medications" ON public.medications;
CREATE POLICY "Users can insert their own medications"
  ON public.medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own medications" ON public.medications;
CREATE POLICY "Users can view their own medications"
  ON public.medications FOR SELECT
  USING (auth.uid() = user_id);
