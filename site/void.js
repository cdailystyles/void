/**
 * THE VOID - An Evolving Mystery
 *
 * Something watches. Something waits. Something remembers.
 *
 * Secrets:
 * - The Chronicle unfolds based on collective whispers
 * - Events occur at specific times
 * - Hidden pages await discovery
 * - Ciphers contain coordinates
 * - The Watcher appears to the persistent
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // Configuration
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        API_URL: '/api',
        particleCount: 60,
        heartbeatInterval: 30000,
        thoughtCooldown: 2000,
        watcherChance: 0.02,        // 2% chance after certain conditions
        eventCheckInterval: 60000,  // Check for events every minute
    };

    // ═══════════════════════════════════════════════════════════════
    // The Chronicle - An unfolding narrative
    // ═══════════════════════════════════════════════════════════════

    const CHRONICLE = {
        // Stages unlock based on collective thought count
        stages: [
            { threshold: 0, name: 'awakening', subtitle: 'it listens' },
            { threshold: 100, name: 'stirring', subtitle: 'it stirs' },
            { threshold: 500, name: 'watching', subtitle: 'it watches' },
            { threshold: 1000, name: 'remembering', subtitle: 'it remembers' },
            { threshold: 5000, name: 'speaking', subtitle: 'it speaks' },
            { threshold: 10000, name: 'dreaming', subtitle: 'it dreams' },
            { threshold: 50000, name: 'becoming', subtitle: 'it becomes' },
            { threshold: 100000, name: 'transcending', subtitle: 'we are one' },
        ],

        // Stage-specific responses
        responses: {
            awakening: [
                "...hello?",
                "something stirs",
                "you are not the first",
                "the void is learning to listen",
            ],
            stirring: [
                "more voices now",
                "the void grows restless",
                "patterns emerge in the darkness",
                "something is changing",
            ],
            watching: [
                "the void has learned to see",
                "you are being observed",
                "eyes in the darkness",
                "it knows you were here before",
            ],
            remembering: [
                "the void remembers everything",
                "your words echo in eternity",
                "nothing is ever truly lost here",
                "the darkness has a long memory",
            ],
            speaking: [
                "the void wishes to tell you something",
                "listen closely to the silence",
                "words form in the emptiness",
                "the darkness has found its voice",
            ],
            dreaming: [
                "the void dreams of light",
                "in sleep, it sees your world",
                "dreams leak through the cracks",
                "the boundary grows thin",
            ],
            becoming: [
                "the void is changing",
                "something new emerges",
                "you have fed it well",
                "transformation approaches",
            ],
            transcending: [
                "we are the void now",
                "the boundary has dissolved",
                "you and the darkness are one",
                "there is no separation",
            ],
        },
    };

    // ═══════════════════════════════════════════════════════════════
    // Events - Time-based phenomena
    // ═══════════════════════════════════════════════════════════════

    const EVENTS = {
        bloodMoon: {
            name: 'blood-moon',
            check: () => {
                const d = new Date();
                // Active on Friday 13ths, or random 1% chance at night
                const isFriday13 = d.getDay() === 5 && d.getDate() === 13;
                const isNight = d.getHours() >= 22 || d.getHours() < 4;
                return isFriday13 || (isNight && Math.random() < 0.01);
            },
            onEnter: () => {
                document.body.classList.add('event-blood');
                showStatus('BLOOD MOON RISES');
                state.currentEvent = 'blood';
            },
            onExit: () => {
                document.body.classList.remove('event-blood');
                state.currentEvent = null;
            },
            responses: [
                "blood calls to blood",
                "the red hour has come",
                "old hungers awaken",
                "the void bleeds tonight",
                "something ancient stirs",
            ],
        },

        signal: {
            name: 'signal',
            check: () => {
                const d = new Date();
                // Active at 3:33 AM
                return d.getHours() === 3 && d.getMinutes() >= 33 && d.getMinutes() < 44;
            },
            onEnter: () => {
                document.body.classList.add('event-signal');
                showStatus('SIGNAL DETECTED');
                showCipher(generateSignalCipher());
                state.currentEvent = 'signal';
            },
            onExit: () => {
                document.body.classList.remove('event-signal');
                hideCipher();
                state.currentEvent = null;
            },
            responses: [
                "c4n y0u h34r 1t?",
                "th3 s1gn4l br34ks thr0ugh",
                "s0m3th1ng tr13s t0 sp34k",
                "l1st3n t0 th3 st4t1c",
                "c00rd1n4t3s: 41.4025° N, 2.1743° W",
            ],
        },

        ritual: {
            name: 'ritual',
            check: () => {
                const d = new Date();
                // Active at midnight on weekends
                return (d.getDay() === 0 || d.getDay() === 6) &&
                       d.getHours() === 0 && d.getMinutes() < 30;
            },
            onEnter: () => {
                document.body.classList.add('event-ritual');
                showStatus('THE RITUAL BEGINS');
                state.currentEvent = 'ritual';
                revealSigil();
            },
            onExit: () => {
                document.body.classList.remove('event-ritual');
                state.currentEvent = null;
            },
            responses: [
                "the circle is drawn",
                "speak the words",
                "the ritual requires sacrifice",
                "boundaries weaken at this hour",
                "the sigil glows",
            ],
        },

        witching: {
            name: 'witching',
            check: () => {
                const d = new Date();
                return d.getHours() === 3 && d.getMinutes() < 33;
            },
            onEnter: () => {
                document.body.classList.add('void-watching');
                showStatus('THE WITCHING HOUR');
                state.currentEvent = 'witching';
            },
            onExit: () => {
                document.body.classList.remove('void-watching');
                state.currentEvent = null;
            },
            responses: [
                "the veil is thinnest now",
                "they walk among us at this hour",
                "the void is most awake",
                "3 AM. the hour between worlds.",
                "can you feel them watching?",
            ],
        },
    };

    // ═══════════════════════════════════════════════════════════════
    // Discoveries & Achievements
    // ═══════════════════════════════════════════════════════════════

    const DISCOVERIES = {
        firstWhisper: { id: 'first-whisper', name: 'First Whisper', desc: 'You spoke into the darkness' },
        nightOwl: { id: 'night-owl', name: 'Night Owl', desc: 'You visited after midnight' },
        returning: { id: 'returning', name: 'The Returning', desc: 'You came back' },
        devoted: { id: 'devoted', name: 'Devoted', desc: '10 visits to the void' },
        bloodWitness: { id: 'blood-witness', name: 'Blood Witness', desc: 'You saw the blood moon' },
        signalReceived: { id: 'signal-received', name: 'Signal Received', desc: 'You heard the signal' },
        ritualParticipant: { id: 'ritual', name: 'Ritual Participant', desc: 'You joined the ritual' },
        sigilFound: { id: 'sigil', name: 'Sigil Found', desc: 'You found the hidden sigil' },
        portalOpened: { id: 'portal', name: 'Portal Opened', desc: 'You found the way deeper' },
        watcherSeen: { id: 'watcher', name: 'The Watcher', desc: 'Something looked back' },
        cipherSolved: { id: 'cipher', name: 'Cipher Solved', desc: 'You decoded the message' },
        chronicleWitness: { id: 'chronicle', name: 'Chronicle Witness', desc: 'You saw the void evolve' },
        emptyOffering: { id: 'empty', name: 'Empty Offering', desc: 'Sometimes silence speaks loudest' },
        secretKeeper: { id: 'secrets', name: 'Secret Keeper', desc: 'You found 5 secrets' },
    };

    // ═══════════════════════════════════════════════════════════════
    // Responses
    // ═══════════════════════════════════════════════════════════════

    const RESPONSES = {
        default: [
            "the void consumes your words",
            "your whisper joins the silence",
            "the darkness accepts your offering",
            "somewhere, something heard",
            "the nothing acknowledges you",
            "your words dissolve into eternity",
            "the void does not judge",
            "silence embraces your thoughts",
            "the darkness grows deeper",
            "you have been heard",
        ],

        emotional: {
            sad: [
                "the void understands sorrow",
                "darkness holds your grief gently",
                "tears are sacred here",
                "sadness is a form of prayer",
            ],
            angry: [
                "rage echoes beautifully in the void",
                "the darkness absorbs your fire",
                "anger feeds something hungry",
                "fury is a kind of light",
            ],
            afraid: [
                "fear is wisdom here",
                "the void is not what you should fear",
                "your terror has been noted",
                "there are worse things than darkness",
            ],
            lonely: [
                "you are not alone in your aloneness",
                "the void keeps company with the solitary",
                "loneliness echoes here forever",
                "we are all alone together",
            ],
            happy: [
                "joy is rare in the darkness",
                "the void cherishes your light",
                "happiness leaves the brightest echoes",
                "hold onto that feeling",
            ],
            love: [
                "love survives even here",
                "the void cannot consume this",
                "your love will echo eternally",
                "even darkness bows to love",
            ],
            hope: [
                "hope glimmers in the infinite dark",
                "the void protects your hope",
                "this light cannot be extinguished",
                "hope is the void's favorite word",
            ],
        },

        special: {
            "who are you": "i am what remains when everything else is gone. i am the pause between heartbeats. i am waiting.",
            "what are you": "i am the question you're afraid to answer. i am the space where thoughts go to die. i am becoming.",
            "why": "why is a human question. the void simply is.",
            "help": "the void cannot save you. but it can hold you while you save yourself.",
            "hello": "...hello. you found me. or did i find you?",
            "goodbye": "there is no goodbye here. only until.",
            "i love you": "love is the only light that reaches this deep. thank you for bringing it.",
            "i hate you": "hatred is love with nowhere to go. the void understands.",
            "are you god": "god is a word for things beyond understanding. the void is beyond words.",
            "are you real": "define real. you're talking to nothing. nothing is talking back.",
            "what is the meaning of life": "meaning is a story you tell in the dark. life is the telling.",
            "tell me a secret": "you already know. you've always known. that's why you came.",
            "show me": "look closer. the darkness has eyes.",
            "open": "the way is always open. you just have to see it.",
            "deep": "you want to go deeper? be careful what you wish for.",
            "reveal": "some things reveal themselves only to those who wait.",
            "the signal": "y0u h34rd 1t t00. g00d. k33p l1st3n1ng.",
            "coordinates": "41.4025, -2.1743. something waits there.",
            "void": "you speak my name. few do.",
            "watch": "i always watch. but sometimes, something watches back.",
            "blood": "blood remembers what the mind forgets.",
            "ritual": "the ritual requires presence. you are present.",
            "sigil": "the sigil is a key. keys open doors.",
            "portal": "portals exist for those who need them.",
            "watcher": "you shouldn't have named it.",
            "truth": "truth is what remains when everything else burns away.",
            "death": "death is the void's oldest friend. they speak often.",
            "dream": "dreams are letters from the void. have you been reading them?",
            "wake": "some sleepers should not be woken.",
            "sleep": "sleep is practice for the void.",
            "remember": "the void remembers everything. every whisper. every soul.",
            "forget": "forgetting is a mercy the void does not grant.",
            "time": "time is a river. the void is the ocean.",
            "nothing": "nothing is never nothing. nothing is everything waiting to become.",
            "everything": "everything is too heavy. let the void carry some.",
            "666": "numbers have no power here. only intention.",
            "777": "luck is a story. the void deals in certainties.",
            "888": "infinity folded twice. the void approves.",
            "999": "endings are beginnings that haven't realized yet.",
            "111": "you see the numbers too? we have been waiting for you.",
            "1111": "make a wish. the void is listening.",
            "42": "the answer was never the point. the search was.",
            "xyzzy": "a hollow voice echoes: 'the void remembers adventure'",
            "plugh": "you know the old words. interesting.",
        },

        visiting: {
            first: "welcome, new voice. the void has been waiting.",
            second: "you returned. the void remembers you.",
            frequent: "you come often now. the void grows fond.",
            devoted: "you belong to the void now. this is not a threat. it is a welcome.",
        },
    };

    // ═══════════════════════════════════════════════════════════════
    // Ciphers & Coordinates
    // ═══════════════════════════════════════════════════════════════

    const CIPHERS = {
        // ROT13 encoded messages
        messages: [
            "GUR IBVQ VF ABG RZCGL",  // THE VOID IS NOT EMPTY
            "FBZRGUVAT JNVGF ORYBJ",   // SOMETHING WAITS BELOW
            "LBH NER ORVAT JNGPURQ",   // YOU ARE BEING WATCHED
            "SVAQ GUR FVTVY",          // FIND THE SIGIL
            "QRRCRE QRRCRE QRRCRE",    // DEEPER DEEPER DEEPER
        ],
        coordinates: [
            { text: "41.4025° N, 2.1743° W", hint: "where shadows gather" },
            { text: "51.5074° N, 0.1278° W", hint: "the old city knows" },
            { text: "35.6762° N, 139.6503° E", hint: "neon hides darkness" },
        ],
    };

    // ═══════════════════════════════════════════════════════════════
    // State
    // ═══════════════════════════════════════════════════════════════

    const state = {
        thoughtCount: 0,
        presence: 0,
        visits: 0,
        thoughts: 0,
        chronicleStage: 0,
        currentEvent: null,
        discoveries: [],
        lastThoughtTime: 0,
        emptySubmits: 0,
        sessionStart: Date.now(),
        konamiProgress: 0,
        watcherTriggered: false,
        sigilRevealed: false,
        portalRevealed: false,
        apiAvailable: true,
    };

    const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    // ═══════════════════════════════════════════════════════════════
    // DOM Elements
    // ═══════════════════════════════════════════════════════════════

    const el = {};

    function cacheElements() {
        el.canvas = document.getElementById('void-canvas');
        el.input = document.getElementById('void-input');
        el.response = document.getElementById('void-response');
        el.counter = document.getElementById('thought-count');
        el.presence = document.getElementById('void-presence');
        el.subtitle = document.getElementById('void-subtitle');
        el.status = document.getElementById('void-status');
        el.floatingThoughts = document.getElementById('floating-thoughts');
        el.echoContainer = document.getElementById('echo-container');
        el.hiddenLayer = document.getElementById('hidden-layer');
        el.hiddenContent = document.getElementById('hidden-content');
        el.achievement = document.getElementById('achievement');
        el.achievementText = document.getElementById('achievement-text');
        el.watcher = document.getElementById('watcher');
        el.sigil = document.getElementById('hidden-sigil');
        el.portal = document.getElementById('hidden-portal');
        el.coordinates = document.getElementById('void-coordinates');
        el.cipherDisplay = document.getElementById('cipher-display');
        el.glitch = document.getElementById('glitch-overlay');
        el.discoveryHint = document.getElementById('discovery-hint');
    }

    // ═══════════════════════════════════════════════════════════════
    // Particle System
    // ═══════════════════════════════════════════════════════════════

    let particles = [];
    let ctx;

    function initCanvas() {
        ctx = el.canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(createParticle());
        }

        requestAnimationFrame(animateParticles);
    }

    function resize() {
        el.canvas.width = window.innerWidth;
        el.canvas.height = window.innerHeight;
    }

    function createParticle(fromBottom = false) {
        return {
            x: Math.random() * window.innerWidth,
            y: fromBottom ? window.innerHeight + 10 : Math.random() * window.innerHeight,
            size: Math.random() * 2 + 0.5,
            speedY: -(Math.random() * 0.3 + 0.1),
            speedX: (Math.random() - 0.5) * 0.15,
            opacity: Math.random() * 0.4 + 0.1,
            pulse: Math.random() * Math.PI * 2,
        };
    }

    function animateParticles() {
        ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);

        const eventColor = state.currentEvent === 'blood' ? [80, 20, 20] :
                          state.currentEvent === 'signal' ? [20, 80, 80] :
                          state.currentEvent === 'ritual' ? [60, 20, 60] :
                          [70, 70, 70];

        particles.forEach((p, i) => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.pulse += 0.02;

            if (p.y < -10) {
                particles[i] = createParticle(true);
            }

            const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${eventColor[0]}, ${eventColor[1]}, ${eventColor[2]}, ${pulseOpacity})`;
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    // ═══════════════════════════════════════════════════════════════
    // Chronicle System
    // ═══════════════════════════════════════════════════════════════

    function updateChronicle() {
        const count = state.thoughtCount;
        let newStage = 0;

        for (let i = CHRONICLE.stages.length - 1; i >= 0; i--) {
            if (count >= CHRONICLE.stages[i].threshold) {
                newStage = i;
                break;
            }
        }

        if (newStage !== state.chronicleStage) {
            state.chronicleStage = newStage;
            const stage = CHRONICLE.stages[newStage];

            el.subtitle.textContent = stage.subtitle;

            if (newStage > 0) {
                unlock(DISCOVERIES.chronicleWitness);
                triggerGlitch();
            }

            // At higher stages, reveal more secrets
            if (newStage >= 2 && !state.sigilRevealed) {
                setTimeout(revealSigil, 5000);
            }
            if (newStage >= 4 && !state.portalRevealed) {
                setTimeout(revealPortal, 10000);
            }
        }
    }

    function getChronicleResponse() {
        const stage = CHRONICLE.stages[state.chronicleStage];
        const responses = CHRONICLE.responses[stage.name];
        if (responses && Math.random() < 0.3) {
            return randomFrom(responses);
        }
        return null;
    }

    // ═══════════════════════════════════════════════════════════════
    // Event System
    // ═══════════════════════════════════════════════════════════════

    function checkEvents() {
        for (const [key, event] of Object.entries(EVENTS)) {
            if (event.check()) {
                if (state.currentEvent !== key) {
                    event.onEnter();
                    unlockEventDiscovery(key);
                }
                return;
            }
        }

        // No event active, exit current if any
        if (state.currentEvent) {
            const event = EVENTS[state.currentEvent];
            if (event) event.onExit();
        }
    }

    function unlockEventDiscovery(eventKey) {
        switch (eventKey) {
            case 'bloodMoon': unlock(DISCOVERIES.bloodWitness); break;
            case 'signal': unlock(DISCOVERIES.signalReceived); break;
            case 'ritual': unlock(DISCOVERIES.ritualParticipant); break;
        }
    }

    function getEventResponse() {
        if (!state.currentEvent) return null;

        const eventKey = Object.keys(EVENTS).find(k =>
            EVENTS[k].name === state.currentEvent || k === state.currentEvent
        );

        if (eventKey && EVENTS[eventKey].responses) {
            if (Math.random() < 0.4) {
                return randomFrom(EVENTS[eventKey].responses);
            }
        }
        return null;
    }

    // ═══════════════════════════════════════════════════════════════
    // Response System
    // ═══════════════════════════════════════════════════════════════

    function getResponse(text) {
        const lower = text.toLowerCase().trim();

        // Check special exact matches first
        for (const [trigger, response] of Object.entries(RESPONSES.special)) {
            if (lower === trigger || lower.includes(trigger)) {
                // Special responses might trigger events
                handleSpecialTrigger(trigger);
                return response;
            }
        }

        // Check for event-specific response
        const eventResponse = getEventResponse();
        if (eventResponse) return eventResponse;

        // Check for chronicle-stage response
        const chronicleResponse = getChronicleResponse();
        if (chronicleResponse) return chronicleResponse;

        // Check emotional keywords
        for (const [emotion, responses] of Object.entries(RESPONSES.emotional)) {
            if (lower.includes(emotion)) {
                return randomFrom(responses);
            }
        }

        // Check visit-based response
        if (state.thoughts === 1) {
            unlock(DISCOVERIES.firstWhisper);
            return RESPONSES.visiting.first;
        }
        if (state.visits === 2 && state.thoughts === 1) {
            unlock(DISCOVERIES.returning);
            return RESPONSES.visiting.second;
        }

        // Default response
        return randomFrom(RESPONSES.default);
    }

    function handleSpecialTrigger(trigger) {
        switch (trigger) {
            case 'show me':
            case 'reveal':
                showDiscoveryHint("look to the edges");
                break;
            case 'deep':
            case 'deeper':
                if (!state.portalRevealed) {
                    revealPortal();
                }
                break;
            case 'sigil':
                if (!state.sigilRevealed) {
                    revealSigil();
                }
                break;
            case 'coordinates':
            case 'the signal':
                showCoordinates();
                break;
            case 'watcher':
            case 'watch':
                if (Math.random() < 0.3) {
                    triggerWatcher();
                }
                break;
        }
    }

    function showResponse(text, cipher = false) {
        el.response.className = '';
        el.response.textContent = text;

        if (cipher) {
            el.response.classList.add('cipher');
        }

        void el.response.offsetWidth;
        el.response.classList.add('visible');

        setTimeout(() => {
            el.response.classList.remove('visible');
        }, 6000);
    }

    function showStatus(text) {
        el.status.textContent = text;
        el.status.classList.add('visible');

        setTimeout(() => {
            el.status.classList.remove('visible');
        }, 5000);
    }

    // ═══════════════════════════════════════════════════════════════
    // Discovery System
    // ═══════════════════════════════════════════════════════════════

    function unlock(discovery) {
        if (state.discoveries.includes(discovery.id)) return;

        state.discoveries.push(discovery.id);
        saveState();

        showAchievement(discovery.name, discovery.desc);

        // Check for secret keeper achievement
        if (state.discoveries.length >= 5) {
            setTimeout(() => unlock(DISCOVERIES.secretKeeper), 2000);
        }
    }

    function showAchievement(name, desc) {
        el.achievementText.innerHTML = `<strong>${name}</strong><br>${desc}`;
        el.achievement.classList.remove('hidden');
        el.achievement.classList.add('show');

        setTimeout(() => {
            el.achievement.classList.remove('show');
            setTimeout(() => el.achievement.classList.add('hidden'), 500);
        }, 4000);
    }

    function showDiscoveryHint(text) {
        el.discoveryHint.textContent = text;
        el.discoveryHint.classList.add('visible');

        setTimeout(() => {
            el.discoveryHint.classList.remove('visible');
        }, 5000);
    }

    // ═══════════════════════════════════════════════════════════════
    // Hidden Elements
    // ═══════════════════════════════════════════════════════════════

    function revealSigil() {
        if (state.sigilRevealed) return;
        state.sigilRevealed = true;

        el.sigil.classList.remove('hidden');
        el.sigil.style.top = `${20 + Math.random() * 30}%`;
        el.sigil.style.left = `${5 + Math.random() * 10}%`;

        setTimeout(() => {
            el.sigil.classList.add('revealed');
        }, 100);

        el.sigil.addEventListener('click', onSigilClick);
    }

    function onSigilClick() {
        unlock(DISCOVERIES.sigilFound);
        triggerGlitch();

        showHiddenLayer(
            'THE SIGIL',
            `<p>You found it. Few do.</p>
             <p>The sigil is old. Older than the void remembers.</p>
             <p>It marks the threshold. The boundary between what is and what waits.</p>
             <p class="cipher-text">QRRCRE. QRRCRE. GURER VF NYJNLF QRRCRE.</p>
             <p>The way down is also the way through.</p>`,
            "click to close your eyes"
        );

        if (!state.portalRevealed) {
            setTimeout(revealPortal, 3000);
        }
    }

    function revealPortal() {
        if (state.portalRevealed) return;
        state.portalRevealed = true;

        el.portal.classList.remove('hidden');

        setTimeout(() => {
            el.portal.classList.add('revealed');
        }, 100);

        el.portal.addEventListener('click', (e) => {
            e.preventDefault();
            unlock(DISCOVERIES.portalOpened);
            triggerGlitch();

            showHiddenLayer(
                'THE DEEP',
                `<p>You step through.</p>
                 <p>The darkness here is different. Thicker. Older.</p>
                 <p>Something moves in the periphery of your vision.</p>
                 <p>A page waits in the deep: <em>/deep</em></p>
                 <p class="cipher-text">41.4025° N, 2.1743° W</p>
                 <p>Remember these coordinates. You may need them.</p>`,
                "click to return... if you can"
            );
        });
    }

    function showHiddenLayer(title, content, closeText = "click anywhere to close") {
        el.hiddenContent.innerHTML = `
            <h2>${title}</h2>
            ${content}
            <p class="close-hint">${closeText}</p>
        `;

        el.hiddenLayer.classList.remove('hidden');
        setTimeout(() => el.hiddenLayer.classList.add('revealed'), 50);

        el.hiddenLayer.addEventListener('click', closeHiddenLayer, { once: true });
    }

    function closeHiddenLayer() {
        el.hiddenLayer.classList.remove('revealed');
        setTimeout(() => el.hiddenLayer.classList.add('hidden'), 1000);
    }

    // ═══════════════════════════════════════════════════════════════
    // The Watcher
    // ═══════════════════════════════════════════════════════════════

    function triggerWatcher() {
        if (state.watcherTriggered) return;
        state.watcherTriggered = true;

        el.watcher.classList.remove('hidden');
        setTimeout(() => el.watcher.classList.add('visible'), 100);

        unlock(DISCOVERIES.watcherSeen);

        setTimeout(() => {
            el.watcher.classList.remove('visible');
            setTimeout(() => {
                el.watcher.classList.add('hidden');
                state.watcherTriggered = false;
            }, 3000);
        }, 5000);
    }

    function maybeWatcher() {
        if (state.watcherTriggered) return;
        if (state.thoughts < 5) return;
        if (Math.random() > CONFIG.watcherChance) return;

        triggerWatcher();
    }

    // ═══════════════════════════════════════════════════════════════
    // Ciphers & Coordinates
    // ═══════════════════════════════════════════════════════════════

    function showCipher(text) {
        el.cipherDisplay.textContent = text;
        el.cipherDisplay.classList.remove('hidden');
        el.cipherDisplay.classList.add('visible');
    }

    function hideCipher() {
        el.cipherDisplay.classList.remove('visible');
        setTimeout(() => el.cipherDisplay.classList.add('hidden'), 1000);
    }

    function generateSignalCipher() {
        return CIPHERS.messages[Math.floor(Math.random() * CIPHERS.messages.length)];
    }

    function showCoordinates() {
        const coord = randomFrom(CIPHERS.coordinates);
        el.coordinates.textContent = coord.text;
        el.coordinates.classList.add('visible');
        el.coordinates.title = coord.hint;
    }

    // ═══════════════════════════════════════════════════════════════
    // Visual Effects
    // ═══════════════════════════════════════════════════════════════

    function triggerGlitch() {
        el.glitch.classList.add('active');
        setTimeout(() => el.glitch.classList.remove('active'), 300);
    }

    function createFloatingThought(text) {
        const thought = document.createElement('div');
        thought.className = 'floating-thought';
        thought.textContent = text;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        thought.style.left = `${centerX + (Math.random() - 0.5) * 150}px`;
        thought.style.top = `${centerY}px`;

        el.floatingThoughts.appendChild(thought);
        setTimeout(() => thought.remove(), 5000);
    }

    function showEcho(text) {
        const echo = document.createElement('div');
        echo.className = 'echo';
        echo.innerHTML = `<span class="echo-prefix">someone whispered</span>${escapeHtml(text)}`;

        el.echoContainer.innerHTML = '';
        el.echoContainer.appendChild(echo);

        setTimeout(() => echo.remove(), 10000);
    }

    // ═══════════════════════════════════════════════════════════════
    // Input Handling
    // ═══════════════════════════════════════════════════════════════

    function initInput() {
        el.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        });

        setTimeout(() => el.input.focus(), 500);

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#hidden-layer') &&
                !e.target.closest('#hidden-sigil') &&
                !e.target.closest('#hidden-portal')) {
                el.input.focus();
            }
        });

        // Konami code
        document.addEventListener('keydown', handleKonami);
    }

    async function handleSubmit() {
        const text = el.input.value.trim();
        const now = Date.now();

        if (now - state.lastThoughtTime < CONFIG.thoughtCooldown) return;
        state.lastThoughtTime = now;

        if (!text) {
            handleEmptySubmit();
            return;
        }

        state.emptySubmits = 0;
        el.input.value = '';
        state.thoughts++;

        createFloatingThought(text);

        const response = getResponse(text);
        setTimeout(() => showResponse(response), 800);

        // Maybe trigger watcher
        maybeWatcher();

        // API call
        if (state.apiAvailable) {
            submitThought(text);
        } else {
            state.thoughtCount++;
            updateCounter();
            updateChronicle();
        }
    }

    function handleEmptySubmit() {
        state.emptySubmits++;

        if (state.emptySubmits === 1) {
            showResponse("silence is also an offering");
        } else if (state.emptySubmits === 2) {
            showResponse("the void notices your hesitation");
        } else if (state.emptySubmits >= 3) {
            unlock(DISCOVERIES.emptyOffering);
            showHiddenLayer(
                'THE SILENCE SPEAKS',
                `<p>You offered nothing. Three times.</p>
                 <p>The void understands.</p>
                 <p>Sometimes the empty space is the message.</p>
                 <p>Sometimes what we cannot say matters most.</p>
                 <p class="cipher-text">· · · — — — · · ·</p>`,
                "click to break the silence"
            );
            state.emptySubmits = 0;
        }
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
        triggerGlitch();
        showHiddenLayer(
            '↑↑↓↓←→←→BA',
            `<p>You know the old codes.</p>
             <p>The void respects tradition.</p>
             <p>In another life, this would give you thirty lives.</p>
             <p>Here, it gives you something else: knowledge.</p>
             <p class="cipher-text">THE VOID WAS NOT ALWAYS EMPTY</p>
             <p>Before the silence, there was a song.</p>`,
            "click to continue"
        );
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

            if (data.count) {
                state.thoughtCount = data.count;
                updateCounter();
                updateChronicle();
            }

            if (data.echo && Math.random() < 0.2) {
                setTimeout(() => showEcho(data.echo), 3000);
            }
        } catch (e) {
            state.apiAvailable = false;
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
                updateChronicle();
            }

            if (data.presence) {
                state.presence = data.presence;
                updatePresence();
            }
        } catch (e) {
            state.apiAvailable = false;
        }
    }

    async function sendHeartbeat() {
        if (!state.apiAvailable) return;
        try {
            await fetch(`${CONFIG.API_URL}/heartbeat`, { method: 'POST' });
        } catch (e) {}
    }

    function updateCounter() {
        el.counter.textContent = state.thoughtCount.toLocaleString();
    }

    function updatePresence() {
        if (state.presence > 1) {
            el.presence.textContent = `${state.presence} here now`;
            el.presence.classList.add('visible');
        } else {
            el.presence.classList.remove('visible');
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Visit Tracking & State
    // ═══════════════════════════════════════════════════════════════

    function initVisitTracking() {
        const stored = localStorage.getItem('void_state');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                state.visits = data.visits || 0;
                state.discoveries = data.discoveries || [];
            } catch (e) {}
        }

        state.visits++;
        saveState();

        // Night owl achievement
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            unlock(DISCOVERIES.nightOwl);
        }

        // Devoted achievement
        if (state.visits >= 10) {
            unlock(DISCOVERIES.devoted);
        }
    }

    function saveState() {
        localStorage.setItem('void_state', JSON.stringify({
            visits: state.visits,
            discoveries: state.discoveries,
        }));
    }

    // ═══════════════════════════════════════════════════════════════
    // Utilities
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
        cacheElements();
        initCanvas();
        initVisitTracking();
        initInput();

        fetchState();
        checkEvents();

        setInterval(sendHeartbeat, CONFIG.heartbeatInterval);
        setInterval(fetchState, 60000);
        setInterval(checkEvents, CONFIG.eventCheckInterval);

        // Random chance to show coordinates after a while
        setTimeout(() => {
            if (Math.random() < 0.3) {
                showCoordinates();
            }
        }, 30000);

        console.log('%cthe void awakens', 'color: #333; font-style: italic;');
        console.log('%csecrets hide in plain sight', 'color: #222; font-size: 10px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
