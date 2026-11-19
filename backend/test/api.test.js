import test from 'node:test';
import assert from 'node:assert/strict';
import { getDatabase, queryAll, queryOne } from '../database/db.js';
import { seedDatabase, DEMO_USER_ID } from '../database/seed.js';
import { getFeed } from '../controllers/feedController.js';
import { handleSwipe } from '../controllers/swipeController.js';
import { getMatches } from '../controllers/matchController.js';

// Mock Express req, res, next helper
function createMockReqRes({ params = {}, query = {}, body = {} } = {}) {
  let statusCode = 200;
  let responseData = null;

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    }
  };

  return {
    req: { params, query, body },
    res,
    getStatus: () => statusCode,
    getData: () => responseData
  };
}

test('COY Discover Tab Backend & Privacy Test Suite', async (t) => {
  // Reset database before test run
  seedDatabase(true);

  await t.test('1. Feed returns valid profiles up to limit and never exposes private like data', () => {
    const { req, res, getStatus, getData } = createMockReqRes({ query: { limit: '10' } });
    getFeed(req, res, () => {});

    assert.equal(getStatus(), 200);
    const data = getData();
    assert.equal(data.success, true);
    assert.equal(data.data.length, 10);

    // Verify privacy: no like indicators or private information
    for (const profile of data.data) {
      assert.ok(profile.id);
      assert.ok(profile.name);
      assert.ok(profile.age);
      assert.ok(Array.isArray(profile.interests));
      assert.equal(profile.hasLikedYou, undefined);
      assert.equal(profile.swipedAction, undefined);
    }
  });

  await t.test('2. Swipe validation: rejects invalid action', () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      body: { profileId: 'user-1', action: 'SUPERLIKE' }
    });
    handleSwipe(req, res, () => {});

    assert.equal(getStatus(), 400);
    assert.equal(getData().success, false);
    assert.match(getData().message, /Invalid swipe action/i);
  });

  await t.test('3. Swipe validation: rejects swiping on self', () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      body: { profileId: DEMO_USER_ID, action: 'LIKE' }
    });
    handleSwipe(req, res, () => {});

    assert.equal(getStatus(), 400);
    assert.equal(getData().success, false);
  });

  await t.test('4. Swipe validation: rejects non-existent profile', () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      body: { profileId: 'non-existent-user-999', action: 'LIKE' }
    });
    handleSwipe(req, res, () => {});

    assert.equal(getStatus(), 404);
    assert.equal(getData().success, false);
  });

  await t.test('5. Swiping PASS records swipe, removes profile from feed, returns matched: false', () => {
    const targetId = 'user-5'; // Priya Patel
    const { req, res, getStatus, getData } = createMockReqRes({
      body: { profileId: targetId, action: 'PASS' }
    });
    handleSwipe(req, res, () => {});

    assert.equal(getStatus(), 200);
    const data = getData();
    assert.equal(data.success, true);
    assert.equal(data.matched, false);

    // Verify swipe is saved in database
    const swipeInDb = queryOne(
      'SELECT action FROM swipes WHERE swiper_id = ? AND swiped_user_id = ?',
      [DEMO_USER_ID, targetId]
    );
    assert.equal(swipeInDb.action, 'PASS');

    // Verify profile no longer appears in feed
    const { req: feedReq, res: feedRes, getData: getFeedData } = createMockReqRes({ query: { limit: '32' } });
    getFeed(feedReq, feedRes, () => {});
    const feed = getFeedData().data;
    assert.equal(feed.some(p => p.id === targetId), false);
  });

  await t.test('6. Duplicate swipe is rejected with 409 Conflict', () => {
    const targetId = 'user-5'; // Already passed in test 5
    const { req, res, getStatus, getData } = createMockReqRes({
      body: { profileId: targetId, action: 'LIKE' }
    });
    handleSwipe(req, res, () => {});

    assert.equal(getStatus(), 409);
    assert.equal(getData().success, false);
    assert.match(getData().message, /already swiped/i);
  });

  await t.test('7. Swiping LIKE on user who has NOT liked demo-user returns matched: false without revealing status', () => {
    const targetId = 'user-7'; // Rohan (not in demoReciprocalLikes)
    const { req, res, getStatus, getData } = createMockReqRes({
      body: { profileId: targetId, action: 'LIKE' }
    });
    handleSwipe(req, res, () => {});

    assert.equal(getStatus(), 200);
    const data = getData();
    assert.equal(data.success, true);
    assert.equal(data.matched, false);
    assert.equal(data.message, 'Swipe saved');

    // Confirm no match record created in DB
    const match = queryOne(
      'SELECT id FROM matches WHERE (user_one_id = ? AND user_two_id = ?) OR (user_one_id = ? AND user_two_id = ?)',
      [DEMO_USER_ID, targetId, targetId, DEMO_USER_ID]
    );
    assert.equal(match, undefined);
  });

  await t.test('8. Swiping LIKE on user with reciprocal like (user-1 Ananya) creates mutual match and returns matched: true', () => {
    const targetId = 'user-1'; // Ananya (pre-seeded with reciprocal like)
    const { req, res, getStatus, getData } = createMockReqRes({
      body: { profileId: targetId, action: 'LIKE' }
    });
    handleSwipe(req, res, () => {});

    assert.equal(getStatus(), 200);
    const data = getData();
    assert.equal(data.success, true);
    assert.equal(data.matched, true);
    assert.equal(data.message, "It's a match!");
    assert.ok(data.match);
    assert.equal(data.match.matchedUser.name, 'Ananya');

    // Confirm match record is saved in matches table in SQLite
    const match = queryOne(
      'SELECT id FROM matches WHERE (user_one_id = ? AND user_two_id = ?) OR (user_one_id = ? AND user_two_id = ?)',
      [DEMO_USER_ID, targetId, targetId, DEMO_USER_ID]
    );
    assert.ok(match);
  });

  await t.test('9. GET /api/matches returns ONLY mutual matches and never one-sided likes', () => {
    const { req, res, getStatus, getData } = createMockReqRes();
    getMatches(req, res, () => {});

    assert.equal(getStatus(), 200);
    const data = getData();
    assert.equal(data.success, true);
    assert.equal(data.count, 1);
    assert.equal(data.data[0].profile.id, 'user-1');
    assert.equal(data.data[0].profile.name, 'Ananya');
    assert.ok(data.data[0].matchedAt);
  });

  await t.test('10. Reset demo state cleans swipes and restores initial seeded state', () => {
    seedDatabase(true);

    const { req, res, getStatus, getData } = createMockReqRes();
    getMatches(req, res, () => {});
    assert.equal(getData().count, 0);

    const { req: feedReq, res: feedRes, getData: getFeedData } = createMockReqRes({ query: { limit: '10' } });
    getFeed(feedReq, feedRes, () => {});
    // user-1 is now back in feed since demo swipes were reset
    assert.ok(getFeedData().data.some(p => p.id === 'user-1'));
  });
});
