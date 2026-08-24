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

// Increment 007 / ADR-003: Web write exposure. Every route below
// dispatches on request method (GET/POST/PATCH all share the same
// "/personal-state" URL) - none of it depends on, or supplies, any
// caller-controlled identity; the mocks only ever vary by what the
// *existing* backend contract already returns for that verb.

test('allows an authenticated user to initialize Personal State from the not-initialized view', async ({ page }) => {
  await mockAuth(page);
  let initialized = false;
  await page.route('**/personal-state', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      if (!initialized) {
        await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ statusCode: 404, message: 'Personal state not initialized' }) });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 1, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }),
      });
      return;
    }
    if (method === 'POST') {
      initialized = true;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 1, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }),
      });
      return;
    }
    await route.continue();
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);
  await expect(page.getByText('No Personal State recorded yet.')).toBeVisible();

  await page.getByLabel('Timezone').fill('UTC');
  await page.getByRole('button', { name: 'Initialize Personal State' }).click();

  await expect(page.getByText('No Personal State recorded yet.')).toHaveCount(0);
  await expect(page.getByText('UTC')).toBeVisible();
});

test('allows an authenticated user to update Personal State via the existing PATCH endpoint', async ({ page }) => {
  await mockAuth(page);
  let revision = 3;
  await page.route('**/personal-state', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'Europe/Paris', locale: 'fr-FR', availability: 'available', provenance: 'declared', revision, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-03T00:00:00.000Z' }),
      });
      return;
    }
    if (method === 'PATCH') {
      revision += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: 'fr-FR', availability: 'available', provenance: 'declared', revision, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-04T00:00:00.000Z' }),
      });
      return;
    }
    await route.continue();
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);
  await expect(page.getByText('Europe/Paris')).toBeVisible();

  await page.getByLabel('Timezone').fill('UTC');
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByText('UTC')).toBeVisible();
});

test('sends the currently displayed revision when updating Personal State', async ({ page }) => {
  await mockAuth(page);
  let capturedBody: { revision?: number } | null = null;
  await page.route('**/personal-state', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 7, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }),
      });
      return;
    }
    if (method === 'PATCH') {
      capturedBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 8, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z' }),
      });
      return;
    }
    await route.continue();
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect.poll(() => capturedBody?.revision).toBe(7);
});

test('refreshes Personal State History after a successful update', async ({ page }) => {
  await mockAuth(page);
  let historyCallCount = 0;
  await page.route('**/personal-state', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 1, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }),
      });
      return;
    }
    if (method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 2, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z' }),
      });
      return;
    }
    await route.continue();
  });
  await page.route('**/personal-state/history', async (route) => {
    historyCallCount += 1;
    const revisions = historyCallCount === 1
      ? [{ id: 'rev-1', userId: 'e2e-user', revision: 1, timezone: 'UTC', locale: null, availability: null, provenance: 'declared', evidenceVersionId: null, createdAt: '2026-01-01T00:00:00.000Z' }]
      : [
          { id: 'rev-1', userId: 'e2e-user', revision: 1, timezone: 'UTC', locale: null, availability: null, provenance: 'declared', evidenceVersionId: null, createdAt: '2026-01-01T00:00:00.000Z' },
          { id: 'rev-2', userId: 'e2e-user', revision: 2, timezone: 'UTC', locale: null, availability: null, provenance: 'declared', evidenceVersionId: null, createdAt: '2026-01-02T00:00:00.000Z' },
        ];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(revisions) });
  });

  await signIn(page);
  await expect(page.locator('ul li')).toHaveCount(1);

  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.locator('ul li')).toHaveCount(2);
});

test('shows a validation error message and keeps the update form usable on a 400 response', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-state', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 1, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }),
      });
      return;
    }
    if (method === 'PATCH') {
      await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ statusCode: 400, message: 'Invalid timezone' }) });
      return;
    }
    await route.continue();
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByRole('alert')).toContainText('Invalid timezone');
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
});

test('shows a generic error without crashing on a Personal State update API failure', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-state', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ps-1', userId: 'e2e-user', timezone: 'UTC', locale: null, availability: null, provenance: 'declared', revision: 1, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }),
      });
      return;
    }
    if (method === 'PATCH') {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ statusCode: 500, message: 'Internal server error' }) });
      return;
    }
    await route.continue();
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('Internal server error');
});

test('handles an optimistic-concurrency conflict by refreshing the authoritative state instead of guessing', async ({ page }) => {
  await mockAuth(page);
  let getCallCount = 0;
  await page.route('**/personal-state', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      getCallCount += 1;
      const stale = getCallCount === 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'ps-1',
          userId: 'e2e-user',
          timezone: stale ? 'UTC' : 'Europe/Paris',
          locale: null,
          availability: null,
          provenance: 'declared',
          revision: stale ? 1 : 2,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        }),
      });
      return;
    }
    if (method === 'PATCH') {
      await route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify({ statusCode: 409, message: 'Revision conflict or state not initialized' }) });
      return;
    }
    await route.continue();
  });
  await page.route('**/personal-state/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);
  await expect(page.getByText('UTC')).toBeVisible();

  await page.getByRole('button', { name: 'Save changes' }).click();

  // No client-side conflict resolution is invented: the UI surfaces the
  // conflict and re-fetches the authoritative GET /personal-state, which
  // now reflects the "elsewhere" change (Europe/Paris, revision 2).
  await expect(page.getByRole('alert')).toContainText('changed elsewhere');
  await expect(page.getByText('Europe/Paris')).toBeVisible();
  expect(getCallCount).toBeGreaterThanOrEqual(2);
});

// Structural, not runtime, per Contract §M items 9-10 (same
// classification Increment 006 used for its equivalent items): a
// repository-wide review of lib/personal-state.ts and
// app/dashboard/page.tsx (both re-read as part of this Increment's
// implementation and validation) confirms neither file ever constructs
// or sends a caller-supplied user id, and neither calls any endpoint
// outside GET/POST/PATCH /personal-state and GET /personal-state/history
// - no Evidence, PI Core, or Memory endpoint is referenced anywhere.
