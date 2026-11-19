import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, run } from '../database/db.js';
import { DEMO_USER_ID } from '../database/seed.js';
import { runPersonaAgent } from '../agents/personaAgent.js';

/**
 * GET /api/matches/:matchId/messages
 * Fetches message history for a mutual match.
 * Seeds an initial warm greeting if conversation is brand new.
 */
export function getMessages(req, res, next) {
  try {
    const { matchId } = req.params;

    // Validate match ownership
    const match = queryOne(
      'SELECT id, user_one_id, user_two_id FROM matches WHERE id = ?',
      [matchId]
    );

    if (!match || (match.user_one_id !== DEMO_USER_ID && match.user_two_id !== DEMO_USER_ID)) {
      return res.status(404).json({
        success: false,
        message: 'Match conversation not found'
      });
    }

    const otherUserId = match.user_one_id === DEMO_USER_ID ? match.user_two_id : match.user_one_id;
    const profile = queryOne('SELECT id, name, age, bio, location, image_url, interests FROM profiles WHERE id = ?', [otherUserId]);

    // Fetch existing messages
    let messages = queryAll(
      'SELECT id, match_id, sender_id, text, created_at FROM messages WHERE match_id = ? ORDER BY created_at ASC',
      [matchId]
    );

    // If new conversation, seed an authentic initial greeting from the matched profile
    if (messages.length === 0 && profile) {
      const initialMessageId = uuidv4();
      const greetingText = `Hey! So glad we matched on Coy 😊 I saw your profile and had to say hi. How's your day going?`;

      run(
        `INSERT INTO messages (id, match_id, sender_id, text)
         VALUES (?, ?, ?, ?)`,
        [initialMessageId, matchId, otherUserId, greetingText]
      );

      messages = [
        {
          id: initialMessageId,
          match_id: matchId,
          sender_id: otherUserId,
          text: greetingText,
          created_at: new Date().toISOString()
        }
      ];
    }

    let interests = [];
    try {
      interests = JSON.parse(profile.interests);
    } catch {
      interests = [];
    }

    return res.status(200).json({
      success: true,
      profile: {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        bio: profile.bio,
        location: profile.location,
        image_url: profile.image_url,
        interests
      },
      messages
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/matches/:matchId/messages
 * Sends a message from the user and triggers the autonomous persona agent to reply.
 */
export async function sendMessage(req, res, next) {
  try {
    const { matchId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot be empty'
      });
    }

    // Verify match
    const match = queryOne(
      'SELECT id, user_one_id, user_two_id FROM matches WHERE id = ?',
      [matchId]
    );

    if (!match || (match.user_one_id !== DEMO_USER_ID && match.user_two_id !== DEMO_USER_ID)) {
      return res.status(404).json({
        success: false,
        message: 'Match conversation not found'
      });
    }

    const otherUserId = match.user_one_id === DEMO_USER_ID ? match.user_two_id : match.user_one_id;
    const profile = queryOne('SELECT id, name, age, bio, location, image_url, interests FROM profiles WHERE id = ?', [otherUserId]);

    // 1. Save user's message
    const userMessageId = uuidv4();
    const userCreatedAt = new Date().toISOString();
    run(
      `INSERT INTO messages (id, match_id, sender_id, text)
       VALUES (?, ?, ?, ?)`,
      [userMessageId, matchId, DEMO_USER_ID, text.trim()]
    );

    const userMessage = {
      id: userMessageId,
      match_id: matchId,
      sender_id: DEMO_USER_ID,
      text: text.trim(),
      created_at: userCreatedAt
    };

    // 2. Fetch conversation history for agent memory
    const history = queryAll(
      'SELECT sender_id, text FROM messages WHERE match_id = ? ORDER BY created_at ASC',
      [matchId]
    );

    // 3. Run Autonomous Persona Agent (supports Gemini, OpenAI, or local persona)
    const botReplyText = await runPersonaAgent({
      profile,
      history,
      userMessage: text.trim()
    });

    // 4. Save agent reply in database
    const botMessageId = uuidv4();
    const botCreatedAt = new Date().toISOString();
    run(
      `INSERT INTO messages (id, match_id, sender_id, text)
       VALUES (?, ?, ?, ?)`,
      [botMessageId, matchId, otherUserId, botReplyText]
    );

    const botMessage = {
      id: botMessageId,
      match_id: matchId,
      sender_id: otherUserId,
      text: botReplyText,
      created_at: botCreatedAt
    };

    return res.status(200).json({
      success: true,
      userMessage,
      botMessage
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getMessages,
  sendMessage
};
