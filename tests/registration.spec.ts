import { test, expect } from '@playwright/test';
test.use({storageState: 'auth.json'});
test('has title', async ({ page }) => {
  await page.goto('https://staging.wander.com/');
  await page.locator('section').filter({ hasText: 'Homes our guests loveGreat' }).getByLabel('Wander Gaston Shores').click();
  await page.getByRole('textbox', { name: 'Check-in' }).click();
  await page.locator('#radix-_r_3t_').getByRole('button', { name: 'Next month' }).click();
  await page.locator('#radix-_r_3t_').getByRole('button', { name: 'Next month' }).click();
  await page.locator('#radix-_r_3t_').getByRole('button', { name: '1', exact: true }).click();
  await page.getByRole('button', { name: '7', exact: true }).nth(3).click();
  await page.locator('#property-booking').getByRole('button', { name: 'Reserve' }).click();
  await page.locator('iframe[name="__privateStripeFrame5373"]').contentFrame().getByTestId('code-controlling-input').click();
  await page.locator('iframe[name="__privateStripeFrame5373"]').contentFrame().getByTestId('code-controlling-input').fill('0');
  
  // await page.getByRole('button', { name: 'Confirm and pay' }).click();
  // await page.goto('https://staging.wander.com/countdown/wander-gaston-shores/cmi7g3lr30005fb1t3vcgooe6?checkIn=2026-01-11&checkOut=2026-01-17');
  // await page.getByRole('button', { name: 'Continue' }).nth(1).click();
  // await page.getByRole('link', { name: 'Skip' }).click();
  // await page.getByRole('link', { name: 'View your agreements' }).click();
  // await page.getByText('I have read and agree to the').click();
  // await page.getByRole('button', { name: 'Sign agreement' }).click();
  // await page.getByRole('link', { name: 'Wander logo' }).click();
});