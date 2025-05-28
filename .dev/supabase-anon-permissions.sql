-- Permissions for anonymous users to allow post views/likes
-- Run these in SQL Editor in Supabase dashboard
-- ENABLE RLS ON POSTS TABLE
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY FOR PUBLIC READ ACCESS
CREATE POLICY "Public posts are viewable by everyone" ON posts FOR
SELECT
  USING (status = 'published');

-- CREATE POLICY FOR ANONYMOUS UPDATE OF SPECIFIC COLUMNS
CREATE POLICY "Anonymous users can update views and likes counters" ON posts FOR
UPDATE USING (status = 'published')
WITH
  CHECK (
    -- Only allow updates to view_count and likes_count columns
    (
      -- Ensure all other columns remain unchanged
      (OLD.id = posts.id)
      AND (OLD.slug = posts.slug)
      AND (OLD.title = posts.title)
      AND (OLD.content = posts.content)
      AND (OLD.excerpt = posts.excerpt)
      AND (OLD.featured_image = posts.featured_image)
      AND (OLD.status = posts.status)
      AND (OLD.published_at = posts.published_at)
      AND (OLD.updated_at = posts.updated_at)
      AND (OLD.category_id = posts.category_id)
      AND (OLD.reading_time = posts.reading_time)
    )
    AND (
      -- Ensure at least one of these columns is changing
      (
        view_count IS DISTINCT
        FROM
          OLD.view_count
      )
      OR (
        likes_count IS DISTINCT
        FROM
          OLD.likes_count
      )
    )
  );

-- ALTERNATE SIMPLER POLICY (IF THE ABOVE DOESN'T WORK)
-- You can use this simpler policy instead if the complex one fails
/*
CREATE POLICY "Anonymous users can update view count" 
ON posts FOR UPDATE
USING (status = 'published')
WITH CHECK (
(view_count IS NOT NULL OR likes_count IS NOT NULL) AND
(
(view_count IS DISTINCT FROM OLD.view_count AND likes_count IS NOT DISTINCT FROM OLD.likes_count) OR
(likes_count IS DISTINCT FROM OLD.likes_count AND view_count IS NOT DISTINCT FROM OLD.view_count)
)
);
 */