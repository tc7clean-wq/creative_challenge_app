-- Advanced Database Optimization
-- This migration adds performance indexes, materialized views, and optimizations

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  properties JSONB,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_properties ON analytics_events USING GIN(properties);

-- Create performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_load_time INTEGER,
  first_contentful_paint INTEGER,
  largest_contentful_paint INTEGER,
  first_input_delay INTEGER,
  cumulative_layout_shift DECIMAL,
  time_to_interactive INTEGER,
  total_blocking_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_url ON performance_metrics(page_url);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);

-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source TEXT NOT NULL,
  details JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for security events
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_source ON security_events(source);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

-- Create AI generation requests table
CREATE TABLE IF NOT EXISTS ai_generation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  model TEXT NOT NULL,
  style TEXT,
  aspect_ratio TEXT,
  quality TEXT,
  seed INTEGER,
  steps INTEGER,
  cfg_scale DECIMAL,
  image_url TEXT,
  cost DECIMAL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for AI generation requests
CREATE INDEX IF NOT EXISTS idx_ai_generation_user_id ON ai_generation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_model ON ai_generation_requests(model);
CREATE INDEX IF NOT EXISTS idx_ai_generation_status ON ai_generation_requests(status);
CREATE INDEX IF NOT EXISTS idx_ai_generation_created_at ON ai_generation_requests(created_at);

-- Create AI analysis results table
CREATE TABLE IF NOT EXISTS ai_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  tags TEXT[],
  style TEXT,
  mood TEXT,
  colors TEXT[],
  composition TEXT,
  technical_quality INTEGER,
  artistic_score INTEGER,
  nsfw BOOLEAN DEFAULT FALSE,
  violence BOOLEAN DEFAULT FALSE,
  hate BOOLEAN DEFAULT FALSE,
  confidence DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for AI analysis results
CREATE INDEX IF NOT EXISTS idx_ai_analysis_image_url ON ai_analysis_results(image_url);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_tags ON ai_analysis_results USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_style ON ai_analysis_results(style);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_nsfw ON ai_analysis_results(nsfw);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_created_at ON ai_analysis_results(created_at);

-- Create materialized view for user statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS user_statistics AS
SELECT 
  u.id,
  u.email,
  u.created_at,
  COUNT(DISTINCT s.id) as submission_count,
  COUNT(DISTINCT v.id) as vote_count,
  COUNT(DISTINCT c.id) as contest_count,
  COALESCE(SUM(v.vote_count), 0) as total_votes_received,
  COALESCE(AVG(pm.page_load_time), 0) as avg_page_load_time,
  COALESCE(MAX(ae.timestamp), u.created_at) as last_activity
FROM auth.users u
LEFT JOIN submissions s ON u.id = s.user_id
LEFT JOIN votes v ON u.id = v.user_id
LEFT JOIN contests c ON u.id = c.created_by
LEFT JOIN performance_metrics pm ON u.id = pm.user_id
LEFT JOIN analytics_events ae ON u.id = ae.user_id
GROUP BY u.id, u.email, u.created_at;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_statistics_id ON user_statistics(id);

-- Create materialized view for contest statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS contest_statistics AS
SELECT 
  c.id,
  c.title,
  c.description,
  c.created_at,
  c.end_date,
  COUNT(DISTINCT s.id) as submission_count,
  COUNT(DISTINCT v.id) as vote_count,
  COALESCE(AVG(s.vote_count), 0) as avg_votes_per_submission,
  COALESCE(MAX(s.vote_count), 0) as max_votes_per_submission,
  CASE 
    WHEN c.end_date < NOW() THEN 'ended'
    WHEN c.start_date > NOW() THEN 'upcoming'
    ELSE 'active'
  END as status
FROM contests c
LEFT JOIN submissions s ON c.id = s.contest_id
LEFT JOIN votes v ON s.id = v.submission_id
GROUP BY c.id, c.title, c.description, c.created_at, c.end_date, c.start_date;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_contest_statistics_id ON contest_statistics(id);

