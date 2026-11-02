# Deploying Aura

Aura runs as one Next.js service with a SQLite database, so it needs a host that runs a long-lived Node process and allows writing to disk. [`render.yaml`](./render.yaml) sets this up on Render.

## Deploy to Render

1. In the [Render dashboard](https://dashboard.render.com), choose **New > Blueprint**.
2. Connect the GitHub repository and select it. Render reads `render.yaml`.
3. Enter the three secrets when asked:

   | Variable | Where to get it |
   |---|---|
   | `YOUCAM_API_KEY` | YouCam console, API Keys page |
   | `GROQ_API_KEY` | Groq console |
   | `OPENAI_API_KEY` | OpenAI dashboard |

4. Choose **Apply** and wait for the build to finish.
5. Open the service URL and run a selfie through `/onboarding` on the phone or laptop you plan to demo with. The camera needs HTTPS, which Render provides.

`YOUCAM_BASE_URL` is set for the `yce.makeupar.com` portal. If your key comes from `yce.perfectcorp.com`, change it to `https://yce-api-01.perfectcorp.com`.

## Plans and data

The Blueprint uses Render's free plan, which has two limits:

- **Slow first load:** the service sleeps when idle, and the first request afterwards can take about a minute.
- **Data resets:** the database is rebuilt on every start, so Skin Passports, carts and looks are lost when the service sleeps or redeploys. Shoppers then need to retake their selfie. Product links keep working because product IDs are stable.

A paid instance doesn't sleep, so data lasts until the next deploy or restart. Keeping data beyond that needs a Render disk, plus a start command that doesn't reseed.

## API usage

A public deployment spends your credits, so watch these:

- **YouCam:** each selfie analysis costs 32 units and each new try-on costs 2.
- **Groq and OpenAI:** the advisor has no per-visitor limit, so set a spending limit on both accounts.

## Run without API keys

Set `YOUCAM_MODE=fixture` to serve prerecorded YouCam results without calling the API. See [LIVE_MODE_CHECKLIST.md](./LIVE_MODE_CHECKLIST.md) for local setup.
