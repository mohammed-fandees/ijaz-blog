-- حل بسيط لمشكلة تاريخ التحديث
-- نضيف عمود جديد يتتبع تاريخ آخر تحديث للمحتوى فقط

-- 1. إضافة عمود content_updated_at لتتبع تاريخ تحديث المحتوى فقط
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. نقل البيانات الحالية من updated_at إلى content_updated_at لجميع المقالات الموجودة
UPDATE posts SET content_updated_at = updated_at;

-- 3. إنشاء دالة تحديث العمود الجديد
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- تحديث تاريخ المحتوى فقط إذا تغير محتوى المقال وليس الإحصائيات
    IF (
        NEW.title IS DISTINCT FROM OLD.title OR
        NEW.content IS DISTINCT FROM OLD.content OR
        NEW.excerpt IS DISTINCT FROM OLD.excerpt OR
        NEW.slug IS DISTINCT FROM OLD.slug OR
        NEW.featured_image IS DISTINCT FROM OLD.featured_image OR
        NEW.status IS DISTINCT FROM OLD.status OR
        NEW.category_id IS DISTINCT FROM OLD.category_id OR
        NEW.reading_time IS DISTINCT FROM OLD.reading_time
    ) THEN
        NEW.content_updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. إنشاء ترايجر لتحديث العمود الجديد
CREATE TRIGGER update_posts_content_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_content_updated_at();

-- 5. تحديث التطبيق لعرض content_updated_at بدلاً من updated_at عند عرض تاريخ آخر تحديث
-- سيتم تحديث PostComponent.tsx أو أي مكون آخر يعرض تاريخ التحديث 