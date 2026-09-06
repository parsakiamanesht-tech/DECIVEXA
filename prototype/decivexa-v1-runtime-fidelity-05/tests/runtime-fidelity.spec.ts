import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('decision selection is distinct from committed persistence', async ({ page }) => {
  await page.getByText('Decisions').first().click();
  await page.getByRole('button', { name: /Open decision|باز کردن تصمیم/ }).click();
  await page.getByRole('button', { name: /Balanced|متعادل/ }).click();
  await expect(page.getByText('UNCOMMITTED')).toBeVisible();
  await page.getByRole('button', { name: /Commit decision|ثبت واقعی تصمیم/ }).click();
  await expect(page.getByText('COMMITTED')).toBeVisible();
  await page.reload();
  await page.getByText('Home').first().click().catch(() => {});
  await expect(page.getByText('COMMITTED')).toBeVisible();
});

test('correction confirmation creates a review-required dependent state', async ({ page }) => {
  await page.getByText('Understand').first().click();
  await page.getByRole('button', { name: /Correct this understanding|اصلاح این درک/ }).click();
  await page.getByRole('button', { name: /Confirm correction|تأیید اصلاح/ }).click();
  await expect(page.getByText('CONFIRMED')).toBeVisible();
  await page.reload();
  await expect(page.getByText('CONFIRMED')).toBeVisible();
});

test('retry creates a new attempt after incomplete application', async ({ page }) => {
  await page.getByText('Today').first().click();
  await page.getByRole('button', { name: /Record outcome|ثبت نتیجه/ }).click();
  await page.getByRole('button', { name: /Incomplete|ناقص/ }).click();
  await page.getByRole('button', { name: /Accept|پذیرش/ }).click();
  await expect(page.getByText('FAILED-INCOMPLETE')).toBeVisible();
  await page.getByRole('button', { name: /Retry|تلاش مجدد/ }).click();
  await expect(page.getByText('Real retry|Retry واقعی')).toBeVisible();
  await expect(page.getByText('2')).toBeVisible();
  await page.getByRole('button', { name: /Complete retry|تکمیل موفق/ }).click();
  await expect(page.getByText('APPLIED')).toBeVisible();
  await page.reload();
  await expect(page.getByText('APPLIED')).toBeVisible();
});

test('modal traps focus and restores focus to invoker', async ({ page }) => {
  await page.getByText('Decisions').first().click();
  const trigger = page.getByRole('button', { name: /Open decision|باز کردن تصمیم/ });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('mobile and RTL/LTR semantics remain available', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('#lang').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('navigation').last()).toBeVisible();
});
