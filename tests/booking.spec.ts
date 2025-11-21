// import { test, expect } from '@playwright/test';
// test.use({storageState: 'auth.json'});
// test('Booking a Property - e2e', async ({ page }) => {
//   await page.goto('https://staging.wander.com/');
//   await page.locator('section').filter({ hasText: 'Homes our guests loveGreat' }).getByLabel('Wander Gaston Shores').click();
//   // Open date picker if needed (depends on current UI)
//   // await page.getByRole('button', { name: /Select dates/i }).click();

//   // Move to the month that contains the range you care abouta
//   await page.getByRole('button', { name: 'Next month' }).click();
//   await page.getByRole('button', { name: 'Next month' }).click();


//   // --- Select 8th as check-in (enabled only) ---
//   const startDay = await page.getByRole('button', { name: '11' }).nth(2)
//   await startDay.click();

//   // --- Select 14th as check-out (enabled only) ---
//   const endDay = await page.getByRole('button', { name: '14' }).nth(1)
//   await endDay.click();

// //  const calendar = page.getByRole('heading', { name: 'February 2026' }).locator('..').locator('..');

// // const endDay = calendar.locator('button:not([disabled])', { hasText: '11' });
// // await endDay.click();



//   // Continue with booking
//   await page
//     .locator('#property-booking')
//     .getByRole('button', { name: 'Reserve' })
//     .click();

//   await page.waitForTimeout(2000);

//   // const cardFrame = await page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(0);
  

//   // // await cardFrame.locator('aria-label="Enter 6-digit authentication code"').click();

//   // await page.frameLocator('iframe')   .locator('aria-label="Enter 6-digit authentication code"')   .fill('123456');


// // Correct Stripe card input frame (unique)
// const stripeFrame = await page.frameLocator('iframe[title="Secure payment input frame"]');

// // Try to get 6-digit code (Stripe sometimes requires it)
// const authInput = await stripeFrame.getByLabel('Enter 6-digit authentication code');

// // Fill only if visible
// if (await authInput.isVisible({ timeout: 3000 }).catch(() => false)) {
//   await authInput.fill('000000');
// }

//   await page.getByRole('button', { name: 'Confirm and pay' }).click();
//   await page.goto('https://staging.wander.com/countdown/wander-gaston-shores/cmi88b9dx00006u204wjszaq0?checkIn=2026-02-01&checkOut=2026-02-07');
//   await page.getByRole('button', { name: 'Continue' }).nth(1).click();
//   await page.getByRole('link', { name: 'Skip' }).click();
//   await page.getByRole('link', { name: 'View your agreements' }).click();
//   await page.getByRole('checkbox', { name: 'I have read and agree to the' }).check();
//   await page.getByRole('button', { name: 'Sign agreement' }).click();
//   await page.getByRole('link', { name: 'Wander logo' }).click();

// });
import { test, expect, Page } from '@playwright/test';

async function getCalendarMonthHeading(page: Page) {
  // Scope to the "Select dates in Wander Gaston Shores" section
  const calendarRoot = page
    .getByRole('heading', { name: /Select dates in Wander Gaston Shores/i })
    .locator('..')
    .locator('..');

  // Inside this section the level=3 headings are the month labels
  return calendarRoot.getByRole('heading', { level: 3 }).last();
}

async function selectThreeNightWindow(page: Page) {
  const starts = [11, 15, 19, 23, 27];

  for (let month = 0; month < 6; month++) {
    const monthHeading = await getCalendarMonthHeading(page);
    await expect(monthHeading).toBeVisible();

    const monthContainer = monthHeading.locator('..').locator('..');

    for (const start of starts) {
      const end = start + 3;

      const checkIn = monthContainer.locator('button:not([disabled])', {
        hasText: String(start),
      });
      const checkOut = monthContainer.locator('button:not([disabled])', {
        hasText: String(end),
      });

      if ((await checkIn.count()) > 0 && (await checkOut.count()) > 0) {
        await checkIn.first().click();
        await checkOut.first().click();
        return;
      }
    }

    // No window in this month → go to next month
    const previousLabel = (await monthHeading.textContent())?.trim();
    await page.getByRole('button', { name: 'Next month' }).click();

    // Re-scope to the calendar heading after navigation
    const newMonthHeading = await getCalendarMonthHeading(page);
    await expect(newMonthHeading).not.toHaveText(previousLabel ?? '', {
      timeout: 5000,
    });
  }

  throw new Error('No 3-night window found in the searched months');
}

test.use({ storageState: 'auth.json' });

test('Booking a Property - e2e', async ({ page }) => {
  await page.goto('https://staging.wander.com/');

  await page
    .locator('section')
    .filter({ hasText: 'Homes our guests loveGreat' })
    .getByLabel('Wander Gaston Shores')
    .click();

  await expect(
    page.getByRole('heading', { name: /Select dates in Wander Gaston Shores/i })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Next month' }).click();
  await page.getByRole('button', { name: 'Next month' }).click();

  await selectThreeNightWindow(page);

  // ... then your existing booking flow
  await page
    .locator('#property-booking')
    .getByRole('button', { name: 'Reserve' })
    .click();

  const stripeFrame = page.frameLocator(
    'iframe[title="Secure payment input frame"]'
  );

  const authInput = stripeFrame.getByLabel('Enter 6-digit authentication code');
  if (await authInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await authInput.fill('000000');
  }

  await page.getByRole('button', { name: 'Confirm and pay' }).click();
  await page.waitForURL('**/countdown/wander-gaston-shores/**');

  await page.getByRole('button', { name: 'Continue' }).nth(1).click();
  await page.getByRole('link', { name: 'Skip' }).click();
  await page.getByRole('link', { name: 'View your agreements' }).click();
  await page
    .getByRole('checkbox', { name: 'I have read and agree to the' })
    .check();
  await page.getByRole('button', { name: 'Sign agreement' }).click();
  await page.getByRole('link', { name: 'Wander logo' }).click();
});
