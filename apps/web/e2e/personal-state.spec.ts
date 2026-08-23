import { test, expect } from '@playwright/test';

// Increment 006 / ADR-002: Web/Product Integration Boundary.
// These tests cover only presentation of the two existing endpoints
// (GET /personal-state, GET /personal-state/history). Unauthenticated
// access to /dashboard is already covered by e2e/auth.spec.ts and is
// not duplicated here.

async function mockAuth(page: import('@playwright/test').Page) {
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
}

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('e2e@example.com');
  await page.getByLabel('Password').fill('correct-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test('renders the authenticated user\'s Personal State from the existing endpoint', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-state', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'ps-1',
        userId: 'e2e-user',
        timezone: 'Europe/Paris',
        locale: 'fr-FR',
        availability: 'available',
        provenance: 'declared',
        revision: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
      }),
    });
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);

  await expect(page.getByRole('heading', { name: 'Personal State' })).toBeVisible();
  await expect(page.getByText('Europe/Paris')).toBeVisible();
  await expect(page.getByText('available')).toBeVisible();
});

test('renders Personal State History in the order the backend returns, preserving revision order', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-state', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ statusCode: 404, message: 'Personal state not initialized' }),
    });
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'rev-1', userId: 'e2e-user', revision: 1, timezone: 'UTC', locale: null, availability: null, provenance: 'declared', evidenceVersionId: null, createdAt: '2026-01-01T00:00:00.000Z' },
        { id: 'rev-2', userId: 'e2e-user', revision: 2, timezone: 'Europe/Paris', locale: null, availability: null, provenance: 'observed', evidenceVersionId: 'ev-9', createdAt: '2026-01-02T00:00:00.000Z' },
      ]),
    });
  });

  await signIn(page);

  await expect(page.getByText('No Personal State recorded yet.')).toBeVisible();
  const items = page.locator('ul li');
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText('Revision 1');
  await expect(items.nth(1)).toContainText('Revision 2');
  await expect(items.nth(1)).toContainText('evidence: ev-9');
});

test('renders an empty history state without error when the user has no revisions', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-state', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ statusCode: 404, message: 'Personal state not initialized' }),
    });
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);

  await expect(page.getByText('No history recorded yet.')).toBeVisible();
});

test('handles a Personal State History API failure without crashing the page', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-state', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ statusCode: 404, message: 'Personal state not initialized' }),
    });
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ statusCode: 500, message: 'Internal server error' }),
    });
  });

  await signIn(page);

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('alert')).toBeVisible();
});
