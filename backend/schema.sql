-- CREATE TABLE offerings (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   recipient_id TEXT NOT NULL,
--   type TEXT NOT NULL,
--   userName TEXT NOT NULL,
--   comment TEXT,
--   imageUrl TEXT,
--   timestamp TEXT NOT NULL
-- );

-- Create a new recipients table
CREATE TABLE recipients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Alter the offerings table to include a recipient_id
ALTER TABLE offerings ADD COLUMN recipient_id TEXT NOT NULL DEFAULT 'jorge';

-- Insert Jorge as the first recipient
INSERT INTO recipients (id, name, created_at)
VALUES ('jorge', 'Jorge', datetime('now'));

-- Create an index for faster queries
CREATE INDEX idx_offerings_recipient_id ON offerings (recipient_id);
