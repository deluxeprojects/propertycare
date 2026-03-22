CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'General Tips',
  featured_image text,
  author text DEFAULT 'ProKeep Team',
  status text NOT NULL DEFAULT 'published',
  published_at timestamptz DEFAULT now(),
  meta_title text,
  meta_description text,
  read_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- Only create trigger if update_updated_at function exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'blog_posts_updated_at') THEN
      CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
  END IF;
END
$$;

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Public can read published posts') THEN
    CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (status = 'published');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Admins manage posts') THEN
    BEGIN
      CREATE POLICY "Admins manage posts" ON blog_posts FOR ALL USING (is_admin());
    EXCEPTION WHEN undefined_function THEN
      -- is_admin() doesn't exist, skip this policy
      RAISE NOTICE 'is_admin() function not found, skipping admin policy';
    END;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
