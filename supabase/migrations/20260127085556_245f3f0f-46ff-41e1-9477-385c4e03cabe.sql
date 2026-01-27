-- Create game_saves table for cloud synchronization
CREATE TABLE public.game_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slot_id INTEGER NOT NULL,
  slot_name TEXT NOT NULL DEFAULT 'Save',
  progress JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  playtime TEXT NOT NULL DEFAULT '0m',
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, slot_id)
);

-- Enable Row Level Security
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - users can only access their own saves
CREATE POLICY "Users can view their own saves"
ON public.game_saves
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saves"
ON public.game_saves
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saves"
ON public.game_saves
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
ON public.game_saves
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_game_saves_updated_at
BEFORE UPDATE ON public.game_saves
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();