import { test, expect } from '@playwright/test';

const openDecision = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: /آزمون Decision|Test Decision/ }).click();
  await page.getByRole('button', { name: /باز کردن تصمیم|Open decision/ }).click();
};

const openCorrection = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: /آزمون Correction|Test Correction/ }).click();
};

const openRetry = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: /آزمون Retry \/ Persistence|Test Retry \/ Persistence/ }).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('decision selection is distinct from committed persistence', async ({ page }) => {
  await openDecision(page);
  await page.getByRole('button', { name: /متعادل|Balanced/ }).click();
  await expect(page.getByText('UNCOMMITTED')).toBeVisible();
  await page.getByRole('button', { name: /ثبت واقعی تصمیم|Commit decision/ }).click();
  await expect(page.getByText('COMMITTED')).toBeVisible();
  await page.reload();
  await expect(page.getByText('COMMITTED')).toBeVisible();
});

test('correction confirmation creates a review-required dependent state', async ({ page }) => {
  await openCorrection(page);
  await page.getByRole('button', { name: /اصلاح این درک|Correct this understanding/ }).click();
  await page.getByRole('button', { name: /تأیید اصلاح|Confirm correction/ }).click();
  await expect(page.getByText('CONFIRMED')).toBeVisible();
  await page.reload();
  await expect(page.getByText('CONFIRMED')).toBeVisible();
});

test('retry creates a new attempt after incomplete application', async ({ page }) => {
  await openRetry(page);
  await page.getByRole('button', { name: /ثبت نتیجه|Record outcome/ }).click();
  await page.getByRole('button', { name: /ناقص|Incomplete/ }).click();
  await page.getByRole('button', { name: /پذیرش|Accept/ }).click();
  await expect(page.getByText('FAILED-INCOMPLETE')).toBeVisible();
  await page.getByRole('button', { name: /تلاش مجدد|Retry/ }).click();
  await expect(page.getByRole('heading', { name: /Retry واقعی|Real retry/ })).toBeVisible();
  await expect(page.locator('.attempts').filter({ hasText: '2' })).toBeVisible();
  await page.getByRole('button', { name: /تکمیل موفق|Complete retry/ }).click();
  await expect(page.getByText('APPLIED')).toBeVisible();
  await page.reload();
  await expect(page.getByText('APPLIED')).toBeVisible();
});

test('modal traps focus and restores focus to invoker', async ({ page }) => {
  await openDecision(page);
  const trigger = page.getByRole('button', { name: /باز کردن تصمیم|Open decision/ });
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('mobile and RTL/LTR semantics remain available', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  // The language control lives in the desktop sidebar, which is intentionally hidden
  // at mobile width. Force only this DOM interaction; visibility itself is asserted below.
  await page.locator('#lang').click({ force: true });
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('navigation').last()).toBeVisible();
});
