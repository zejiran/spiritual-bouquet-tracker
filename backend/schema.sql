DROP TABLE IF EXISTS offerings;
CREATE TABLE offerings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  userName TEXT NOT NULL,
  comment TEXT,
  imageUrl TEXT,
  timestamp TEXT NOT NULL
);
