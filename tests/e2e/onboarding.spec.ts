import { test, expect, type Page } from '@playwright/test';

const PHOTO = 'public/seed/sage-shirt.jpg';

// Without the face detector the page falls back to centred crops, which these tests count.
const blockFaceDetector = (page: Page) => page.route('**/mediapipe/**', (route) => route.abort());

// The analysis stream is stubbed so these tests spend no API units.
async function uploadWithStream(page: Page, events: object[]) {
  await page.route('**/api/analyze', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join(''),
    }));
  await page.goto('/onboarding');
  await page.waitForLoadState('networkidle'); // clicks before hydration are silently missed
  await page.locator('input[type="file"]').setInputFiles(PHOTO);
}

test.describe('Selfie capture', () => {
  test('shows why YouCam rejected a photo', async ({ page }) => {
    await uploadWithStream(page, [
      { status: 'uploading' },
      { status: 'error', message: 'Your face looks too small in the photo.' },
    ]);
    await expect(page.getByText('Your face looks too small in the photo.')).toBeVisible();
    await expect(page.getByText('Analysis incomplete')).toHaveCount(0);
  });

  test('retries tighter crops when the face is too small', async ({ page }) => {
    await blockFaceDetector(page);
    const tooSmall = { status: 'error', code: 'error_src_face_too_small', message: 'Your face looks too small.' };
    const passport = { status: 'complete', passport: { undertone: 'warm', topConcern: 'redness' } };
    const sizes: number[] = [];
    const responses = [tooSmall, tooSmall, passport];
    await page.route('**/api/analyze', (route) => {
      sizes.push(route.request().postDataBuffer()?.length ?? 0);
      return route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: `data: ${JSON.stringify(responses[sizes.length - 1])}\n\n`,
      });
    });
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="file"]').setInputFiles(PHOTO);

    await expect(page.getByText('warm Undertone')).toBeVisible();
    await expect(page.getByText('Your face looks too small.')).toHaveCount(0);
    expect(sizes).toHaveLength(3);
    expect(new Set(sizes).size).toBe(3); // each attempt sends a different crop
  });

  test('gives up with the reason once no tighter crop is left', async ({ page }) => {
    await blockFaceDetector(page);
    let attempts = 0;
    await page.route('**/api/analyze', (route) => {
      attempts += 1;
      return route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: `data: ${JSON.stringify({ status: 'error', code: 'error_src_face_too_small', message: 'Your face looks too small.' })}\n\n`,
      });
    });
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="file"]').setInputFiles(PHOTO);

    await expect(page.getByText('Your face looks too small.')).toBeVisible();
    expect(attempts).toBe(4); // the full photo plus three crops
  });

  test('does not retry other rejections', async ({ page }) => {
    let attempts = 0;
    await page.route('**/api/analyze', (route) => {
      attempts += 1;
      return route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: `data: ${JSON.stringify({ status: 'error', code: 'error_lighting_dark', message: 'The photo is too dark.' })}\n\n`,
      });
    });
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="file"]').setInputFiles(PHOTO);

    await expect(page.getByText('The photo is too dark.')).toBeVisible();
    expect(attempts).toBe(1);
  });

  test('shows the Skin Passport after a successful analysis', async ({ page }) => {
    await uploadWithStream(page, [
      { status: 'uploading' },
      { status: 'complete', passport: { undertone: 'warm', topConcern: 'redness' } },
    ]);
    await expect(page.getByText('warm Undertone')).toBeVisible();
    await expect(page.getByText('redness')).toBeVisible();
  });
});
