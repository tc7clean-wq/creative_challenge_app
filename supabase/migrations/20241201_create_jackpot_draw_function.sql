-- Create function to select jackpot winner
CREATE OR REPLACE FUNCTION select_jackpot_winner(draw_id_param UUID)
RETURNS JSON AS $$
DECLARE
    draw_record RECORD;
    total_entries INTEGER;
    winner_user_id UUID;
    winner_username TEXT;
    winner_display_name TEXT;
    winner_email TEXT;
    result JSON;
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    ) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Admin access required'
        );
    END IF;

    -- Get the draw record
    SELECT * INTO draw_record
    FROM jackpot_draws
    WHERE draw_id = draw_id_param
    AND is_active = true;

    -- Check if draw exists and is active
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Draw not found or not active'
        );
    END IF;

    -- Check if draw has already ended
    IF draw_record.end_date > NOW() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Draw has not ended yet'
        );
    END IF;

    -- Get total entries for this draw period
    SELECT COALESCE(SUM(entry_count), 0) INTO total_entries
    FROM jackpot_entries
    WHERE created_at >= draw_record.start_date
    AND created_at <= draw_record.end_date;

    -- Check if there are any entries
    IF total_entries = 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', 'No entries found for this draw'
        );
    END IF;

    -- Select winner using weighted random selection
    WITH weighted_entries AS (
        SELECT 
            user_id,
            SUM(entry_count) as total_user_entries,
            SUM(SUM(entry_count)) OVER (ORDER BY user_id) as cumulative_entries
        FROM jackpot_entries
        WHERE created_at >= draw_record.start_date
        AND created_at <= draw_record.end_date
        GROUP BY user_id
    ),
    random_selection AS (
        SELECT 
            user_id,
            total_user_entries
        FROM weighted_entries
        WHERE cumulative_entries >= FLOOR(RANDOM() * total_entries) + 1
        ORDER BY cumulative_entries
        LIMIT 1
    )
    SELECT user_id INTO winner_user_id
    FROM random_selection;

    -- Get winner details
    SELECT username, display_name, email
    INTO winner_username, winner_display_name, winner_email
    FROM profiles
    WHERE id = winner_user_id;

    -- Update the draw record
    UPDATE jackpot_draws
    SET 
        winner_user_id = winner_user_id,
        is_active = false,
        draw_date = NOW(),
        updated_at = NOW()
    WHERE draw_id = draw_id_param;

    -- Create notification for the winner
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        data
    ) VALUES (
        winner_user_id,
        '🎰 Congratulations! You Won the Jackpot!',
        'Congratulations! You have won the ' || draw_record.draw_name || ' with a prize of $' || draw_record.prize_amount || '!',
        'jackpot_win',
        json_build_object(
            'draw_id', draw_id_param,
            'draw_name', draw_record.draw_name,
            'prize_amount', draw_record.prize_amount,
            'total_entries', total_entries
        )
    );

    -- Return success result
    result := json_build_object(
        'success', true,
        'winner', json_build_object(
            'user_id', winner_user_id,
            'username', winner_username,
            'display_name', winner_display_name,
            'email', winner_email
        ),
        'draw', json_build_object(
            'draw_id', draw_id_param,
            'draw_name', draw_record.draw_name,
            'prize_amount', draw_record.prize_amount,
            'total_entries', total_entries
        ),
        'draw_date', NOW()
    );

    RETURN result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'An error occurred: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Add comments
COMMENT ON FUNCTION select_jackpot_winner IS 'Selects a random winner for a jackpot draw based on weighted entries';
COMMENT ON TABLE notifications IS 'Stores system notifications for users';
COMMENT ON COLUMN notifications.type IS 'Type of notification (jackpot_win, competition_result, etc.)';
COMMENT ON COLUMN notifications.data IS 'Additional data related to the notification';
