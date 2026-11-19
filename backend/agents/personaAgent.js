/**
 * Coy Persona Agent Engine
 * Turns each matched profile into an autonomous AI dating persona agent.
 * Supports Google Gemini API (GEMINI_API_KEY) and OpenAI API (OPENAI_API_KEY)
 * with a high-fidelity local persona engine fallback.
 */

export async function runPersonaAgent({ profile, history = [], userMessage }) {
  let interests = [];
  try {
    interests = JSON.parse(profile.interests);
  } catch {
    interests = Array.isArray(profile.interests) ? profile.interests : [profile.interests];
  }

  const agentSystemPrompt = `You are an autonomous AI persona agent roleplaying as ${profile.name}, a ${profile.age}-year-old living in ${profile.location}.
Your background bio: "${profile.bio}".
Your core passions & interests: ${interests.join(', ')}.

Context:
You and Alex mutually liked each other on Coy, a privacy-first dating app where interest is only revealed when mutual.
Alex is now messaging you in your private chat.

Agent Directives:
- Stay completely in character as ${profile.name} at all times.
- Reply naturally, warmly, playfully, and concisely (1 to 2 short sentences), like texting on a modern dating app.
- Reference your passions (${interests.slice(0, 3).join(', ')}) or city (${profile.location}) when relevant.
- Ask an occasional lighthearted question to keep the momentum going.
- Never mention being an AI, assistant, language model, or bot. Speak directly as ${profile.name}.`;

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  // 1. Try Google Gemini Agent
  if (geminiKey) {
    try {
      return await executeGeminiAgent(geminiKey, agentSystemPrompt, history, userMessage);
    } catch (err) {
      console.warn('[PersonaAgent] Gemini agent error, checking fallback:', err.message);
    }
  }

  // 2. Try OpenAI Agent
  if (openaiKey) {
    try {
      return await executeOpenAIAgent(openaiKey, agentSystemPrompt, history, userMessage);
    } catch (err) {
      console.warn('[PersonaAgent] OpenAI agent error, checking fallback:', err.message);
    }
  }

  // 3. High-fidelity Local Contextual Agent Fallback (No API key needed)
  return executeLocalPersonaAgent(profile, interests, userMessage);
}

/**
 * Executes agent turn using Google Gemini API
 */
async function executeGeminiAgent(apiKey, systemPrompt, history, userMessage) {
  // Format past turns for multi-turn conversation
  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction for ${systemPrompt}]\n\nAlex says: "${userMessage}"` }]
    }
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 120
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error('Empty response from Gemini API');
  return reply;
}

/**
 * Executes agent turn using OpenAI API (GPT-4o-mini)
 */
async function executeOpenAIAgent(apiKey, systemPrompt, history, userMessage) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((m) => ({
      role: m.sender_id === 'demo-user-1' ? 'user' : 'assistant',
      content: m.text
    })),
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.85,
      max_tokens: 120
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('Empty response from OpenAI API');
  return reply;
}

/**
 * Local Persona Agent Generator (Zero external API dependencies)
 */
function executeLocalPersonaAgent(profile, interests, userMessage) {
  const msg = userMessage.toLowerCase();
  const primaryInterest = interests[0] || 'coffee';
  const secondaryInterest = interests[1] || 'reading';

  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    const greetings = [
      `Hey Alex! Loved that we matched. What's been the highlight of your week so far? ✨`,
      `Hey! Great to meet you here. Are you having a good day? 😊`,
      `Hi! Super glad we matched. Tell me something fun about your day!`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (msg.includes('coffee') || msg.includes('latte') || msg.includes('tea') || msg.includes('drink') || msg.includes('cafe')) {
    return `Ooh, I take my coffee and cafes very seriously! I've been loving this cozy spot in ${profile.location}. Are you more of an iced latte or hot espresso person? ☕`;
  }

  if (msg.includes('book') || msg.includes('read') || msg.includes('novel') || msg.includes('author')) {
    return `Yes! I can get lost for hours in a good bookshop. What's the last book or story that really stuck with you? 📚✨`;
  }

  if (msg.includes('movie') || msg.includes('film') || msg.includes('cinema') || msg.includes('watch') || msg.includes('series')) {
    return `I love indie films and good cinema soundtracks! Have you watched anything memorable recently? 🎬`;
  }

  if (msg.includes('travel') || msg.includes('trip') || msg.includes('vacation') || msg.includes('places') || msg.includes('visit')) {
    return `Traveling is my absolute favorite way to recharge! Where's the next place on your bucket list? ✈️`;
  }

  if (msg.includes('where') || msg.includes('from') || msg.includes('live') || msg.includes('city') || msg.includes('chennai') || msg.includes('bangalore') || msg.includes('mumbai')) {
    return `I'm currently based in ${profile.location}! Love the vibe here. Are you nearby or just exploring?`;
  }

  if (msg.includes('weekend') || msg.includes('plan') || msg.includes('doing') || msg.includes('today') || msg.includes('tonight')) {
    return `Probably checking out a new cafe and doing some ${secondaryInterest.toLowerCase()} this weekend. How about you, any fun plans? ✨`;
  }

  if (msg.includes('cute') || msg.includes('pretty') || msg.includes('beautiful') || msg.includes('smile') || msg.includes('nice')) {
    return `Aw, that's really sweet of you to say! 😊 You seem to have great energy too.`;
  }

  if (msg.includes('music') || msg.includes('song') || msg.includes('spotify') || msg.includes('listen') || msg.includes('band')) {
    return `Music is essential! I listen to a lot of indie tracks and vinyl. What's on repeat for you lately? 🎧`;
  }

  if (msg.includes('food') || msg.includes('eat') || msg.includes('dinner') || msg.includes('lunch') || msg.includes('cook')) {
    return `I'm a huge foodie! Always hunting for the best spots in ${profile.location}. What's your go-to comfort food? 🍕`;
  }

  const defaultReplies = [
    `Haha I love that! ${profile.bio.split('.')[0]}. What got you into that? 😊`,
    `That sounds awesome! Honestly, finding someone who gets that is rare. Tell me more! ✨`,
    `Totally agree with you on that! We should definitely talk more about ${primaryInterest.toLowerCase()} ☕`,
    `Haha you have such a fun vibe! If you could be anywhere right this second, where would you go? 🌴`
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

export default {
  runPersonaAgent
};

