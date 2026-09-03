import { test, expect } from '@playwright/test';

// Personal Intelligence Claim Visibility - V1 (Founder Implementation
// Authorization). Covers only presentation of the existing, unmodified
// GET /personal-intelligence/claims, /history, /claims/:id/diff, and
// /claims/:id/versions/:v/evidence endpoints. Unauthenticated access is
// already covered by e2e/auth.spec.ts and is not duplicated here.

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
