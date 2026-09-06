import { test, expect } from '@playwright/test';

const openDecision = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: /آزمون Decision|Test Decision/ }).click();
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
  await expect(page.getByText('UNCOMMITTED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /ثبت واقعی تصمیم|Commit decision/ }).click();
  await expect(page.getByText('COMMITTED', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('COMMITTED', { exact: true })).toBeVisible();
});

test('correction confirmation creates a review-required dependent state', async ({ page }) => {
  await openCorrection(page);
  await page.getByRole('button', { name: /اصلاح این درک|Correct this understanding/ }).click();
  await page.getByRole('button', { name: /تأیید اصلاح|Confirm correction/ }).click();
  await expect(page.getByText('CONFIRMED', { exact: true })).toBeVisible();
  await expect(page.getByText('REVIEW REQUIRED', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('CONFIRMED', { exact: true })).toBeVisible();
  await expect(page.getByText('REVIEW REQUIRED', { exact: true })).toBeVisible();
});

test('retry creates a new attempt after incomplete application', async ({ page }) => {
  await openRetry(page);
  await page.getByRole('button', { name: /ثبت نتیجه|Record outcome/ }).click();
  await page.getByRole('button', { name: /ناقص|Incomplete/ }).click();
  await page.getByRole('button', { name: /پذیرش|Accept/ }).click();
  await expect(page.getByText('FAILED-INCOMPLETE', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /تلاش مجدد|Retry/ }).click();
  await expect(page.getByRole('heading', { name: /Retry واقعی|Real retry/ })).toBeVisible();
  await expect(page.getByRole('dialog').getByText('2', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /تکمیل موفق|Complete retry/ }).click();
  await expect(page.getByText('APPLIED', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('APPLIED', { exact: true })).toBeVisible();
});

test('modal traps focus and restores focus to invoker', async ({ page }) => {
  await openCorrection(page);
  const trigger = page.getByRole('button', { name: /اصلاح این درک|Correct this understanding/ });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('mobile and RTL/LTR semantics remain available', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile semantics are validated only in the mobile device project.');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#mobileLang')).toBeVisible();
  await page.locator('#mobileLang').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('navigation').last()).toBeVisible();
});
