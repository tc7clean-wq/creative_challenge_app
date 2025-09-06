-- Create function to add jackpot entries atomically
CREATE OR REPLACE FUNCTION add_jackpot_entries(
    user_uuid UUID,
    source_reason_param TEXT,
    entry_count_param INTEGER,
    competition_uuid UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_entry_id UUID;
    user_exists BOOLEAN;
    competition_exists BOOLEAN;
BEGIN
    -- Validate user exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = user_uuid) INTO user_exists;
    IF NOT user_exists THEN
        RAISE EXCEPTION 'User not found: %', user_uuid;
    END IF;

    -- Validate competition exists if provided
    IF competition_uuid IS NOT NULL THEN
        SELECT EXISTS(SELECT 1 FROM contests WHERE id = competition_uuid) INTO competition_exists;
        IF NOT competition_exists THEN
            RAISE EXCEPTION 'Competition not found: %', competition_uuid;
        END IF;
    END IF;

    -- Validate source reason
    IF source_reason_param NOT IN (
        'FIRST_PLACE_WIN', 'SECOND_PLACE_WIN', 'THIRD_PLACE_WIN',
        'BASE_SUBMISSION', 'COMMUNITY_VOTE', 'PEOPLES_CHOICE',
        'SOCIAL_SHARE', 'DAILY_LOGIN', 'REFERRAL', 'MANUAL_ENTRY'
    ) THEN
        RAISE EXCEPTION 'Invalid source reason: %', source_reason_param;
    END IF;

    -- Validate entry count
    IF entry_count_param <= 0 OR entry_count_param > 1000 THEN
        RAISE EXCEPTION 'Invalid entry count: %. Must be between 1 and 1000', entry_count_param;
    END IF;

    -- Insert jackpot entry
    INSERT INTO jackpot_entries (
        user_id,
        competition_id,
        source_reason,
        entry_count
    ) VALUES (
        user_uuid,
        competition_uuid,
        source_reason_param,
        entry_count_param
    ) RETURNING entry_id INTO new_entry_id;

    -- Update user's total entry count atomically
    UPDATE profiles
    SET current_jackpot_entries = current_jackpot_entries + entry_count_param
    WHERE id = user_uuid;

    -- Log the entry for audit purposes
    INSERT INTO audit_logs (
        action,
        table_name,
        record_id,
        user_id,
        details
    ) VALUES (
        'jackpot_entry_added',
        'jackpot_entries',
        new_entry_id,
        user_uuid,
        json_build_object(
            'source_reason', source_reason_param,
            'entry_count', entry_count_param,
            'competition_id', competition_uuid
        )
    );

    RETURN new_entry_id;

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
            'jackpot_entry_error',
            'jackpot_entries',
            NULL,
            user_uuid,
            json_build_object(
                'error', SQLERRM,
                'sqlstate', SQLSTATE,
                'source_reason', source_reason_param,
                'entry_count', entry_count_param
            )
        );
        
        RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_jackpot_entries(UUID, TEXT, INTEGER, UUID) TO authenticated;

-- Add comments
COMMENT ON FUNCTION add_jackpot_entries IS 'Atomically adds jackpot entries for a user and updates their total count';
