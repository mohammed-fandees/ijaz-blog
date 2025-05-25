-- إنشاء enum للحالات
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE analytics_event_type AS ENUM ('page_view', 'article_read', 'article_like', 'search', 'download');

-- جدول الفئات
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL DEFAULT '#1e3a8a',
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المقالات
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[],
    status post_status DEFAULT 'draft',
    meta_title TEXT,
    meta_description TEXT,
    reading_time INTEGER,
    view_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE
);

-- جدول التحليلات
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    event_type analytics_event_type NOT NULL,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    device_info JSONB,
    location_data JSONB,
    reading_progress INTEGER,
    time_spent INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول إعدادات الموقع
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'إعجاز',
    site_description TEXT NOT NULL DEFAULT 'مدونة إسلامية للمقالات والبحوث الشرعية',
    site_logo TEXT,
    primary_color TEXT DEFAULT '#1e3a8a',
    secondary_color TEXT DEFAULT '#dc2626',
    social_links JSONB,
    seo_settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس للبحث السريع
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX posts_status_idx ON posts(status);
CREATE INDEX posts_published_at_idx ON posts(published_at);
CREATE INDEX posts_category_idx ON posts(category_id);
CREATE INDEX analytics_post_idx ON analytics_events(post_id);
CREATE INDEX analytics_event_type_idx ON analytics_events(event_type);
CREATE INDEX analytics_created_at_idx ON analytics_events(created_at);

-- تمكين البحث النصي الكامل
ALTER TABLE posts ADD COLUMN search_vector tsvector;
CREATE INDEX posts_search_idx ON posts USING gin(search_vector);

-- دالة تحديث البحث التلقائي
CREATE OR REPLACE FUNCTION update_posts_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('arabic', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.content, '') || ' ' || 
        COALESCE(NEW.excerpt, '') || ' ' || 
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

-- ربط الدالة بجدول المقالات
CREATE TRIGGER posts_search_vector_update 
    BEFORE INSERT OR UPDATE ON posts 
    FOR EACH ROW EXECUTE FUNCTION update_posts_search_vector();

-- دالة تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at 
    BEFORE UPDATE ON posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إدراج بيانات أولية
INSERT INTO site_settings (site_name, site_description, primary_color, secondary_color) 
VALUES ('إعجاز', 'مدونة إسلامية للمقالات والبحوث الشرعية', '#1e3a8a', '#dc2626');

-- إدراج فئات أولية
INSERT INTO categories (name, slug, description, color, icon) VALUES
('القرآن الكريم', 'quran', 'مقالات متعلقة بالقرآن الكريم وتفسيره', '#10b981', 'BookOpen'),
('الحديث الشريف', 'hadith', 'أحاديث نبوية شريفة وشروحها', '#f59e0b', 'Scroll'),
('الفقه الإسلامي', 'fiqh', 'مسائل فقهية وأحكام شرعية', '#3b82f6', 'Scale'),
('التاريخ الإسلامي', 'history', 'قصص وأحداث من التاريخ الإسلامي', '#8b5cf6', 'Clock'),
('الأخلاق والآداب', 'ethics', 'آداب إسلامية وتزكية النفس', '#ec4899', 'Heart');

-- تمكين Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للقراءة العامة
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- سياسات الأمان للإدارة (مؤقتة - سيتم تحديثها لاحقاً)
CREATE POLICY "Admin can do everything on posts" ON posts FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can do everything on categories" ON categories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can do everything on analytics" ON analytics_events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can do everything on settings" ON site_settings FOR ALL USING (auth.uid() IS NOT NULL);
