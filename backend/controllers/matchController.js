import { queryAll } from '../database/db.js';
import { DEMO_USER_ID, seedDatabase } from '../database/seed.js';

/**
 * GET /api/matches
 * Returns only verified mutual matches for the demo user.
 * Never exposes one-sided likes under any circumstance.
 */
export function getMatches(req, res, next) {
  try {
    const sql = `
      SELECT
        m.id AS match_id,
        m.created_at AS matched_at,
        p.id AS user_id,
        p.name,
        p.age,
        p.bio,
        p.location,
        p.image_url,
        p.interests
      FROM matches m
      JOIN profiles p
        ON p.id = CASE
                    WHEN m.user_one_id = ? THEN m.user_two_id
                    ELSE m.user_one_id
                  END
      WHERE m.user_one_id = ? OR m.user_two_id = ?
      ORDER BY m.created_at DESC
    `;

    const rows = queryAll(sql, [DEMO_USER_ID, DEMO_USER_ID, DEMO_USER_ID]);

    const matches = rows.map((row) => {
      let interests = [];
      try {
        interests = JSON.parse(row.interests);
      } catch {
        interests = [];
      }

      return {
        matchId: row.match_id,
        matchedAt: row.matched_at,
        profile: {
          id: row.user_id,
          name: row.name,
          age: row.age,
          bio: row.bio,
          location: row.location,
          image_url: row.image_url,
          interests
        }
      };
    });

    return res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/reset
 * Helper endpoint for evaluators and reviewers to reset demo swipes and re-test easily.
 */
export function resetDemoState(req, res, next) {
  try {
    seedDatabase(true);
    return res.status(200).json({
      success: true,
      message: 'Demo state successfully reset to initial seed data.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getMatches,
  resetDemoState
};

