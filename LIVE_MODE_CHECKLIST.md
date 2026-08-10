# Live Mode Checklist

This checklist guides judges or developers to switch from **fixture mode** (prerecorded responses, zero cost) to **live mode** (real YouCam S2S API, pay per analysis).

## Prerequisites
- YouCam S2S API credentials (client ID, client secret, public key)
- Node.js 20+, pnpm 8+
- SQLite database (local, via better-sqlite3)

## Setup Steps

### 1. Obtain YouCam Credentials
Contact Perfect Corp. or access your hackathon portal to retrieve:
- `YOUCAM_CLIENT_ID` (string)
- `YOUCAM_CLIENT_SECRET` (string)
- `YOUCAM_PUBLIC_KEY` (PEM format, from YouCam console)

### 2. Configure Environment
Create or update `.env.local`:
```bash
# Switch to live mode
YOUCAM_MODE=live

# Add credentials
YOUCAM_CLIENT_ID=your-client-id
YOUCAM_CLIENT_SECRET=your-client-secret
YOUCAM_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
...your key...
-----END PUBLIC KEY-----"

# YouCam S2S API endpoint (production)
YOUCAM_BASE_URL=https://api.youcam.com

# SQLite database
DATABASE_URL="file:./dev.db"
```

### 3. Run Database Migrations (if not done)
```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4. Start the App
```bash
pnpm dev
```

### 5. Test the Flow
1. Navigate to `http://localhost:3000`
2. Click "Capture Your Aura" (the onboarding CTA)
3. **Allow camera access** when prompted
4. Capture a selfie (or upload from device)
5. Watch the SSE progress stream: `uploading` → `analyzing` → `complete`
6. The app displays your SkinPassport (undertone, toneDepth, concerns, topConcern)
7. Navigate to `/shop` to see personalized products with verdicts
8. Click a product to view details and generate VTO (apparel only)
9. Add to cart, view cart, etc.

### 6. Monitor API Costs
Each analysis consumes:
- 1 unit: skin-analysis
- 1 unit: skin-tone-analysis
- 1 unit: cloth VTO (per product tried on)

Check your YouCam dashboard for usage/billing.

## Known Issues to Expect in Either Mode

These are pre-existing, non-blocking issues — not caused by switching modes:

- **Product images are broken (404).** `public/seed/*.jpg` seed images do not exist on
  disk, so every product card/PDP image renders broken in both fixture and live mode.
  All data, verdict, and cart functionality still works — this is cosmetic only.
- **Build emits a middleware deprecation warning.** Next.js 16 recommends the `proxy`
  convention over `middleware.ts`; the app still runs correctly with `middleware.ts`
  (pinned to the Node.js runtime — see below).

## Troubleshooting

### Error: "Cannot resolve environment variable: YOUCAM_PUBLIC_KEY"
- Ensure `.env.local` is in the app root (`d:/downloads/youcam/aura/`)
- Check for typos in variable names (case-sensitive)

### Error: "YouCam auth failed: 401"
- Verify `YOUCAM_CLIENT_ID` and `YOUCAM_CLIENT_SECRET` are correct
- Confirm the `YOUCAM_PUBLIC_KEY` PEM is valid (no stray line breaks)

### Error: "task skin-analysis timed out"
- Network connectivity issue or YouCam API is slow
- Increase the timeout (Task 9's `pollTask` uses a bounded exponential backoff; adjust
  `timeoutMs` if needed)

### Middleware fails to start / references `fs` module errors
- `src/middleware.ts` must keep `export const config = { runtime: 'nodejs' }`. It imports
  Prisma/`better-sqlite3`, which needs Node's `fs` module; Next.js 16 defaults middleware
  to the Edge runtime, which does not support `fs`. This is already set in the repo — if
  you see `fs`-related middleware errors, confirm this config wasn't accidentally removed.

### Analysis runs but shows old verdict badges
- Verdicts are **created-only** (not upserted); old sessions may have cached data
- Clear browser cookies or use a private/incognito window for a fresh session

## Performance Notes
- Fixture mode: instant, no network delays
- Live mode: 5–30 seconds per analysis (YouCam task queue time)
- VTO generation (apparel): additional 5–15 seconds per product
- Verdict computation: <100ms (in-memory)

## Rollback to Fixture Mode
If you want to switch back to fixture mode (testing, demo):
```bash
# In .env.local, change:
YOUCAM_MODE=fixture

# Or remove the live credentials and restart:
pnpm dev
```

No database changes needed; fixture mode re-uses the same schema.

## For Judges

1. **Fast demo (< 2 min)**: Use **fixture mode** (default)
   ```bash
   # Fixture mode needs no credentials — it's the default in .env
   pnpm dev
   # Navigate to http://localhost:3000, click "Capture Your Aura"
   # (Fixture mode returns prerecorded analysis/VTO data — no real camera round-trip
   #  to YouCam is required to see the full flow.)
   ```

2. **Full demo (5–10 min)**: Use **live mode** (real YouCam API)
   - Contact hackathon organizers for test credentials
   - Follow steps 1–6 above
   - Allow real camera capture for authentic VTO results

## Q&A

**Q: Does fixture mode require internet?**
A: No. Fixture mode reads prerecorded fixture data (`fixtures/youcam/`) and never calls the YouCam API.

**Q: Can I mix fixture and live modes?**
A: No. The app uses `YOUCAM_MODE` to globally switch. Changing modes requires a server restart.

**Q: Why does VTO take longer than analysis?**
A: YouCam's cloth VTO task uses background image processing. Analysis is faster.

**Q: Are saved sessions persistent across restarts?**
A: Yes. Session data is stored in SQLite (`file:./dev.db`, per `DATABASE_URL`). Restarting the app preserves all verdicts, carts, and looks.

**Q: Why are product images broken?**
A: The seed data references `public/seed/*.jpg` files that were never added to the repo.
This affects both fixture and live mode identically and does not block any functional
flow (analysis, verdicts, cart, dashboard all work). Add real or placeholder images to
`public/seed/` to fix before a live demo.
