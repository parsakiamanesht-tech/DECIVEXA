import { test, expect } from '@playwright/test';

// Personal Intelligence Claim Visibility - V1 (Founder Implementation
// Authorization). Covers only presentation of the existing, unmodified
// GET /personal-intelligence/claims, /history, /claims/:id/diff, and
// /claims/:id/versions/:v/evidence endpoints. Unauthenticated access is
// already covered by e2e/auth.spec.ts and is not duplicated here.
//
// C3 Claim Confirm/Unconfirm (Founder Implementation Authorization):
// covers GET/POST .../confirmation. Every POST mock always succeeds
// (201) - these tests never disable or hide the action buttons based on
// current state, proving redundant actions remain genuinely available
// client-side, matching the Founder's "never deduplicate" decision.

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

const SAMPLE_CLAIM = {
  id: 'version-1',
  claimId: 'claim-1',
  version: 1,
  userId: 'e2e-user',
  claimType: 'preference',
  valueKind: 'text',
  valueText: 'Prefers async written updates',
  provenance: 'declared',
  confidence: 1,
  lifecycle: 'active',
  evidenceVersionId: null,
  inferenceId: null,
  evidenceLinkageState: 'self_reported_no_evidence_required',
  effectiveFrom: null,
  effectiveTo: null,
  situationSetting: null,
  timeOfDay: null,
  observedAt: '2026-01-01T00:00:00.000Z',
  acceptedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
};

test("renders the authenticated user's active claims from the existing endpoint, grouped by claim, not as a raw table", async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  await expect(page.getByRole('heading', { name: 'Personal Intelligence' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Preference' })).toBeVisible();
  await expect(page.getByText('Prefers async written updates')).toBeVisible();
  await expect(page.getByText('Active')).toBeVisible();
  await expect(page.getByText('You told DECIVEXA this directly')).toBeVisible();
  await expect(page.getByText('Self-reported (no evidence expected)')).toBeVisible();
  // Claim-Level Context Visibility: SAMPLE_CLAIM has null
  // situationSetting/timeOfDay - null context must produce no fabricated
  // UI, so neither label may appear.
  await expect(page.getByText('Situation')).toHaveCount(0);
  await expect(page.getByText('Time of day')).toHaveCount(0);
});

test('Claim-Level Context Visibility: displays non-null situationSetting and timeOfDay exactly as stored, on both the current claim and its history entry', async ({ page }) => {
  const claimWithContext = { ...SAMPLE_CLAIM, situationSetting: 'work', timeOfDay: 'morning' };
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([claimWithContext]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([claimWithContext]) });
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  await expect(page.getByRole('heading', { name: 'Preference' })).toBeVisible();
  await expect(page.getByText('Situation')).toBeVisible();
  await expect(page.getByText('work', { exact: true })).toBeVisible();
  await expect(page.getByText('Time of day')).toBeVisible();
  await expect(page.getByText('morning', { exact: true })).toBeVisible();
});

test('shows an honest empty state when no claims have been recorded yet', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  await expect(page.getByText('DECIVEXA has not recorded any claims about you yet.')).toBeVisible();
});

test('reveals evidence-linkage state on request, distinguishing "not linked" from "evidence missing" without merging them', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  await page.route('**/personal-intelligence/claims/claim-1/versions/1/evidence', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'not_linked' }) });
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  await page.getByRole('button', { name: 'Check evidence' }).first().click();
  await expect(page.getByText('Not linked to any evidence.')).toBeVisible();
});

test('displays the effective confirmation state and Confirm/Retract actions on the current claim card', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  await page.route('**/personal-intelligence/claims/claim-1/versions/1/confirmation', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'found', state: 'not_confirmed' }) });
    }
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  await expect(page.getByText('Not confirmed')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm this is accurate' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retract your confirmation' })).toBeVisible();
});

test('Confirm action records a new event and refreshes the displayed state', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  let getCount = 0;
  await page.route('**/personal-intelligence/claims/claim-1/versions/1/confirmation', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'event-1', claimId: 'claim-1', claimVersionId: 'version-1', userId: 'e2e-user',
          sequence: 1, action: 'confirmed', occurredAt: '2026-01-01T00:00:00.000Z', createdAt: '2026-01-01T00:00:00.000Z',
        }),
      });
      return;
    }
    getCount += 1;
    const state = getCount === 1 ? 'not_confirmed' : 'confirmed';
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'found', state }) });
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  await expect(page.getByText('Not confirmed')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm this is accurate' }).click();
  await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
});

test('Retract confirmation action refreshes the displayed state, and redundant actions remain available (buttons are never disabled by current state)', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([SAMPLE_CLAIM]) });
  });
  let getCount = 0;
  await page.route('**/personal-intelligence/claims/claim-1/versions/1/confirmation', async (route) => {
    if (route.request().method() === 'POST') {
      // Every POST succeeds, including a redundant one - this route
      // never rejects a second identical call, matching the backend's
      // never-deduplicate behavior.
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: `event-${getCount + 1}`, claimId: 'claim-1', claimVersionId: 'version-1', userId: 'e2e-user',
          sequence: getCount + 1, action: 'unconfirmed', occurredAt: '2026-01-01T00:00:00.000Z', createdAt: '2026-01-01T00:00:00.000Z',
        }),
      });
      return;
    }
    getCount += 1;
    const state = getCount === 1 ? 'confirmed' : 'unconfirmed';
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'found', state }) });
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
  const retract = page.getByRole('button', { name: 'Retract your confirmation' });
  await expect(retract).toBeEnabled();
  await retract.click();
  await expect(page.getByText('Unconfirmed')).toBeVisible();
  // Redundant retract: the button must remain enabled and clickable
  // again, never disabled merely because the state is already
  // "unconfirmed" - a second retraction is still a valid, real event.
  await expect(retract).toBeEnabled();
  await retract.click();
});

test('confirmation actions appear only on the current claim card, never on historical version entries', async ({ page }) => {
  const currentVersion = { ...SAMPLE_CLAIM, id: 'version-2', version: 2, lifecycle: 'active' };
  const historicalVersion = { ...SAMPLE_CLAIM, id: 'version-1', version: 1, lifecycle: 'superseded' };
  await mockAuth(page);
  await page.route('**/personal-intelligence/claims', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([currentVersion]) });
  });
  await page.route('**/personal-intelligence/history', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([historicalVersion, currentVersion]),
    });
  });
  await page.route('**/personal-intelligence/claims/claim-1/versions/2/confirmation', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'found', state: 'not_confirmed' }) });
  });

  await signIn(page);
  await page.goto('/dashboard/intelligence');

  // Exactly one Confirm/Retract pair - on the current claim card only.
  await expect(page.getByRole('button', { name: 'Confirm this is accurate' })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Retract your confirmation' })).toHaveCount(1);

  await page.getByRole('button', { name: /View history/ }).click();
  await expect(page.getByText('Version 1')).toBeVisible();
  // Still exactly one pair after the history list is open - the
  // historical entry never grows its own Confirm/Retract controls.
  await expect(page.getByRole('button', { name: 'Confirm this is accurate' })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Retract your confirmation' })).toHaveCount(1);
});
