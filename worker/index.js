/**
 * THE VOID - Cloudflare Worker API
 *
 * Endpoints:
 * - POST /api/thought - Submit a thought
 * - GET /api/state - Get void state
 * - POST /api/heartbeat - Update presence
 *
 * KV Namespace binding: VOID_KV
 */

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    // Rate limiting
    THOUGHT_COOLDOWN_MS: 3000,
    MAX_THOUGHTS_PER_MINUTE: 10,

    // Thought constraints
    MIN_THOUGHT_LENGTH: 3,
    MAX_THOUGHT_LENGTH: 200,
    MIN_WORDS_FOR_ECHO: 2,

    // Echo settings
    MAX_ECHOES: 500,
    ECHO_PROBABILITY: 0.2,

    // Presence TTL (seconds)
    PRESENCE_WINDOW_SECONDS: 120,
};

// Simple profanity filter (expandable)
const BLOCKED_WORDS = [
    // Add words to filter as needed
    // Keeping minimal to avoid over-censorship
];

// ═══════════════════════════════════════════════════════════════
// CORS Headers
// ═══════════════════════════════════════════════════════════════

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

// ═══════════════════════════════════════════════════════════════
// Main Handler
// ═══════════════════════════════════════════════════════════════

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // Route requests
            if (path === '/api/thought' && request.method === 'POST') {
                return await handleThought(request, env);
            }

            if (path === '/api/state' && request.method === 'GET') {
                return await handleState(env);
            }

            if (path === '/api/heartbeat' && request.method === 'POST') {
                return await handleHeartbeat(request, env);
            }

            // 404 for unknown routes
            return jsonResponse({ error: 'not found' }, 404);

        } catch (error) {
            console.error('Worker error:', error);
            return jsonResponse({ error: 'the void encountered an error' }, 500);
        }
    },
};

// ═══════════════════════════════════════════════════════════════
// Thought Handler
// ═══════════════════════════════════════════════════════════════

async function handleThought(request, env) {
    // Parse body
    let body;
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: 'invalid request' }, 400);
    }

    const text = (body.text || '').trim();

    // Validate thought
    if (text.length < CONFIG.MIN_THOUGHT_LENGTH) {
        return jsonResponse({ error: 'thought too brief' }, 400);
    }

    if (text.length > CONFIG.MAX_THOUGHT_LENGTH) {
        return jsonResponse({ error: 'thought too long' }, 400);
    }

    // Rate limiting by IP
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitKey = `ratelimit:${clientIP}`;

    const rateData = await env.VOID_KV.get(rateLimitKey, { type: 'json' });
    const now = Date.now();

    if (rateData) {
        const { count, windowStart } = rateData;
        const windowAge = now - windowStart;

        if (windowAge < 60000 && count >= CONFIG.MAX_THOUGHTS_PER_MINUTE) {
            return jsonResponse({ error: 'the void needs time to digest' }, 429);
        }
    }

    // Update rate limit
    const newRateData = {
        count: (rateData && (now - rateData.windowStart) < 60000) ? rateData.count + 1 : 1,
        windowStart: (rateData && (now - rateData.windowStart) < 60000) ? rateData.windowStart : now,
    };
    await env.VOID_KV.put(rateLimitKey, JSON.stringify(newRateData), { expirationTtl: 120 });

    // Increment global counter
    const count = await incrementCounter(env);

    // Maybe store as echo (if appropriate)
    await maybeStoreEcho(env, text);

    // Maybe return an echo
    let echo = null;
    if (Math.random() < CONFIG.ECHO_PROBABILITY) {
        echo = await getRandomEcho(env);
    }

    // Increment daily counter (for void evolution)
    await incrementDailyCounter(env);

    return jsonResponse({ count, echo });
}

// ═══════════════════════════════════════════════════════════════
// State Handler
// ═══════════════════════════════════════════════════════════════

async function handleState(env) {
    const [count, presence, dailyCount] = await Promise.all([
        getCounter(env),
        getPresence(env),
        getDailyCount(env),
    ]);

    // Determine mood based on activity
    let mood = 'calm';
    if (dailyCount > 1000) mood = 'restless';
    else if (dailyCount > 500) mood = 'active';
    else if (dailyCount > 100) mood = 'stirring';
    else if (dailyCount < 10) mood = 'dormant';

    return jsonResponse({ count, presence, mood, daily: dailyCount });
}

// ═══════════════════════════════════════════════════════════════
// Heartbeat Handler
// ═══════════════════════════════════════════════════════════════

