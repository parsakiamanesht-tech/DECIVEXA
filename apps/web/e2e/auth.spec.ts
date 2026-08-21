import { test, expect } from '@playwright/test';

const TOKEN_KEY = 'decivexa_access_token';

test('redirects an unauthenticated user from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});

test('logs in through the real login UI contract', async ({ page }) => {
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ userId: 'e2e-user', email: 'e2e@example.com', accessToken: 'e2e-test-token' }),
    });
  });

  await page.route('**/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ userId: 'e2e-user', requestId: 'e2e-request' }),
    });
  });

  await page.goto('/login');
  await page.getByLabel('Email').fill('e2e@example.com');
  await page.getByLabel('Password').fill('correct-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.evaluate((key) => window.localStorage.getItem(key), TOKEN_KEY)).resolves.toBe('e2e-test-token');
});