-- Create materialized view for daily analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_analytics AS
SELECT 
  DATE(ae.timestamp) as date,
  COUNT(*) as total_events,
  COUNT(DISTINCT ae.user_id) as unique_users,
  COUNT(DISTINCT ae.session_id) as unique_sessions,
  COUNT(CASE WHEN ae.type = 'page_view' THEN 1 END) as page_views,
  COUNT(CASE WHEN ae.type = 'conversion' THEN 1 END) as conversions,
  COUNT(CASE WHEN ae.type = 'error' THEN 1 END) as errors,
  COALESCE(AVG(pm.page_load_time), 0) as avg_page_load_time
FROM analytics_events ae
LEFT JOIN performance_metrics pm ON ae.user_id = pm.user_id AND DATE(ae.timestamp) = DATE(pm.created_at)
GROUP BY DATE(ae.timestamp)
ORDER BY date DESC;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_statistics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY contest_statistics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old analytics data
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  -- Delete analytics events older than 90 days
  DELETE FROM analytics_events 
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  -- Delete performance metrics older than 30 days
  DELETE FROM performance_metrics 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Delete resolved security events older than 7 days
  DELETE FROM security_events 
  WHERE resolved = TRUE AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to get user engagement score
CREATE OR REPLACE FUNCTION get_user_engagement_score(user_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  score DECIMAL := 0;
  submission_count INTEGER;
  vote_count INTEGER;
  contest_count INTEGER;
  days_since_joined INTEGER;
BEGIN
  -- Get user statistics
  SELECT 
    COUNT(DISTINCT s.id),
    COUNT(DISTINCT v.id),
    COUNT(DISTINCT c.id),
    EXTRACT(DAYS FROM NOW() - u.created_at)
  INTO submission_count, vote_count, contest_count, days_since_joined
  FROM auth.users u
  LEFT JOIN submissions s ON u.id = s.user_id
  LEFT JOIN votes v ON u.id = v.user_id
  LEFT JOIN contests c ON u.id = c.created_by
  WHERE u.id = user_id_param
  GROUP BY u.id, u.created_at;
  
  -- Calculate engagement score
  score := (submission_count * 10) + (vote_count * 5) + (contest_count * 20);
  
  -- Normalize by days since joined
  IF days_since_joined > 0 THEN
    score := score / days_since_joined;
  END IF;
  
  RETURN COALESCE(score, 0);
END;
$$ LANGUAGE plpgsql;

-- Create function to get trending content
CREATE OR REPLACE FUNCTION get_trending_content(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  type TEXT,
  score DECIMAL,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  WITH content_scores AS (
    SELECT 
      s.id,
      s.title,
      'submission' as type,
      (s.vote_count * 1.0 + EXTRACT(EPOCH FROM (NOW() - s.created_at)) / 3600 * 0.1) as score,
      s.created_at
    FROM submissions s
    WHERE s.created_at > NOW() - INTERVAL '7 days'
    
    UNION ALL
    
    SELECT 
      c.id,
      c.title,
      'contest' as type,
      (COUNT(DISTINCT s.id) * 2.0 + COUNT(DISTINCT v.id) * 1.0) as score,
      c.created_at
    FROM contests c
    LEFT JOIN submissions s ON c.id = s.contest_id
    LEFT JOIN votes v ON s.id = v.submission_id
    WHERE c.created_at > NOW() - INTERVAL '7 days'
    GROUP BY c.id, c.title, c.created_at
  )
  SELECT 
    cs.id,
    cs.title,
    cs.type,
    cs.score,
    cs.created_at
  FROM content_scores cs
  ORDER BY cs.score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to detect suspicious activity
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TABLE (
  user_id UUID,
  activity_type TEXT,
  severity TEXT,
  details JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH suspicious_users AS (
    -- Users with too many failed login attempts
    SELECT 
      ae.user_id,
      'excessive_failed_logins' as activity_type,
      'high' as severity,
      jsonb_build_object(
        'failed_attempts', COUNT(*),
        'timeframe', '1 hour'
      ) as details
    FROM analytics_events ae
    WHERE ae.type = 'login_failed'
      AND ae.timestamp > NOW() - INTERVAL '1 hour'
    GROUP BY ae.user_id
    HAVING COUNT(*) > 10
    
    UNION ALL
    
    -- Users with unusual voting patterns
    SELECT 
      v.user_id,
      'unusual_voting_pattern' as activity_type,
      'medium' as severity,
      jsonb_build_object(
        'votes_per_minute', COUNT(*) / 60.0,
        'timeframe', '1 hour'
      ) as details
    FROM votes v
    WHERE v.created_at > NOW() - INTERVAL '1 hour'
    GROUP BY v.user_id
    HAVING COUNT(*) > 100
    
    UNION ALL
    
    -- Users with rapid submissions
    SELECT 
      s.user_id,
      'rapid_submissions' as activity_type,
      'medium' as severity,
      jsonb_build_object(
        'submissions_per_minute', COUNT(*) / 60.0,
        'timeframe', '1 hour'
      ) as details
    FROM submissions s
    WHERE s.created_at > NOW() - INTERVAL '1 hour'
    GROUP BY s.user_id
    HAVING COUNT(*) > 20
  )
  SELECT * FROM suspicious_users;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_vote_count ON submissions(vote_count);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);
CREATE INDEX IF NOT EXISTS idx_contests_end_date ON contests(end_date);
CREATE INDEX IF NOT EXISTS idx_contests_start_date ON contests(start_date);

-- Create partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_active ON submissions(contest_id) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_votes_recent ON votes(created_at) WHERE created_at > NOW() - INTERVAL '7 days';
CREATE INDEX IF NOT EXISTS idx_contests_active ON contests(id) WHERE end_date > NOW() AND start_date <= NOW();

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_submissions_metadata ON submissions USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_contests_settings ON contests USING GIN(settings);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_contest_status ON submissions(contest_id, status);
CREATE INDEX IF NOT EXISTS idx_votes_user_submission ON votes(user_id, submission_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_type ON analytics_events(user_id, type);

-- Set up automatic refresh of materialized views
-- This would typically be done with a cron job or scheduled function
-- For now, we'll create a trigger to refresh on data changes

-- Create trigger function to refresh views on data changes
CREATE OR REPLACE FUNCTION trigger_refresh_analytics_views()
RETURNS TRIGGER AS $$
BEGIN
  -- Refresh views asynchronously
  PERFORM pg_notify('refresh_analytics_views', '');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic refresh
CREATE TRIGGER refresh_views_on_submission_change
  AFTER INSERT OR UPDATE OR DELETE ON submissions
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_analytics_views();

CREATE TRIGGER refresh_views_on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_analytics_views();

CREATE TRIGGER refresh_views_on_contest_change
  AFTER INSERT OR UPDATE OR DELETE ON contests
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_analytics_views();

-- Grant necessary permissions
GRANT SELECT ON user_statistics TO authenticated;
GRANT SELECT ON contest_statistics TO authenticated;
GRANT SELECT ON daily_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_engagement_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trending_content(INTEGER) TO authenticated;

-- Create RLS policies for new tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_results ENABLE ROW LEVEL SECURITY;

-- Analytics events policies
CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Performance metrics policies
CREATE POLICY "Users can view their own performance metrics" ON performance_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert performance metrics" ON performance_metrics
  FOR INSERT WITH CHECK (true);

-- Security events policies (admin only)
CREATE POLICY "Admins can view security events" ON security_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Service role can insert security events" ON security_events
  FOR INSERT WITH CHECK (true);

-- AI generation requests policies
CREATE POLICY "Users can view their own AI generation requests" ON ai_generation_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI generation requests" ON ai_generation_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI analysis results policies (public read, service insert)
CREATE POLICY "Anyone can view AI analysis results" ON ai_analysis_results
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert AI analysis results" ON ai_analysis_results
  FOR INSERT WITH CHECK (true);
