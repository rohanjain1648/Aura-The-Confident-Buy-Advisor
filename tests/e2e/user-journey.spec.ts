import { test, expect, type Page } from '@playwright/test';

// Navigates to /shop, waits for hydration + product fetch to settle (clicking
// too early can silently miss the Next.js Link handler), then clicks the
// first product card. Returns once navigation to the PDP has happened.
async function goToShopAndOpenFirstProduct(page: Page) {
  await page.goto('/shop');
  const firstCard = page.locator('a[href^="/shop/"]').first();
  await expect(firstCard).toBeVisible({ timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await firstCard.click();
  // Product IDs are Prisma cuid() strings, not numeric — match any non-empty segment
  await expect(page).toHaveURL(/\/shop\/[a-zA-Z0-9]+/, { timeout: 10000 });
}

test.describe('User journey (fixture mode)', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    // Navbar brand
    await expect(page.getByText('AURA', { exact: true }).first()).toBeVisible();
    // Hero headline (rendered across a wrapped <h1>)
    await expect(page.locator('h1').first()).toContainText(/Zero Guesswork/i);
  });

  test('navigation to onboarding works', async ({ page }) => {
    await page.goto('/');
    // The navbar CTA is a <Link href="/onboarding"> anchor, not a <button>
    await page.getByRole('link', { name: /Analyze Skin/i }).click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole('heading', { name: 'Capture Your Aura' })).toBeVisible();
  });

  test('onboarding component renders camera button', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByRole('heading', { name: 'Capture Your Aura' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Camera' })).toBeVisible();
  });

  test('shop page loads and displays products', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.locator('h1')).toContainText('Personalized Shop');
    // Wait for products to load via /api/shop (fixture mode)
    await expect(page.getByText(/Score:/).first()).toBeVisible({ timeout: 10000 });
  });

  test('product card links to a real detail page', async ({ page }) => {
    await goToShopAndOpenFirstProduct(page);
  });

  test('product detail page displays verdict badge', async ({ page }) => {
    await goToShopAndOpenFirstProduct(page);
    await expect(
      page.getByText(/Perfect Match|Complements|Skip/).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('add to cart button triggers confirmation alert', async ({ page }) => {
    await goToShopAndOpenFirstProduct(page);

    // "Add to Cart" triggers a native window.alert(), which is not part of the
    // DOM — it must be handled via the page 'dialog' event, registered before
    // the click that opens it.
    let dialogMessage = '';
    page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect.poll(() => dialogMessage).toContain('Added to cart');
  });

  test('cart page loads', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText('Cart');
  });

  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Your Dashboard');
  });
});
