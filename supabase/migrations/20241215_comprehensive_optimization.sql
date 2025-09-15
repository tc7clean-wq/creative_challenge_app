-- Comprehensive Database Optimization for Creative Challenge App
-- This migration adds all missing indexes, constraints, and performance optimizations

-- ===== PERFORMANCE INDEXES =====

-- Profiles table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_email_hash ON profiles USING hash(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_username_gin ON profiles USING gin(username gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_display_name_gin ON profiles USING gin(display_name gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role_active ON profiles(role, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_created_at_desc ON profiles(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_last_seen ON profiles(last_seen DESC);

-- Contests table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contests_status_dates ON contests(status, start_date, end_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contests_active_end_date ON contests(is_active, end_date DESC) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contests_theme_gin ON contests USING gin(theme gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contests_title_gin ON contests USING gin(title gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contests_creator_created ON contests(created_by, created_at DESC);

-- Submissions table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_contest_status_created ON submissions(contest_id, status, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_user_contest_created ON submissions(user_id, contest_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_status_approved_created ON submissions(status, created_at DESC) WHERE status = 'approved';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_title_gin ON submissions USING gin(title gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_description_gin ON submissions USING gin(description gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_image_url_hash ON submissions USING hash(image_url);

-- Votes table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_votes_submission_category_score ON votes(submission_id, category, score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_votes_voter_created ON votes(voter_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_votes_submission_voter_unique ON votes(submission_id, voter_id, category);

-- Likes table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_likes_submission_created ON likes(submission_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_likes_user_created ON likes(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_likes_submission_user_unique ON likes(submission_id, user_id);

-- Comments table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_submission_created ON comments(submission_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_user_created ON comments(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_parent_created ON comments(parent_id, created_at ASC) WHERE parent_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_content_gin ON comments USING gin(content gin_trgm_ops);

-- Notifications table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread_created ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type_created ON notifications(type, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_type_created ON notifications(user_id, type, created_at DESC);

-- Follows table optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_follower_created ON follows(follower_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_following_created ON follows(following_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_follows_unique ON follows(follower_id, following_id);

-- ===== MATERIALIZED VIEWS FOR PERFORMANCE =====

-- Contest leaderboard materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS contest_leaderboards AS
SELECT
    c.id as contest_id,
    c.title as contest_title,
    s.user_id,
    p.username,
    p.display_name,
    s.id as submission_id,
    s.title as submission_title,
    s.image_url,
    COALESCE(AVG(v.score), 0) as average_score,
    COUNT(v.id) as vote_count,
    COUNT(l.id) as like_count,
    ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY COALESCE(AVG(v.score), 0) DESC, COUNT(l.id) DESC) as rank
FROM contests c
JOIN submissions s ON c.id = s.contest_id AND s.status = 'approved'
JOIN profiles p ON s.user_id = p.id
LEFT JOIN votes v ON s.id = v.submission_id
LEFT JOIN likes l ON s.id = l.submission_id
WHERE c.is_active = true OR c.end_date > NOW() - INTERVAL '30 days'
GROUP BY c.id, c.title, s.user_id, p.username, p.display_name, s.id, s.title, s.image_url;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_contest_leaderboards_unique ON contest_leaderboards(contest_id, submission_id);
CREATE INDEX IF NOT EXISTS idx_contest_leaderboards_rank ON contest_leaderboards(contest_id, rank);

-- User statistics materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS user_statistics AS
SELECT
    p.id as user_id,
    p.username,
    p.display_name,
    COUNT(DISTINCT s.id) as total_submissions,
    COUNT(DISTINCT CASE WHEN s.status = 'approved' THEN s.id END) as approved_submissions,
    COUNT(DISTINCT v.id) as total_votes_given,
    COUNT(DISTINCT l.id) as total_likes_given,
    COUNT(DISTINCT cl.contest_id) as contests_won,
    COALESCE(AVG(vs.score), 0) as average_score_received,
    COUNT(DISTINCT ls.id) as total_likes_received,
    COUNT(DISTINCT cs.id) as total_comments_received,
    COUNT(DISTINCT f1.follower_id) as follower_count,
    COUNT(DISTINCT f2.following_id) as following_count,
    MAX(s.created_at) as last_submission_date,
    MAX(p.last_seen) as last_seen
FROM profiles p
LEFT JOIN submissions s ON p.id = s.user_id
LEFT JOIN votes v ON p.id = v.voter_id
LEFT JOIN likes l ON p.id = l.user_id
LEFT JOIN contest_leaderboards cl ON p.id = cl.user_id AND cl.rank = 1
LEFT JOIN votes vs ON s.id = vs.submission_id
LEFT JOIN likes ls ON s.id = ls.submission_id
LEFT JOIN comments cs ON s.id = cs.submission_id
LEFT JOIN follows f1 ON p.id = f1.following_id
LEFT JOIN follows f2 ON p.id = f2.follower_id
GROUP BY p.id, p.username, p.display_name, p.last_seen;

-- Create index on user statistics
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_statistics_user_id ON user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_statistics_total_submissions ON user_statistics(total_submissions DESC);
CREATE INDEX IF NOT EXISTS idx_user_statistics_average_score ON user_statistics(average_score_received DESC);

-- ===== FUNCTIONS FOR CACHE INVALIDATION =====

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY contest_leaderboards;
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_statistics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate submission scores efficiently
CREATE OR REPLACE FUNCTION calculate_submission_score(submission_id_param UUID)
RETURNS TABLE(
    avg_creativity NUMERIC,
    avg_technical NUMERIC,
    avg_theme_adherence NUMERIC,
    total_votes INTEGER,
    overall_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(AVG(CASE WHEN category = 'creativity' THEN score END), 0) as avg_creativity,
        COALESCE(AVG(CASE WHEN category = 'technical' THEN score END), 0) as avg_technical,
        COALESCE(AVG(CASE WHEN category = 'theme_adherence' THEN score END), 0) as avg_theme_adherence,
        COUNT(*)::INTEGER as total_votes,
        COALESCE(AVG(score), 0) as overall_score
    FROM votes
    WHERE submission_id = submission_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== TRIGGERS FOR REAL-TIME UPDATES =====

-- Function to update submission statistics
CREATE OR REPLACE FUNCTION update_submission_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update like count
    IF TG_TABLE_NAME = 'likes' THEN
        UPDATE submissions
        SET like_count = (
            SELECT COUNT(*) FROM likes WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id)
        )
        WHERE id = COALESCE(NEW.submission_id, OLD.submission_id);
    END IF;

    -- Update comment count
    IF TG_TABLE_NAME = 'comments' THEN
        UPDATE submissions
        SET comment_count = (
            SELECT COUNT(*) FROM comments WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id)
        )
        WHERE id = COALESCE(NEW.submission_id, OLD.submission_id);
    END IF;

    -- Update vote statistics
    IF TG_TABLE_NAME = 'votes' THEN
        UPDATE submissions
        SET
            vote_count = (SELECT COUNT(*) FROM votes WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id)),
            average_score = (SELECT COALESCE(AVG(score), 0) FROM votes WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id))
        WHERE id = COALESCE(NEW.submission_id, OLD.submission_id);
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_like_stats ON likes;
CREATE TRIGGER trigger_update_like_stats
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_stats();

DROP TRIGGER IF EXISTS trigger_update_comment_stats ON comments;
CREATE TRIGGER trigger_update_comment_stats
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_stats();

DROP TRIGGER IF EXISTS trigger_update_vote_stats ON votes;
CREATE TRIGGER trigger_update_vote_stats
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_stats();

-- ===== PERFORMANCE MONITORING =====

-- Enable query performance monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Function to get slow queries
CREATE OR REPLACE FUNCTION get_slow_queries(threshold_ms INTEGER DEFAULT 1000)
RETURNS TABLE(
    query TEXT,
    calls BIGINT,
    total_time DOUBLE PRECISION,
    mean_time DOUBLE PRECISION,
    max_time DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pss.query,
        pss.calls,
        pss.total_exec_time,
        pss.mean_exec_time,
        pss.max_exec_time
    FROM pg_stat_statements pss
    WHERE pss.mean_exec_time > threshold_ms
    ORDER BY pss.mean_exec_time DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== CLEANUP AND ARCHIVAL =====

-- Function to archive old data
CREATE OR REPLACE FUNCTION archive_old_data()
RETURNS void AS $$
BEGIN
    -- Archive notifications older than 6 months
    DELETE FROM notifications
    WHERE created_at < NOW() - INTERVAL '6 months'
    AND is_read = true;

    -- Archive old audit logs (keep 1 year)
    DELETE FROM audit_logs
    WHERE created_at < NOW() - INTERVAL '1 year';

    -- Update last maintenance timestamp
    INSERT INTO system_maintenance (action, completed_at)
    VALUES ('archive_old_data', NOW())
    ON CONFLICT (action) DO UPDATE SET completed_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create system maintenance tracking table
CREATE TABLE IF NOT EXISTS system_maintenance (
    action VARCHAR(50) PRIMARY KEY,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB
);

-- ===== SECURITY ENHANCEMENTS =====

-- Function to validate submission content
CREATE OR REPLACE FUNCTION validate_submission_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate title length
    IF LENGTH(NEW.title) < 3 OR LENGTH(NEW.title) > 200 THEN
        RAISE EXCEPTION 'Submission title must be between 3 and 200 characters';
    END IF;

    -- Validate description length
    IF LENGTH(NEW.description) > 2000 THEN
        RAISE EXCEPTION 'Submission description must be less than 2000 characters';
    END IF;

    -- Validate image URL format
    IF NEW.image_url IS NOT NULL AND NOT (NEW.image_url ~* '^https?://.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$') THEN
        RAISE EXCEPTION 'Invalid image URL format';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger
DROP TRIGGER IF EXISTS trigger_validate_submission ON submissions;
CREATE TRIGGER trigger_validate_submission
    BEFORE INSERT OR UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION validate_submission_content();

-- ===== COMMENTS AND DOCUMENTATION =====

-- Add table comments for documentation
COMMENT ON MATERIALIZED VIEW contest_leaderboards IS 'Real-time contest rankings with user statistics. Refreshed every 5 minutes.';
COMMENT ON MATERIALIZED VIEW user_statistics IS 'Comprehensive user performance metrics. Refreshed hourly.';
COMMENT ON FUNCTION refresh_materialized_views() IS 'Manually refresh all materialized views. Run this after bulk data operations.';
COMMENT ON FUNCTION calculate_submission_score(UUID) IS 'Calculate detailed scoring breakdown for a submission.';
COMMENT ON FUNCTION get_slow_queries(INTEGER) IS 'Identify queries taking longer than threshold (default 1000ms).';
COMMENT ON FUNCTION archive_old_data() IS 'Archive old notifications and logs. Run weekly via cron job.';

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION refresh_materialized_views() TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_submission_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_slow_queries(INTEGER) TO postgres;
GRANT EXECUTE ON FUNCTION archive_old_data() TO postgres;