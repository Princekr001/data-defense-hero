CREATE TABLE public.hack_leaderboard (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  hacker_name text NOT NULL DEFAULT 'Anonymous',
  xp integer NOT NULL DEFAULT 0,
  mastery integer NOT NULL DEFAULT 0,
  certificates integer NOT NULL DEFAULT 0,
  levels_cleared integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.hack_leaderboard TO authenticated;
GRANT SELECT ON public.hack_leaderboard TO anon;
GRANT ALL ON public.hack_leaderboard TO service_role;

ALTER TABLE public.hack_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is viewable by everyone"
  ON public.hack_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Players can create their own entry"
  ON public.hack_leaderboard FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update their own entry"
  ON public.hack_leaderboard FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_hack_leaderboard_updated_at
  BEFORE UPDATE ON public.hack_leaderboard
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();