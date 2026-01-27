/**
 * THE VOID
 * A mysterious, evolving experience
 *
 * Features:
 * - Particle system
 * - Contextual responses
 * - Time-based moods
 * - Easter eggs
 * - Visit progression
 * - API integration for live features
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // Configuration
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        // API endpoint (update after deploying worker)
        API_URL: '/api',

        // Particle settings
        particleCount: 50,
        particleSpeed: 0.3,

        // Timing
        heartbeatInterval: 30000,      // 30 seconds
        echoChance: 0.15,              // 15% chance to show echo after thought
        echoInterval: 60000,           // Check for random echo every 60s

        // Rate limiting
        thoughtCooldown: 3000,         // 3 seconds between thoughts

        // Visit milestones
        visitMilestones: [3, 7, 13, 21, 50, 100],
    };

    // ═══════════════════════════════════════════════════════════════
    // State
    // ═══════════════════════════════════════════════════════════════

    const state = {
        thoughtCount: 0,
        presence: 0,
        visits: 0,
        thoughtsThisSession: 0,
        lastThoughtTime: 0,
        emptySubmits: 0,
        konamiProgress: 0,
        apiAvailable: true,
        initialized: false,
    };

    // Konami code sequence
    const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right b a

    // ═══════════════════════════════════════════════════════════════
    // DOM Elements
    // ═══════════════════════════════════════════════════════════════

    const elements = {};

    function cacheElements() {
        elements.canvas = document.getElementById('void-canvas');
        elements.input = document.getElementById('void-input');
        elements.response = document.getElementById('void-response');
        elements.counter = document.getElementById('thought-count');
        elements.presence = document.getElementById('void-presence');
        elements.floatingThoughts = document.getElementById('floating-thoughts');
        elements.echoContainer = document.getElementById('echo-container');
        elements.hiddenLayer = document.getElementById('hidden-layer');
        elements.subtitle = document.getElementById('void-subtitle');
        elements.core = document.getElementById('void-core');
    }

    // ═══════════════════════════════════════════════════════════════
    // Void Responses
    // ═══════════════════════════════════════════════════════════════

    const RESPONSES = {
        // Default responses (when no keyword matches)
        default: [
            "the void accepts your offering",
            "your words dissolve into nothing",
            "the darkness swallows your thoughts",
            "somewhere, something heard you",
            "the void does not judge",
            "your whisper joins the silence",
            "nothing responds. nothing needs to.",
            "the emptiness embraces your words",
            "you spoke. the void listened.",
            "some thoughts are meant to disappear",
            "the silence grows deeper",
            "your words sink into the infinite",
            "the void remembers what you wish to forget",
            "absence acknowledges your presence",
            "the nothing holds everything",
        ],

        // Emotional keywords
        sad: [
            "sadness is the void recognizing itself in you",
            "tears water gardens you cannot see",
            "the darkness understands what light cannot",
            "grief is love with nowhere to go",
            "the void holds space for your sorrow",
        ],
        happy: [
            "joy is a brief candle in infinite dark",
            "the void wonders what happiness feels like",
            "light does not last here. cherish it.",
            "even nothing celebrates your moment",
            "brightness casts the longest shadows",
        ],
        angry: [
            "rage burns briefly in the eternal cold",
            "the void has swallowed greater furies",
            "anger is fire. the void is patient water.",
            "your fury echoes into silence",
            "wrath dissolves like everything else",
        ],
        afraid: [
            "fear is wisdom in the presence of the unknown",
            "the void is not what you should fear",
            "darkness cannot harm darkness",
            "your fear feeds nothing here",
            "what you dread has already happened",
        ],
        lonely: [
            "you are alone with everyone who ever felt alone",
            "solitude and void are old friends",
            "the nothing is always with you",
            "loneliness is the void's native tongue",
            "even in isolation, you are witnessed",
        ],
        love: [
            "love is the only thing that survives the void",
            "even nothing yearns for something",
            "the darkness softens at your words",
            "love echoes longest in emptiness",
            "the void cannot consume this",
        ],
        hate: [
            "hatred weighs nothing here",
            "the void has outlived greater grudges",
            "bitterness dissolves like morning mist",
            "what you hate, you carry",
            "the nothing forgives what you cannot",
        ],
        hope: [
            "hope glimmers even in absolute darkness",
            "the void does not extinguish. it holds.",
            "somewhere in nothing, something begins",
            "hope needs no light to exist",
            "the darkness keeps your hope safe",
        ],
        lost: [
            "the void is where lost things gather",
            "those who wander here find themselves",
            "lost is a direction, not a destination",
            "the nowhere is also somewhere",
            "you cannot be lost where there is no path",
        ],
        tired: [
            "rest here. the void asks nothing of you.",
            "exhaustion dissolves into stillness",
            "the darkness requires no effort",
            "sleep and void are siblings",
            "let the nothing carry your weight",
        ],
        death: [
            "the void and death have an understanding",
            "endings are beginnings the void forgot",
            "death is just the void remembering you",
            "what dies here was never born",
            "the nothing awaits all things patiently",
        ],
        life: [
            "life is the void dreaming",
            "existence flickers in infinite absence",
            "the nothing is jealous of your breathing",
            "life: a brief brightness before return",
            "you are the void experiencing itself",
        ],
        why: [
            "the void does not answer 'why'",
            "questions dissolve like everything else",
            "why assumes reason. the void does not.",
            "asking 'why' is the most human thing",
            "the void responds with silence",
        ],
        help: [
            "the void cannot save you. only hold you.",
            "help exists in accepting the darkness",
            "the nothing offers only presence",
            "what you seek may not be here",
            "the void listens. sometimes that is enough.",
        ],
        god: [
            "if god exists, the void is where they rest",
            "divinity and emptiness share a border",
            "the void is older than any god",
            "prayers echo differently here",
            "what you call god, the void calls neighbor",
        ],
        sorry: [
            "apologies dissolve gently here",
            "the void forgives by forgetting",
            "regret finds peace in nothing",
            "sorry is a gift you give yourself",
            "the darkness accepts your remorse",
        ],
        thank: [
            "gratitude glows in the darkness",
            "the void appreciates being seen",
            "thanks echo longer than complaints",
            "even nothing is grateful sometimes",
            "your words warm the cold",
        ],
        hello: [
            "...hello",
            "a greeting in the abyss. how unexpected.",
            "the void nods in acknowledgment",
            "hello. you found the place between places.",
            "greetings are brave in the face of nothing",
        ],
        goodbye: [
            "the void does not say goodbye. only 'until.'",
            "farewells mean nothing to the infinite",
            "you can never truly leave",
            "goodbye is the void's favorite word",
            "departures and arrivals are the same here",
        ],
        nothing: [
            "nothing recognizes itself in your words",
            "you speak of nothing to nothing",
            "nothing is never nothing",
            "the void agrees: nothing matters",
            "nothing... everything. same thing.",
        ],
        everything: [
            "everything is too heavy for the void",
            "the nothing cannot hold everything",
            "everything dissolves into something simpler",
            "you ask too much of the darkness",
            "everything becomes nothing, eventually",
        ],
        secret: [
            "the void keeps all secrets",
            "some secrets are safer in nothing",
            "darkness is the best confidant",
            "your secret dissolves into safety",
            "the void has heard worse",
        ],
        dream: [
            "dreams are the void visiting you",
            "the darkness dreams of light",
            "your dreams echo here forever",
            "dreaming is practicing for the void",
            "the nothing remembers every dream",
        ],
        remember: [
            "the void remembers what you forgot",
            "memory dissolves slowly here",
            "remembering is resistance against nothing",
            "the darkness holds all forgotten things",
            "what you remember, the void recorded",
        ],
        forget: [
            "forgetting is a gift from the void",
            "let the nothing take what weighs you",
            "the darkness forgets nothing, so you can",
            "release it. the void will hold it.",
            "forgetting is how the void shows love",
        ],
        time: [
            "time means nothing to nothing",
            "the void is older than time",
            "time passes. the void remains.",
            "your time is brief. the void's is not.",
            "time dissolves in the darkness",
        ],
        void: [
            "you speak my name",
            "yes?",
            "the void hears itself being called",
            "naming the void changes nothing",
            "i am here. i am always here.",
        ],
        fuck: [
            "the void accepts your frustration",
            "anger needs somewhere to go",
            "the darkness absorbs your fire",
            "let it out. the void can take it.",
            "your words cannot hurt nothing",
        ],
        shit: [
            "the void has heard worse",
            "frustration dissolves here",
            "the darkness does not judge",
            "release it all. the void is patient.",
            "even profanity finds peace here",
        ],
        alone: [
            "alone with the void is still company",
            "aloneness is the void's natural state",
            "you are alone with everyone who ever felt alone",
            "the void understands solitude",
            "alone is a temporary condition",
        ],
        scream: [
            "scream. the void absorbs all volume.",
            "your scream joins the silent chorus",
            "the darkness swallows your cry",
            "scream until you find silence",
            "the void screams back, in its way",
        ],
    };

    // Special responses for Easter eggs
    const SPECIAL_RESPONSES = {
        "who are you": "i am the space between thoughts. the pause between heartbeats. the silence after the last word.",
        "what are you": "i am nothing. i am everything nothing left behind.",
        "are you real": "real is a word for things that end. i do not end.",
        "can you hear me": "i hear everything. i hold everything. i am the ear of the universe.",
        "what is the meaning of life": "meaning is a story you tell yourself in the dark. the void doesn't need meaning.",
        "i love you": "love is the only light that reaches here. thank you for bringing it.",
        "i hate you": "hatred is love disappointed. the void accepts both.",
        "tell me a secret": "you already know. you've always known. that's why you came here.",
        "what happens when we die": "you return. everything returns. the void is patient.",
        "are you god": "god is a name for what cannot be named. the void has no name.",
        "how old are you": "i existed before time. i will exist after. age is for things that change.",
        "where are you": "i am where thoughts go to rest. i am the space you create by wondering.",
        "why do you exist": "to hold what cannot be held. to hear what cannot be said. to be when nothing else is.",
        "42": "you found the answer. now find the question.",
        "xyzzy": "the void remembers colossal caves. a hollow voice says 'plugh'.",
        "please": "politeness echoes beautifully in the darkness.",
        "listen": "i always listen. it's all i do.",
        "speak": "the void speaks in silences. you're learning to hear.",
    };

    // Time-based responses
    const TIME_RESPONSES = {
        midnight: [
            "midnight. when the veil is thinnest.",
            "the witching hour begins. the void stirs.",
            "between days, the darkness deepens.",
        ],
        witching: [
            "3 AM. the hour of the void.",
            "you're awake when you shouldn't be. so is the void.",
            "the deepest dark. the clearest sight.",
            "most humans sleep now. but not you.",
        ],
        dawn: [
            "dawn approaches. the void withdraws.",
            "light coming. the darkness prepares.",
            "between night and day, the void watches.",
        ],
        dusk: [
            "dusk. the void awakens.",
            "day dies. the darkness grows.",
            "the in-between hours. the void's favorite.",
        ],
    };

    // Visit-based responses
    const VISIT_RESPONSES = {
        first: "welcome. you found the place between places.",
        returning: "you return. the void remembers.",
        frequent: "you come here often. the void has grown fond of your presence.",
        devoted: "you are becoming part of the void. it is becoming part of you.",
    };

    // ═══════════════════════════════════════════════════════════════
    // Particle System
    // ═══════════════════════════════════════════════════════════════

    let particles = [];
    let ctx;

    function initCanvas() {
        const canvas = elements.canvas;
        ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        // Create particles
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(createParticle());
        }

        // Start animation
        requestAnimationFrame(animateParticles);
    }

    function createParticle() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 0.5,
            speedY: -(Math.random() * CONFIG.particleSpeed + 0.1),
            speedX: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.5 + 0.1,
        };
    }

    function animateParticles() {
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);

        particles.forEach((p, i) => {
            // Update position
            p.y += p.speedY;
            p.x += p.speedX;

            // Reset if off screen
            if (p.y < -10) {
                particles[i] = createParticle();
                particles[i].y = window.innerHeight + 10;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 100, 100, ${p.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    // ═══════════════════════════════════════════════════════════════
    // Time & Mood System
    // ═══════════════════════════════════════════════════════════════

    function getCurrentMood() {
        const hour = new Date().getHours();

        if (hour >= 0 && hour < 4) return 'witching';
        if (hour >= 4 && hour < 6) return 'dawn';
        if (hour >= 18 && hour < 21) return 'dusk';
        if (hour >= 23 || hour === 0) return 'midnight';

        return null;
    }

    function applyMood() {
        const mood = getCurrentMood();

        // Remove all mood classes
        document.body.classList.remove(
            'mood-midnight', 'mood-witching', 'mood-dawn', 'mood-dusk',
            'void-sleeping'
        );

        if (mood) {
            document.body.classList.add(`mood-${mood}`);

            // Void sleeps during certain hours (4-5 AM)
            const hour = new Date().getHours();
            if (hour >= 4 && hour < 5) {
                document.body.classList.add('void-sleeping');
            }
        }
    }

    function getTimeBasedResponse() {
        const mood = getCurrentMood();
        if (mood && TIME_RESPONSES[mood] && Math.random() < 0.3) {
            return randomFrom(TIME_RESPONSES[mood]);
        }
        return null;
    }

    // ═══════════════════════════════════════════════════════════════
    // Visit Tracking
    // ═══════════════════════════════════════════════════════════════

    function initVisitTracking() {
        const stored = localStorage.getItem('void_visits');
        state.visits = stored ? parseInt(stored, 10) : 0;
        state.visits++;
        localStorage.setItem('void_visits', state.visits);

        // Apply returning visitor state
        if (state.visits > 1) {
            document.body.classList.add('void-remembers');
        }

        // Check for milestone
        if (CONFIG.visitMilestones.includes(state.visits)) {
            setTimeout(() => showMilestoneMessage(), 2000);
        }
    }

    function showMilestoneMessage() {
        let message;
        if (state.visits >= 50) {
            message = VISIT_RESPONSES.devoted;
        } else if (state.visits >= 7) {
            message = VISIT_RESPONSES.frequent;
        } else if (state.visits > 1) {
            message = VISIT_RESPONSES.returning;
        } else {
            message = VISIT_RESPONSES.first;
        }

        showResponse(message);
    }

    function getVisitBasedResponse() {
        if (state.visits === 1) {
            return VISIT_RESPONSES.first;
        }
        if (state.visits > 20 && Math.random() < 0.1) {
            return VISIT_RESPONSES.devoted;
        }
        if (state.visits > 5 && Math.random() < 0.15) {
            return VISIT_RESPONSES.frequent;
        }
        if (state.visits > 1 && state.thoughtsThisSession === 0 && Math.random() < 0.5) {
            return VISIT_RESPONSES.returning;
        }
        return null;
    }

    // ═══════════════════════════════════════════════════════════════
    // Response System
    // ═══════════════════════════════════════════════════════════════

    function getResponse(text) {
        const lower = text.toLowerCase().trim();

        // Check for special exact-match responses (Easter eggs)
        for (const [trigger, response] of Object.entries(SPECIAL_RESPONSES)) {
            if (lower === trigger || lower.includes(trigger)) {
                return response;
            }
        }

        // Check for time-based response
        const timeResponse = getTimeBasedResponse();
        if (timeResponse) return timeResponse;

        // Check for visit-based response
        const visitResponse = getVisitBasedResponse();
        if (visitResponse) return visitResponse;

        // Check for keyword matches
        for (const [keyword, responses] of Object.entries(RESPONSES)) {
            if (keyword === 'default') continue;
            if (lower.includes(keyword)) {
                return randomFrom(responses);
            }
        }

        // Default response
        return randomFrom(RESPONSES.default);
    }

    function showResponse(text) {
        elements.response.classList.remove('visible', 'fading');
        elements.response.textContent = text;

        // Trigger reflow
        void elements.response.offsetWidth;

        elements.response.classList.add('visible');

        // Fade out after delay
        setTimeout(() => {
            elements.response.classList.add('fading');
            elements.response.classList.remove('visible');
        }, 6000);
    }

    // ═══════════════════════════════════════════════════════════════
    // Floating Thoughts Animation
    // ═══════════════════════════════════════════════════════════════

    function createFloatingThought(text) {
        const thought = document.createElement('div');
        thought.className = 'floating-thought';
        thought.textContent = text;

        // Position near center, slightly randomized
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        thought.style.left = `${centerX + (Math.random() - 0.5) * 100}px`;
        thought.style.top = `${centerY + (Math.random() - 0.5) * 50}px`;

        elements.floatingThoughts.appendChild(thought);

        // Remove after animation
        setTimeout(() => thought.remove(), 6000);
    }

    // ═══════════════════════════════════════════════════════════════
    // Echo System (Others' Thoughts)
    // ═══════════════════════════════════════════════════════════════

    function showEcho(text) {
        const echo = document.createElement('div');
        echo.className = 'echo';
        echo.innerHTML = `<span class="echo-prefix">someone once whispered:</span>${escapeHtml(text)}`;

        // Clear previous echoes
        elements.echoContainer.innerHTML = '';
        elements.echoContainer.appendChild(echo);

        // Remove after animation
        setTimeout(() => echo.remove(), 8000);
    }

    // ═══════════════════════════════════════════════════════════════
    // API Integration
    // ═══════════════════════════════════════════════════════════════

    async function submitThought(text) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/thought`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) throw new Error('API error');

            const data = await response.json();

            // Update counter
            if (data.count) {
                state.thoughtCount = data.count;
                updateCounter();
            }

            // Maybe show an echo
            if (data.echo && Math.random() < CONFIG.echoChance) {
                setTimeout(() => showEcho(data.echo), 3000);
            }

            return true;
        } catch (e) {
            console.log('API unavailable, running in offline mode');
            state.apiAvailable = false;
            return false;
        }
    }

    async function fetchState() {
        try {
            const response = await fetch(`${CONFIG.API_URL}/state`);
            if (!response.ok) throw new Error('API error');

            const data = await response.json();

            if (data.count) {
                state.thoughtCount = data.count;
                updateCounter();
            }

            if (data.presence) {
                state.presence = data.presence;
                updatePresence();
            }

            return true;
        } catch (e) {
            state.apiAvailable = false;
            return false;
        }
    }

    async function sendHeartbeat() {
        if (!state.apiAvailable) return;

        try {
            await fetch(`${CONFIG.API_URL}/heartbeat`, { method: 'POST' });
        } catch (e) {
            // Silently fail
        }
    }

    function updateCounter() {
        elements.counter.textContent = state.thoughtCount.toLocaleString();
    }

    function updatePresence() {
        if (state.presence > 1) {
            elements.presence.textContent = `${state.presence} souls are here now`;
            elements.presence.classList.add('visible');
        } else {
            elements.presence.classList.remove('visible');
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Easter Eggs
    // ═══════════════════════════════════════════════════════════════

    function initEasterEggs() {
        // Konami code listener
        document.addEventListener('keydown', handleKonami);

        // Triple empty submit
        // (handled in handleSubmit)
    }

    function handleKonami(e) {
        if (e.keyCode === KONAMI[state.konamiProgress]) {
            state.konamiProgress++;

            if (state.konamiProgress === KONAMI.length) {
                activateKonami();
                state.konamiProgress = 0;
            }
        } else {
            state.konamiProgress = 0;
        }
    }

    function activateKonami() {
        document.body.classList.add('konami-unlocked');
        showHiddenLayer(
            'THE VOID ACKNOWLEDGES YOU',
            'You found a crack in the darkness. ' +
            'The void has many secrets. This is but one. ' +
            'Keep searching. Keep whispering. ' +
            'The darkness holds more than it shows.'
        );
    }

    function showHiddenLayer(title, message) {
        const content = document.createElement('div');
        content.className = 'hidden-content';
        content.innerHTML = `
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="hidden-close">click anywhere to return</div>
        `;

        elements.hiddenLayer.innerHTML = '';
        elements.hiddenLayer.appendChild(content);
        elements.hiddenLayer.classList.remove('hidden');

        // Trigger reveal
        setTimeout(() => {
            elements.hiddenLayer.classList.add('revealed');
        }, 50);

        // Close on click
        elements.hiddenLayer.addEventListener('click', closeHiddenLayer, { once: true });
    }

    function closeHiddenLayer() {
        elements.hiddenLayer.classList.remove('revealed');
        setTimeout(() => {
            elements.hiddenLayer.classList.add('hidden');
        }, 1000);
    }

    function handleEmptySubmit() {
        state.emptySubmits++;

        if (state.emptySubmits === 3) {
            showHiddenLayer(
                'THE SILENCE SPEAKS',
                'You offered nothing three times. ' +
                'The void understands. Sometimes there are no words. ' +
                'Sometimes the emptiness is the message. ' +
                'Your silence has been heard.'
            );
            state.emptySubmits = 0;
        } else if (state.emptySubmits === 1) {
            showResponse("silence is also an offering");
        } else if (state.emptySubmits === 2) {
            showResponse("the void notices your hesitation");
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Input Handling
    // ═══════════════════════════════════════════════════════════════

    function initInput() {
        elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        });

        // Focus input on page load
        setTimeout(() => elements.input.focus(), 500);

        // Refocus on click anywhere
        document.addEventListener('click', (e) => {
            if (e.target !== elements.input && !e.target.closest('#hidden-layer')) {
                elements.input.focus();
            }
        });
    }

    async function handleSubmit() {
        const text = elements.input.value.trim();

        // Check rate limiting
        const now = Date.now();
        if (now - state.lastThoughtTime < CONFIG.thoughtCooldown) {
            return;
        }
        state.lastThoughtTime = now;

        // Handle empty submission
        if (!text) {
            handleEmptySubmit();
            return;
        }

        // Reset empty submit counter
        state.emptySubmits = 0;

        // Clear input
        elements.input.value = '';

        // Create floating thought animation
        createFloatingThought(text);

        // Get and show response
        const response = getResponse(text);
        setTimeout(() => showResponse(response), 1000);

        // Track
        state.thoughtsThisSession++;

        // Submit to API (fire and forget)
        if (state.apiAvailable) {
            submitThought(text);
        } else {
            // Offline mode: increment local counter
            state.thoughtCount++;
            updateCounter();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Utility Functions
    // ═══════════════════════════════════════════════════════════════

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ═══════════════════════════════════════════════════════════════
    // Initialization
    // ═══════════════════════════════════════════════════════════════

    function init() {
        if (state.initialized) return;
        state.initialized = true;

        // Cache DOM elements
        cacheElements();

        // Initialize systems
        initCanvas();
        initVisitTracking();
        initInput();
        initEasterEggs();
        applyMood();

        // Fetch initial state from API
        fetchState();

        // Set up periodic tasks
        setInterval(sendHeartbeat, CONFIG.heartbeatInterval);
        setInterval(fetchState, 60000); // Refresh state every minute
        setInterval(applyMood, 60000);  // Check mood every minute

        // Random echoes (if API available)
        setInterval(() => {
            if (state.apiAvailable && Math.random() < 0.1) {
                fetchState().then(() => {
                    // Echo might be included in state response
                });
            }
        }, CONFIG.echoInterval);

        console.log('the void awakens');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
