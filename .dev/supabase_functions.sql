-- وظيفة لتحديث عدد الإعجابات (زيادة أو نقصان)
CREATE OR REPLACE FUNCTION increment_decrement_likes(post_id UUID, increment INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE posts 
  SET likes_count = GREATEST(0, likes_count + increment)
  WHERE id = post_id
  RETURNING likes_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- وظيفة لزيادة عدد الإعجابات بمقدار 1 (للتوافق مع الكود القديم)
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN increment_decrement_likes(post_id, 1);
END;
$$ LANGUAGE plpgsql;

-- وظيفة لإنقاص عدد الإعجابات بمقدار 1 (للتوافق مع الكود القديم)
CREATE OR REPLACE FUNCTION decrement_likes(post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN increment_decrement_likes(post_id, -1);
END;
$$ LANGUAGE plpgsql;

-- وظيفة لزيادة عدد المشاهدات بمقدار 1
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1
  WHERE id = post_id
  RETURNING view_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;