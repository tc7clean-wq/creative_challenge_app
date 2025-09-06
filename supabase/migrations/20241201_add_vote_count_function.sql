-- Create function to increment vote count on submissions
CREATE OR REPLACE FUNCTION increment_vote_count(submission_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE submissions 
    SET vote_count = COALESCE(vote_count, 0) + 1,
        updated_at = NOW()
    WHERE id = submission_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement vote count on submissions
CREATE OR REPLACE FUNCTION decrement_vote_count(submission_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE submissions 
    SET vote_count = GREATEST(COALESCE(vote_count, 0) - 1, 0),
        updated_at = NOW()
    WHERE id = submission_id;
END;
$$ LANGUAGE plpgsql;

-- Add vote_count column to submissions table if it doesn't exist
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS vote_count INTEGER DEFAULT 0;

-- Create index for vote_count
CREATE INDEX IF NOT EXISTS idx_submissions_vote_count ON submissions(vote_count);

-- Add comment
COMMENT ON COLUMN submissions.vote_count IS 'Number of votes received for this submission';
