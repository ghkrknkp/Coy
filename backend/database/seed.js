import { v4 as uuidv4 } from 'uuid';
import { run, queryOne, exec } from './db.js';
import initializeDatabase from './initDb.js';
import { mockProfiles, demoReciprocalLikes } from '../data/mockProfiles.js';

export const DEMO_USER_ID = 'demo-user-1';

export function seedDatabase(forceReset = false) {
  initializeDatabase();

  if (forceReset) {
    console.log('Force reset requested. Clearing profiles, swipes, and matches for fresh demo state...');
    exec(`
      DELETE FROM profiles;
      DELETE FROM swipes;
      DELETE FROM matches;
    `);
  }

  // Insert mock profiles
  let insertedCount = 0;
  for (const profile of mockProfiles) {
    const existing = queryOne('SELECT id FROM profiles WHERE id = ?', [profile.id]);
    if (!existing) {
      run(
        `INSERT INTO profiles (id, name, age, bio, location, image_url, interests)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.id,
          profile.name,
          profile.age,
          profile.bio,
          profile.location,
          profile.image_url,
          JSON.stringify(profile.interests)
        ]
      );
      insertedCount++;
    }
  }

  // Seed reciprocal likes (profiles that have already liked demo-user-1)
  let seededLikesCount = 0;
  for (const otherUserId of demoReciprocalLikes) {
    const existingSwipe = queryOne(
      'SELECT id FROM swipes WHERE swiper_id = ? AND swiped_user_id = ?',
      [otherUserId, DEMO_USER_ID]
    );

    if (!existingSwipe) {
      run(
        `INSERT INTO swipes (id, swiper_id, swiped_user_id, action)
         VALUES (?, ?, ?, 'LIKE')`,
        [uuidv4(), otherUserId, DEMO_USER_ID]
      );
      seededLikesCount++;
    }
  }

  console.log(`Database seeded: ${insertedCount} profiles inserted (${mockProfiles.length} total), ${seededLikesCount} reciprocal demo likes initialized.`);
}

// Allow direct CLI execution: node database/seed.js [--reset]
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const isReset = process.argv.includes('--reset');
  seedDatabase(isReset);
  process.exit(0);
}

export default seedDatabase;
