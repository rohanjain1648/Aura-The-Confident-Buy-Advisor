# Live Mode Checklist

Switch from **fixture mode** (prerecorded responses, zero cost) to **live mode** (the real YouCam v2.0 API, which spends API units).

## Setup

### 1. Get an API key
Open the API Keys page of the console you signed up on:
- Global: https://yce.perfectcorp.com/api-console/en/api-keys/
- India region: https://yce.makeupar.com/api-console/en/api-keys/

Hackathon participants can redeem free units under Account > Redeem Code.

### 2. Configure the environment
In `.env`:
```bash
YOUCAM_MODE=live
YOUCAM_API_KEY=your-api-key

# Must match the portal the key came from
YOUCAM_BASE_URL=https://yce-api-01.perfectcorp.com   # global
# YOUCAM_BASE_URL=https://yce-api-01.makeupar.com    # India region

DATABASE_URL=file:./dev.db
```

### 3. Prepare the database
```bash
pnpm prisma migrate deploy
pnpm prisma db seed
```

### 4. Check the API with a real photo
```bash
pnpm youcam:smoke path/to/selfie.jpg
```
This uploads the photo, runs skin tone and skin analysis, prints the raw responses and the resulting Skin Passport. The face must span over 60% of the image width. Add a garment (a public image URL or a path inside `public/`) to test try-on too.

### 5. Run the app
```bash
pnpm dev
```
1. Open `http://localhost:3000/onboarding`.
2. Allow camera access and fill the oval with your face, or upload a photo.
3. Your Skin Passport appears when analysis finishes.
4. Go to `/shop` for personalized verdicts.
5. Open an apparel product and generate the try-on.

## API unit costs

| Call | Units |
|---|---|
| Skin analysis (8 SD concerns) | 12 |
| Skin tone analysis | 20 |
| Clothes try-on (`cloth-v4`) | 2 |

Units are spent only on success. A repeat try-on of the same product within 110 minutes reuses the saved result.

The API allows 250 requests per 300 seconds.

## Photo requirements

- **Skin analysis:** short side at least 480 px, under 10 MB, face wider than 60% of the image. The capture screen crops to meet this when the face fills the oval.
- **Clothes try-on:** at least 512x384 px, single person. The capture screen sends the full frame.

## Troubleshooting

### "YOUCAM_API_KEY is required when YOUCAM_MODE=live"
Add the key to `.env`, or set `YOUCAM_MODE=fixture`.

### "YouCam rejected the API key"
The key is wrong, or `YOUCAM_BASE_URL` doesn't match the portal that issued it.

### "Your face looks too small in the photo"
Move closer. Uploaded photos aren't cropped, so use a close-up.

### "Garment image not found in public/"
The garment file in the product's `garmentImageUrl` is missing from `public/`.

### Middleware fails to start or references `fs`
`src/middleware.ts` must keep `export const config = { runtime: 'nodejs' }`, because it imports Prisma and `better-sqlite3`.

## Rollback to fixture mode
Set `YOUCAM_MODE=fixture` and restart. No database changes are needed.

## Known issues in either mode

- **Build emits a middleware deprecation warning.** The app still runs correctly.

## For judges

Fixture mode needs no credentials: set `YOUCAM_MODE=fixture`, run `pnpm dev`, and open `http://localhost:3000`. It returns prerecorded analysis and try-on data without contacting YouCam.
