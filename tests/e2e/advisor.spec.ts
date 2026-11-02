import { test, expect, type Page } from '@playwright/test';

// The model's reply is stubbed so this checks the panel without spending LLM calls.
async function stubAdvisor(page: Page, body: object, status = 200) {
  await page.route('**/api/advisor', (route) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }));
}

test.describe('Advisor panel', () => {
  test('answers a suggested question on the shop page and shows what it checked', async ({ page }) => {
    await stubAdvisor(page, {
      reply: 'Start with the Camel Belted Trench.',
      toolsUsed: ['get_skin_passport', 'list_products'],
      provider: 'groq',
      fallback: false,
    });
    await page.goto('/shop');
    await page.waitForLoadState('networkidle'); // clicks before hydration are silently missed
    await page.getByRole('button', { name: 'What should I buy first?' }).click();

    await expect(page.getByText('Start with the Camel Belted Trench.')).toBeVisible();
    await expect(page.getByText('Checked: Skin Passport, Catalog')).toBeVisible();
  });

  test('shows a try-on image and a typed question on the product page', async ({ page }) => {
    await stubAdvisor(page, {
      reply: 'Here it is on you.',
      toolsUsed: ['virtual_try_on'],
      tryOnImageUrl: '/seed/vto-demo.jpg',
      fallback: false,
    });
    await page.goto('/shop');
    await page.waitForLoadState('networkidle'); // clicks before hydration are silently missed
    await page.locator('a[href^="/shop/"]').first().click();
    await expect(page).toHaveURL(/\/shop\/[a-zA-Z0-9]+/);

    await page.getByRole('textbox', { name: 'Ask Aura' }).fill('Try this on me');
    await page.getByRole('button', { name: 'Ask', exact: true }).click();

    await expect(page.getByText('Here it is on you.')).toBeVisible();
    await expect(page.getByAltText('Your virtual try-on')).toBeVisible();
  });

  test('labels a basic answer when the AI is unavailable', async ({ page }) => {
    await stubAdvisor(page, { reply: 'Your top matches are listed.', toolsUsed: [], fallback: true });
    await page.goto('/shop');
    await page.waitForLoadState('networkidle'); // clicks before hydration are silently missed
    await page.getByRole('button', { name: 'What suits my undertone?' }).click();
    await expect(page.getByText(/AI advisor unavailable/)).toBeVisible();
  });

  test('shows an error when the request fails', async ({ page }) => {
    await stubAdvisor(page, { error: 'The advisor could not answer.' }, 500);
    await page.goto('/shop');
    await page.waitForLoadState('networkidle'); // clicks before hydration are silently missed
    await page.getByRole('button', { name: 'What should I buy first?' }).click();
    // Scoped to the panel because Next.js's route announcer also has role="alert".
    await expect(page.getByRole('region', { name: 'Aura Advisor' }).getByRole('alert')).toContainText('could not answer');
  });
});
