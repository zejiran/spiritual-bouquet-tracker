CREATE TABLE offerings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id TEXT NOT NULL,
    type TEXT NOT NULL,
    userName TEXT NOT NULL,
    comment TEXT,
    imageUrl TEXT,
    timestamp TEXT NOT NULL
);

CREATE TABLE recipients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- Create an index for faster queries
CREATE INDEX idx_offerings_recipient_id ON offerings (recipient_id);
