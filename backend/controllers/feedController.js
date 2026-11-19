import { queryAll } from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';

/**
 * GET /api/feed
 * Returns up to 10 profiles that the demo user has not yet swiped on (neither LIKE nor PASS).
 * Strictly adheres to Coy's privacy promise: never returns any private info about who liked the user.
 */
export function getFeed(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 20);
    const offset = parseInt(req.query.offset, 10) || 0;

    // Fetch profiles where demo-user-1 has NOT swiped (neither LIKE nor PASS)
    // and exclude demo-user-1's own profile
    const sql = `
      SELECT id, name, age, bio, location, image_url, interests, created_at
      FROM profiles
      WHERE id != ?
        AND id NOT IN (
          SELECT swiped_user_id
          FROM swipes
          WHERE swiper_id = ?
        )
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `;

    const rows = queryAll(sql, [DEMO_USER_ID, DEMO_USER_ID, limit, offset]);

    // Parse interests JSON array safely
    const profiles = rows.map((profile) => {
      let interests = [];
      try {
        interests = JSON.parse(profile.interests);
      } catch (e) {
        interests = typeof profile.interests === 'string' ? profile.interests.split(',') : [];
      }

      return {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        bio: profile.bio,
        location: profile.location,
        image_url: profile.image_url,
        interests,
        created_at: profile.created_at
      };
    });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getFeed
};

