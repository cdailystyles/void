# The Void - Deployment Guide

Complete instructions for deploying The Void to Cloudflare.

---

## Prerequisites

- Cloudflare account (free tier works)
- itlistens.com domain connected to Cloudflare (you have this)
- Git installed locally
- Node.js installed (for Wrangler CLI, optional but recommended)

---

## Overview

You'll deploy two things:
1. **Static Site** → Cloudflare Pages (serves the frontend)
2. **Worker API** → Cloudflare Workers (handles live features)

---

## Part 1: Create KV Namespace

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. In the left sidebar, click **Workers & Pages**
4. Click **KV** in the submenu
5. Click **Create a namespace**
6. Name it: `VOID_KV`
7. Click **Add**
8. **Copy the Namespace ID** - you'll need this later

---

## Part 2: Deploy the Worker

### Option A: Using Wrangler CLI (Recommended)

1. Install Wrangler globally:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Navigate to the worker folder:
   ```bash
   cd void-rewrite/worker
   ```

4. Edit `wrangler.toml` and replace `YOUR_KV_NAMESPACE_ID_HERE` with your actual KV namespace ID from Part 1

5. Deploy:
   ```bash
   wrangler deploy
   ```

### Option B: Using Cloudflare Dashboard

1. Go to **Workers & Pages** in Cloudflare Dashboard
2. Click **Create application** → **Create Worker**
3. Name it: `void-api`
4. Click **Deploy**
5. Click **Edit code**
6. Delete the default code and paste the entire contents of `worker/index.js`
7. Click **Deploy**
8. Go to **Settings** → **Variables**
9. Scroll to **KV Namespace Bindings**
10. Click **Add binding**
    - Variable name: `VOID_KV`
    - KV namespace: Select `VOID_KV` from dropdown
11. Click **Save and deploy**

---

## Part 3: Set Up Worker Route

1. Go to **Workers & Pages** → **void-api** (your worker)
2. Click **Settings** → **Triggers**
3. Under **Routes**, click **Add route**
4. Enter:
   - Route: `itlistens.com/api/*`
   - Zone: `itlistens.com`
5. Click **Add route**

Now your API will be accessible at `https://itlistens.com/api/*`

---

## Part 4: Push Code to GitHub

1. Make sure you're in the void-rewrite folder
2. Stage all changes:
   ```bash
   git add .
   ```
3. Commit:
   ```bash
   git commit -m "Complete rewrite with mystery features"
   ```
4. Push:
   ```bash
   git push origin main
   ```

---

## Part 5: Configure Cloudflare Pages

If you already have Pages connected to your repo:

1. Go to **Workers & Pages**
2. Click on your existing Pages project
3. Go to **Settings** → **Builds & deployments**
4. Update **Build output directory** to: `site`
5. Click **Save**
6. Go to **Deployments** and trigger a new deployment

If setting up Pages for the first time:

1. Go to **Workers & Pages**
2. Click **Create application** → **Pages**
3. Click **Connect to Git**
4. Select your GitHub account and the `void` repository
5. Configure build settings:
   - Build command: (leave empty)
   - Build output directory: `site`
6. Click **Save and Deploy**

---

## Part 6: Verify Everything Works

1. Visit https://itlistens.com - you should see the new void interface
2. Open browser console (F12) - you should see "the void awakens"
3. Type a thought and press Enter - it should float away and you get a response
4. Check the counter at the bottom - it should increment

### Test the API directly:

```bash
# Get void state
curl https://itlistens.com/api/state

# Submit a thought
curl -X POST https://itlistens.com/api/thought \
  -H "Content-Type: application/json" \
  -d '{"text": "test thought"}'
```

---

## Troubleshooting

### "API unavailable" in console
- Check that the Worker is deployed correctly
- Verify the route is set up: `itlistens.com/api/*`
- Check Worker logs in Cloudflare dashboard

### KV errors in Worker
- Make sure the KV binding name is exactly `VOID_KV`
- Verify the namespace ID in wrangler.toml matches your actual namespace

### CSS/JS not loading
- Make sure the build output directory is set to `site`
- Check that `styles.css` and `void.js` are in the `site` folder

### CORS errors
- The Worker includes CORS headers, but if issues persist, check browser network tab for details

---

## Features Included

### Client-Side (No API needed)
- Particle animation system
- Time-based moods (midnight, 3AM witching hour, dawn, dusk)
- Visit tracking and progression
- Easter eggs:
  - Konami code (↑↑↓↓←→←→BA)
  - Special phrases ("who are you", "what are you", "42", etc.)
  - Triple empty submit

### API-Powered
- Global thought counter (shared across all visitors)
- Anonymous echoes (others' thoughts)
- Presence indicator ("X souls are here now")
- Void mood based on daily activity

---

## Customization

### Add more responses
Edit `void.js` and add to the `RESPONSES` object.

### Add more Easter eggs
Edit `void.js` and add to `SPECIAL_RESPONSES` object.

### Change particle behavior
Edit the `CONFIG` object at the top of `void.js`.

### Modify blocked words for echoes
Edit the `BLOCKED_WORDS` array in `worker/index.js`.

---

## Cost

Everything runs on Cloudflare's free tier:
- Pages: Unlimited static hosting
- Workers: 100,000 requests/day
- KV: 100,000 reads/day, 1,000 writes/day

For a personal project, you'll never hit these limits.
