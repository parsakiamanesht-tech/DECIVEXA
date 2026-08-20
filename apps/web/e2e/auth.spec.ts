import { test, expect } from '@playwright/test';

const TOKEN_KEY = 'decivexa_access_token';

test('redirects an unauthenticated user from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test('renders dashboard for an authenticated session', async ({ page }) => {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, 'e2e-test-token');
  }, TOKEN_KEY);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
