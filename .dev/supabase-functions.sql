-- Supabase functions for atomic increment operations
-- Run these in SQL Editor in Supabase dashboard

-- Function to increment the view count for a post
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  -- Atomic update of the view count
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id
  RETURNING view_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Function to toggle the like count for a post
CREATE OR REPLACE FUNCTION toggle_like_count(post_id UUID, increment BOOLEAN)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF increment THEN
    -- Increment likes
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = post_id
    RETURNING likes_count INTO new_count;
  ELSE
    -- Decrement likes (with a floor of 0)
    UPDATE posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = post_id
    RETURNING likes_count INTO new_count;
  END IF;
  
  RETURN new_count;
END;
$$; 