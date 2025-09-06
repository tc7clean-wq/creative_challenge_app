-- Create JackpotEntries table
CREATE TABLE IF NOT EXISTS jackpot_entries (
    entry_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES contests(id) ON DELETE SET NULL,
    source_reason VARCHAR(50) NOT NULL CHECK (source_reason IN (
        'FIRST_PLACE_WIN',
        'SECOND_PLACE_WIN', 
        'THIRD_PLACE_WIN',
        'BASE_SUBMISSION',
        'COMMUNITY_VOTE',
        'SOCIAL_SHARE',
        'DAILY_LOGIN',
        'REFERRAL',
        'MANUAL_ENTRY'
    )),
    entry_count INTEGER NOT NULL DEFAULT 1 CHECK (entry_count > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jackpot_entries_user_id ON jackpot_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_jackpot_entries_competition_id ON jackpot_entries(competition_id);
CREATE INDEX IF NOT EXISTS idx_jackpot_entries_created_at ON jackpot_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_jackpot_entries_source_reason ON jackpot_entries(source_reason);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_jackpot_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_jackpot_entries_updated_at
    BEFORE UPDATE ON jackpot_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_jackpot_entries_updated_at();

-- Enable Row Level Security
ALTER TABLE jackpot_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own jackpot entries" ON jackpot_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jackpot entries" ON jackpot_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all jackpot entries" ON jackpot_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert jackpot entries for any user" ON jackpot_entries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Add comments for documentation
COMMENT ON TABLE jackpot_entries IS 'Tracks individual jackpot entries earned by users';
COMMENT ON COLUMN jackpot_entries.entry_id IS 'Unique identifier for each entry';
COMMENT ON COLUMN jackpot_entries.user_id IS 'User who earned the entry';
COMMENT ON COLUMN jackpot_entries.competition_id IS 'Competition that generated the entry (if applicable)';
COMMENT ON COLUMN jackpot_entries.source_reason IS 'Reason why the entry was earned';
COMMENT ON COLUMN jackpot_entries.entry_count IS 'Number of entries earned (usually 1, but can be more for special events)';
COMMENT ON COLUMN jackpot_entries.created_at IS 'When the entry was earned';
