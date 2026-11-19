import { v4 as uuidv4 } from 'uuid';
import { queryOne, run } from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';

/**
 * POST /api/swipe
 * Body: { profileId: string, action: 'LIKE' | 'PASS' }
 * Saves swipe, evaluates mutual match conditions without ever leaking one-sided likes.
 */
export function handleSwipe(req, res, next) {
  try {
    const { profileId, action } = req.body;

    // 1. Input Validation
    if (!profileId || typeof profileId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing profileId'
      });
    }

    if (profileId === DEMO_USER_ID) {
      return res.status(400).json({
        success: false,
        message: 'Cannot swipe on your own profile'
      });
    }

    const normalizedAction = (action || '').toUpperCase();
    if (normalizedAction !== 'LIKE' && normalizedAction !== 'PASS') {
      return res.status(400).json({
        success: false,
        message: 'Invalid swipe action. Must be LIKE or PASS.'
      });
    }

    // 2. Validate that target profile exists
    const targetProfile = queryOne('SELECT id, name, age, image_url, bio, location, interests FROM profiles WHERE id = ?', [profileId]);
    if (!targetProfile) {
      return res.status(404).json({
        success: false,
        message: 'Target profile not found'
      });
    }

    // 3. Prevent duplicate swipes
    const existingSwipe = queryOne(
      'SELECT id, action FROM swipes WHERE swiper_id = ? AND swiped_user_id = ?',
      [DEMO_USER_ID, profileId]
    );

    if (existingSwipe) {
      return res.status(409).json({
        success: false,
        message: 'You have already swiped on this profile',
        swipedAction: existingSwipe.action
      });
    }

    // 4. Record the swipe
    const swipeId = uuidv4();
    run(
      `INSERT INTO swipes (id, swiper_id, swiped_user_id, action)
       VALUES (?, ?, ?, ?)`,
      [swipeId, DEMO_USER_ID, profileId, normalizedAction]
    );

    // 5. Check for mutual match
    let isMatch = false;
    let matchDetails = null;

    if (normalizedAction === 'LIKE') {
      // Check if the other user has already liked the demo user
      const otherUserSwipe = queryOne(
        `SELECT id, action FROM swipes
         WHERE swiper_id = ? AND swiped_user_id = ?`,
        [profileId, DEMO_USER_ID]
      );

      // Only create match if the other user previously LIKED (not PASS or null)
      if (otherUserSwipe && otherUserSwipe.action === 'LIKE') {
        isMatch = true;

        // Canonical ordering to enforce UNIQUE constraint on pair
        const [u1, u2] = [DEMO_USER_ID, profileId].sort();

        const existingMatch = queryOne(
          'SELECT id FROM matches WHERE user_one_id = ? AND user_two_id = ?',
          [u1, u2]
        );

        if (!existingMatch) {
          const matchId = uuidv4();
          run(
            `INSERT INTO matches (id, user_one_id, user_two_id)
             VALUES (?, ?, ?)`,
            [matchId, u1, u2]
          );

          let interests = [];
          try {
            interests = JSON.parse(targetProfile.interests);
          } catch {
            interests = [];
          }

          matchDetails = {
            id: matchId,
            matchedUser: {
              id: targetProfile.id,
              name: targetProfile.name,
              age: targetProfile.age,
              image_url: targetProfile.image_url,
              bio: targetProfile.bio,
              location: targetProfile.location,
              interests
            },
            created_at: new Date().toISOString()
          };
        }
      }
    }

    // 6. Return response
    if (isMatch) {
      return res.status(200).json({
        success: true,
        message: "It's a match!",
        matched: true,
        match: matchDetails
      });
    }

    // Under all other circumstances (PASS or non-reciprocal LIKE):
    // Never reveal whether the other user liked or passed
    return res.status(200).json({
      success: true,
      message: 'Swipe saved',
      matched: false
    });

  } catch (error) {
    next(error);
  }
}

export default {
  handleSwipe
};

