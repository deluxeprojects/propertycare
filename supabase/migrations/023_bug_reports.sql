-- Migration 023: Bug/Feedback Reports
-- Adds bug_reports table for site-wide bug/feedback reporting system

CREATE TABLE IF NOT EXISTS bug_reports (
  id BIGSERIAL PRIMARY KEY,

  -- User-submitted fields
  category TEXT NOT NULL CHECK (category IN ('missing_content', 'wrong_content', 'broken_feature', 'bug', 'ui_ux', 'feature_request', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL CHECK (char_length(title) <= 120),
  description TEXT CHECK (char_length(description) <= 2000),

  -- Screenshot
  screenshot_storage_path TEXT,
  screenshot_url TEXT,
  annotated_screenshot_storage_path TEXT,
  annotated_screenshot_url TEXT,
  attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Metadata
  page_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Submitter
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_name TEXT,
  submitter_email TEXT,

  -- Admin workflow
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'accepted', 'in_progress', 'resolved', 'wont_fix', 'duplicate', 'closed')),
  assignee TEXT,
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_bug_reports_status ON bug_reports(status);
CREATE INDEX idx_bug_reports_category ON bug_reports(category);
CREATE INDEX idx_bug_reports_priority ON bug_reports(priority);
CREATE INDEX idx_bug_reports_assignee ON bug_reports(assignee);
CREATE INDEX idx_bug_reports_created_at ON bug_reports(created_at DESC);
CREATE INDEX idx_bug_reports_submitted_by ON bug_reports(submitted_by);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_bug_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bug_reports_updated_at
  BEFORE UPDATE ON bug_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_bug_reports_updated_at();