async function handleHeartbeat(request, env) {
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Use minute-based buckets for presence
    const minute = Math.floor(Date.now() / 60000);
    const presenceKey = `presence:${minute}`;

    // Get current presence set for this minute
    let presenceSet = await env.VOID_KV.get(presenceKey, { type: 'json' }) || [];

    // Add this IP if not already present (hashed for privacy)
    const hashedIP = await hashIP(clientIP);
    if (!presenceSet.includes(hashedIP)) {
        presenceSet.push(hashedIP);
        await env.VOID_KV.put(presenceKey, JSON.stringify(presenceSet), {
            expirationTtl: CONFIG.PRESENCE_WINDOW_SECONDS,
        });
    }

    return jsonResponse({ ok: true });
}

// ═══════════════════════════════════════════════════════════════
// Counter Functions
// ═══════════════════════════════════════════════════════════════

async function getCounter(env) {
    const count = await env.VOID_KV.get('count');
    return count ? parseInt(count, 10) : 0;
}

async function incrementCounter(env) {
    // Note: This is not atomic, but acceptable for our use case
    const current = await getCounter(env);
    const newCount = current + 1;
    await env.VOID_KV.put('count', newCount.toString());
    return newCount;
}

async function getDailyCount(env) {
    const today = new Date().toISOString().split('T')[0];
    const count = await env.VOID_KV.get(`daily:${today}`);
    return count ? parseInt(count, 10) : 0;
}

async function incrementDailyCounter(env) {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily:${today}`;
    const current = await getDailyCount(env);
    await env.VOID_KV.put(key, (current + 1).toString(), {
        expirationTtl: 86400 * 2, // Keep for 2 days
    });
}

// ═══════════════════════════════════════════════════════════════
// Presence Functions
// ═══════════════════════════════════════════════════════════════

async function getPresence(env) {
    const now = Math.floor(Date.now() / 60000);

    // Check last 2 minutes of presence data
    const [current, previous] = await Promise.all([
        env.VOID_KV.get(`presence:${now}`, { type: 'json' }),
        env.VOID_KV.get(`presence:${now - 1}`, { type: 'json' }),
    ]);

    // Combine unique IPs
    const allIPs = new Set([
        ...(current || []),
        ...(previous || []),
    ]);

    return allIPs.size;
}

// ═══════════════════════════════════════════════════════════════
// Echo Functions
// ═══════════════════════════════════════════════════════════════

async function maybeStoreEcho(env, text) {
    // Check if thought is suitable for echoing
    const words = text.split(/\s+/).filter(w => w.length > 0);

    if (words.length < CONFIG.MIN_WORDS_FOR_ECHO) return;
    if (text.length > 100) return; // Keep echoes concise

    // Basic content filtering
    const lower = text.toLowerCase();
    for (const word of BLOCKED_WORDS) {
        if (lower.includes(word)) return;
    }

    // Don't store if it looks like personal info
    if (containsPersonalInfo(text)) return;

    // Get current echoes
    let echoes = await env.VOID_KV.get('echoes', { type: 'json' }) || [];

    // Don't store duplicates
    if (echoes.includes(text)) return;

    // Add new echo
    echoes.push(text);

    // Trim to max size (remove oldest)
    if (echoes.length > CONFIG.MAX_ECHOES) {
        echoes = echoes.slice(-CONFIG.MAX_ECHOES);
    }

    await env.VOID_KV.put('echoes', JSON.stringify(echoes));
}

async function getRandomEcho(env) {
    const echoes = await env.VOID_KV.get('echoes', { type: 'json' });

    if (!echoes || echoes.length === 0) {
        // Return a seed echo if no user echoes yet
        return getSeededEcho();
    }

    return echoes[Math.floor(Math.random() * echoes.length)];
}

function getSeededEcho() {
    // Pre-seeded echoes for when the void is new
    const seeds = [
        "i feel like nobody understands",
        "sometimes the silence is comforting",
        "why does everything feel so heavy",
        "i just want to be heard",
        "the darkness is peaceful",
        "i hope tomorrow is better",
        "letting go is harder than holding on",
        "i miss who i used to be",
        "some things can't be unsaid",
        "the night knows my secrets",
        "i wonder if anyone else feels this way",
        "peace is all i want",
        "the quiet helps me think",
        "i'm still figuring things out",
        "some days are harder than others",
    ];

    return seeds[Math.floor(Math.random() * seeds.length)];
}

// ═══════════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════════

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: CORS_HEADERS,
    });
}

async function hashIP(ip) {
    // Simple hash for privacy (not cryptographically secure, but sufficient)
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + 'void-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

function containsPersonalInfo(text) {
    // Basic check for email addresses
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) return true;

    // Basic check for phone numbers
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) return true;

    // Basic check for social security numbers
    if (/\b\d{3}[-]?\d{2}[-]?\d{4}\b/.test(text)) return true;

    return false;
}
