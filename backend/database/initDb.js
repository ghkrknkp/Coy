import { exec, queryOne } from './db.js';

export function initializeDatabase() {
  // Create tables if they do not exist
  exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      bio TEXT NOT NULL,
      location TEXT NOT NULL,
      image_url TEXT NOT NULL,
      interests TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id TEXT PRIMARY KEY,
      swiper_id TEXT NOT NULL,
      swiped_user_id TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(swiper_id, swiped_user_id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      user_one_id TEXT NOT NULL,
      user_two_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_one_id, user_two_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      match_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
    CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_user_id);
    CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user_one_id, user_two_id);
    CREATE INDEX IF NOT EXISTS idx_messages_match ON messages(match_id, created_at);
  `);

  console.log('Database tables verified/initialized successfully (including messages).');
}

export default initializeDatabase;
