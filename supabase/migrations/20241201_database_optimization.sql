-- Database optimization and performance improvements
-- This migration adds missing indexes and optimizes queries

-- Add missing indexes for jackpot_entries table
CREATE INDEX IF NOT EXISTS idx_jackpot_entries_user_id_created_at ON jackpot_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jackpot_entries_source_reason_created_at ON jackpot_entries(source_reason, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jackpot_entries_competition_id_created_at ON jackpot_entries(competition_id, created_at DESC);

-- Add missing indexes for jackpot_draws table
CREATE INDEX IF NOT EXISTS idx_jackpot_draws_start_date_end_date ON jackpot_draws(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_jackpot_draws_is_active_end_date ON jackpot_draws(is_active, end_date) WHERE is_active = true;

-- Add missing indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type_created_at ON notifications(type, created_at DESC);

-- Add missing indexes for submissions table
CREATE INDEX IF NOT EXISTS idx_submissions_user_id_created_at ON submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_contest_id_created_at ON submissions(contest_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status_created_at ON submissions(status, created_at DESC);

-- Add missing indexes for votes table
CREATE INDEX IF NOT EXISTS idx_votes_voter_id_created_at ON votes(voter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_submission_id_category ON votes(submission_id, category);

-- Add missing indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_current_jackpot_entries ON profiles(current_jackpot_entries DESC);

-- Add missing indexes for contests table
CREATE INDEX IF NOT EXISTS idx_contests_start_date_end_date ON contests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_contests_is_active_end_date ON contests(is_active, end_date) WHERE is_active = true;

-- Optimize the jackpot winner selection function
-- Add a more efficient version that uses a single query
CREATE OR REPLACE FUNCTION select_jackpot_winner_optimized(draw_id_param UUID)
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

    -- Get the draw record with row-level locking
    SELECT * INTO draw_record
    FROM jackpot_draws
    WHERE draw_id = draw_id_param
    AND is_active = true
    FOR UPDATE;

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

    -- Get total entries and select winner in a single optimized query
    WITH entry_totals AS (
        SELECT 
            user_id,
            SUM(entry_count) as total_user_entries
        FROM jackpot_entries
        WHERE created_at >= draw_record.start_date
        AND created_at <= draw_record.end_date
        GROUP BY user_id
    ),
    cumulative_entries AS (
        SELECT 
            user_id,
            total_user_entries,
            SUM(total_user_entries) OVER (ORDER BY user_id) as cumulative_sum
        FROM entry_totals
    ),
    total_count AS (
        SELECT SUM(total_user_entries) as total FROM entry_totals
    ),
    winner_selection AS (
        SELECT 
            ce.user_id,
            ce.total_user_entries
        FROM cumulative_entries ce
        CROSS JOIN total_count tc
        WHERE ce.cumulative_sum >= FLOOR(RANDOM() * tc.total) + 1
        ORDER BY ce.cumulative_sum
        LIMIT 1
    )
    SELECT 
        ws.user_id,
        ws.total_user_entries,
        tc.total
    INTO winner_user_id, total_entries, total_entries
    FROM winner_selection ws
    CROSS JOIN total_count tc;

    -- Check if we found a winner
    IF winner_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'No entries found for this draw'
        );
    END IF;

    -- Get winner details
    SELECT username, display_name, email
    INTO winner_username, winner_display_name, winner_email
    FROM profiles
    WHERE id = winner_user_id;

    -- Update the draw record atomically
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

    -- Log the draw for audit purposes
    INSERT INTO audit_logs (
        action,
        table_name,
        record_id,
        user_id,
        details
    ) VALUES (
        'jackpot_winner_selected',
        'jackpot_draws',
        draw_id_param,
        auth.uid(),
        json_build_object(
            'winner_user_id', winner_user_id,
            'winner_username', winner_username,
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
        -- Log the error
        INSERT INTO audit_logs (
            action,
            table_name,
            record_id,
            user_id,
            details
        ) VALUES (
            'jackpot_winner_selection_error',
            'jackpot_draws',
            draw_id_param,
            auth.uid(),
            json_build_object(
                'error', SQLERRM,
                'sqlstate', SQLSTATE
            )
        );
        
        RETURN json_build_object(
            'success', false,
            'error', 'An error occurred: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit_logs table for comprehensive logging
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Add comments
COMMENT ON TABLE audit_logs IS 'Comprehensive audit log for all critical system actions';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed (jackpot_winner_selected, user_created, etc.)';
COMMENT ON COLUMN audit_logs.details IS 'Additional details about the action in JSON format';
