-- Create JackpotDraws table
CREATE TABLE IF NOT EXISTS jackpot_draws (
    draw_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    draw_name VARCHAR(100) NOT NULL,
    prize_amount DECIMAL(10,2) NOT NULL CHECK (prize_amount > 0),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    winner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    draw_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure end_date is after start_date
    CONSTRAINT check_draw_dates CHECK (end_date > start_date),
    
    -- Ensure draw_date is after end_date when set
    CONSTRAINT check_draw_date CHECK (draw_date IS NULL OR draw_date >= end_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jackpot_draws_is_active ON jackpot_draws(is_active);
CREATE INDEX IF NOT EXISTS idx_jackpot_draws_start_date ON jackpot_draws(start_date);
CREATE INDEX IF NOT EXISTS idx_jackpot_draws_end_date ON jackpot_draws(end_date);
CREATE INDEX IF NOT EXISTS idx_jackpot_draws_winner_user_id ON jackpot_draws(winner_user_id);
CREATE INDEX IF NOT EXISTS idx_jackpot_draws_draw_date ON jackpot_draws(draw_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_jackpot_draws_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_jackpot_draws_updated_at
    BEFORE UPDATE ON jackpot_draws
    FOR EACH ROW
    EXECUTE FUNCTION update_jackpot_draws_updated_at();

-- Enable Row Level Security
ALTER TABLE jackpot_draws ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active jackpot draws" ON jackpot_draws
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view completed jackpot draws" ON jackpot_draws
    FOR SELECT USING (is_active = false);

CREATE POLICY "Admins can manage all jackpot draws" ON jackpot_draws
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Add comments for documentation
COMMENT ON TABLE jackpot_draws IS 'Manages monthly jackpot draw events';
COMMENT ON COLUMN jackpot_draws.draw_id IS 'Unique identifier for each draw';
COMMENT ON COLUMN jackpot_draws.draw_name IS 'Human-readable name for the draw (e.g., "October 2025 Jackpot")';
COMMENT ON COLUMN jackpot_draws.prize_amount IS 'Prize amount in USD';
COMMENT ON COLUMN jackpot_draws.start_date IS 'When entries start being accepted';
COMMENT ON COLUMN jackpot_draws.end_date IS 'When entries stop being accepted';
COMMENT ON COLUMN jackpot_draws.winner_user_id IS 'Winner of the draw (null until drawn)';
COMMENT ON COLUMN jackpot_draws.is_active IS 'Whether the draw is currently active';
COMMENT ON COLUMN jackpot_draws.draw_date IS 'When the draw was conducted (null until drawn)';
