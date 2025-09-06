-- Add current_jackpot_entries column to profiles table
-- Note: We're updating the profiles table since that's where user data is stored
-- and it's linked to auth.users via the id column

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_jackpot_entries INTEGER DEFAULT 0 NOT NULL;

-- Add constraint to ensure non-negative values
ALTER TABLE profiles 
ADD CONSTRAINT check_current_jackpot_entries_non_negative 
CHECK (current_jackpot_entries >= 0);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_current_jackpot_entries ON profiles(current_jackpot_entries);

-- Add comment for documentation
COMMENT ON COLUMN profiles.current_jackpot_entries IS 'Cached count of user''s current jackpot entries for fast lookups';

-- Create function to update user's jackpot entry count
CREATE OR REPLACE FUNCTION update_user_jackpot_entries()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the user's current jackpot entry count
    UPDATE profiles 
    SET current_jackpot_entries = (
        SELECT COALESCE(SUM(entry_count), 0)
        FROM jackpot_entries 
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    )
    WHERE id = COALESCE(NEW.user_id, OLD.user_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update entry count when entries are added/removed
CREATE TRIGGER trigger_update_user_jackpot_entries
    AFTER INSERT OR UPDATE OR DELETE ON jackpot_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_user_jackpot_entries();

-- Create function to get user's total jackpot entries
CREATE OR REPLACE FUNCTION get_user_jackpot_entries(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(entry_count), 0)
        FROM jackpot_entries 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to add jackpot entries for a user
CREATE OR REPLACE FUNCTION add_jackpot_entries(
    user_uuid UUID,
    source_reason_param VARCHAR(50),
    entry_count_param INTEGER DEFAULT 1,
    competition_uuid UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_entry_id UUID;
BEGIN
    -- Insert the new entry
    INSERT INTO jackpot_entries (user_id, competition_id, source_reason, entry_count)
    VALUES (user_uuid, competition_uuid, source_reason_param, entry_count_param)
    RETURNING entry_id INTO new_entry_id;
    
    -- The trigger will automatically update the user's current_jackpot_entries count
    
    RETURN new_entry_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get current active jackpot draw
CREATE OR REPLACE FUNCTION get_active_jackpot_draw()
RETURNS TABLE (
    draw_id UUID,
    draw_name VARCHAR(100),
    prize_amount DECIMAL(10,2),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jd.draw_id,
        jd.draw_name,
        jd.prize_amount,
        jd.start_date,
        jd.end_date,
        EXTRACT(DAYS FROM (jd.end_date - NOW()))::INTEGER as days_remaining
    FROM jackpot_draws jd
    WHERE jd.is_active = true
    AND jd.start_date <= NOW()
    AND jd.end_date > NOW()
    ORDER BY jd.end_date ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
