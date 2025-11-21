import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('Changing Profile details', async ({ page }) => {
  // === NAVIGATE TO PROFILE ===
  await page.goto('https://staging.wander.com/');
  await page.getByRole('button').first().click(); // User menu
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByRole('heading', { name: 'Personal information' }).click();

  // === NAME UPDATE (toggle logic) ===
  const nameInput = page.getByRole('textbox', { name: 'Name Save' });
  const currentName = (await nameInput.inputValue()).trim();

  const newName =
    currentName.toLowerCase() === 'seth adams'
      ? 'Seth S Adams'
      : 'Seth Adams';

  if (currentName !== newName) {
    await nameInput.fill(newName);

    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // ✅ Assert name is actually saved
    await expect(nameInput).toHaveValue(newName);
  }

  // === NAVIGATE INTO STRIPE CHECKOUT ===
  await Promise.all([
    page.waitForURL('**/p/session/**', { waitUntil: 'load' }),
    page.getByText('Add, edit and remove payment').click(),
  ]);

  // === ENTER CARD DETAILS ===
  await page.getByRole('link', { name: 'Add payment method' }).waitFor();
  await page.getByRole('link', { name: 'Add payment method' }).click();

  const cardFrame = page.frameLocator('iframe[src*="elements-inner-payment"]');

  // Card Number
  const cardNumber = cardFrame.getByRole('textbox', { name: 'Card number' });
  await cardNumber.fill('');
  await cardNumber.type('4242 4242 4242 4242');

  // Expiry
  const expiry = cardFrame.getByPlaceholder('MM / YY');
  await expiry.fill('');
  await expiry.type('12 / 34');

  // CVC
  const cvc = cardFrame.getByPlaceholder('CVC');
  await cvc.fill('');
  await cvc.type('123');

  // Sanity Checks
  await expect(cardNumber).toHaveValue(/4242 4242 4242 4242/);
  await expect(expiry).toHaveValue('12 / 34');
  await expect(cvc).toHaveValue('123');

  // === SUBMIT CARD + WAIT FOR RETURN TO PAYMENT METHODS LIST ===
  const confirmButton = page.getByTestId('confirm');
  await expect(confirmButton).toBeEnabled();

  await Promise.all([
    page.waitForURL('**/p/session/**/payment-methods', { waitUntil: 'load' }),
    confirmButton.click(),
  ]);

  // === ASSERT WE ARE BACK ON THE PORTAL ===
  const portalHeading = page.getByText(/Manage your payment methods/i);
  await expect(portalHeading).toBeVisible();

  // === DELETE A PAYMENT METHOD (idempotent) ===
  const deleteButton = page.getByRole('button', { name: 'Delete' }).first();

  if (await deleteButton.isVisible()) {
    await deleteButton.click();

    const confirmDetachButton = page.locator(
      '[data-test="PaymentInstrumentActionsDetachModalConfirmButton"]'
    );

    await expect(confirmDetachButton).toBeVisible();
    await confirmDetachButton.click();

    // Optional: Wait for modal to go away
    await expect(confirmDetachButton).toBeHidden();
  }
});






// First functioning code version below (kept for reference)

// import { test, expect } from '@playwright/test';

// test.use({ storageState: 'auth.json' });

// test('Changing Profile details', async ({ page }) => {
//   await page.goto('https://staging.wander.com/');
//   await page.getByRole('button').first().click();
//   await page.getByRole('link', { name: 'Profile' }).click();
//   await page.getByRole('heading', { name: 'Personal information' }).click();

//   // --- NAME UPDATE (toggle logic) ---
//   const nameInput = page.getByRole('textbox', { name: 'Name Save' });
//   const currentName = await nameInput.inputValue();

//   let newName;
//   if (currentName.trim().toLowerCase() === 'seth adams') {
//     newName = 'Seth S Adams';
//   } else {
//     newName = 'Seth Adams';
//   }

//   if (currentName !== newName) {
//     await nameInput.fill(newName);

//     const saveButton = page.getByRole('button', { name: 'Save' });
//     await expect(saveButton).toBeEnabled();
//     await saveButton.click();
//   }

//   // Navigate to Stripe Checkout reliably
//   await Promise.all([
//     page.waitForURL('**/p/session/**', { waitUntil: 'load' }),
//     page.getByText('Add, edit and remove payment').click(),
//   ]);

//   // Wait until "Add payment method" becomes visible on the Stripe page
//   await page.getByRole('link', { name: 'Add payment method' }).waitFor();
//   await page.getByRole('link', { name: 'Add payment method' }).click();

//   // Stripe unified card iframe
//   const cardFrame = page.frameLocator('iframe[src*="elements-inner-payment"]');

//   // --- Card number ---
//   const cardNumber = cardFrame.getByRole('textbox', { name: 'Card number' });
//   await cardNumber.click();
//   await cardNumber.fill('');
//   await cardNumber.type('4242 4242 4242 4242');

//   // --- Expiration date (MM / YY) ---
//   const expiry = cardFrame.getByPlaceholder('MM / YY');
//   await expiry.click();
//   await expiry.fill('');
//   await expiry.type('12 / 34');

//   // --- CVC ---
//   const cvc = cardFrame.getByPlaceholder('CVC');
//   await cvc.click();
//   await cvc.fill('');
//   await cvc.type('123');

//   // Sanity checks
//   await expect(cardNumber).toHaveValue(/4242 4242 4242 4242/);
//   await expect(expiry).toHaveValue('12 / 34');
//   await expect(cvc).toHaveValue('123');

//   // --- Confirm / Add card button (outside iframe) ---
//   const confirmButton = page.getByTestId('confirm');
//   await expect(confirmButton).toBeEnabled({ timeout: 10_000 });

//   await Promise.all([
//     page.waitForURL('**/p/session/**/payment-methods', { waitUntil: 'load' }),
//     confirmButton.click(),
//   ]);

//   // ====== DELETE A PAYMENT METHOD ======

// // Ensure we are back on the Stripe portal shell
// const portalHeading = page.getByText(/Manage your payment methods/i);
// await expect(portalHeading).toBeVisible({ timeout: 10_000 });

// // If there are stored methods, a Delete button will exist:
// const rowDeleteButton = page.getByRole('button', { name: 'Delete' }).first();

// if (await rowDeleteButton.isVisible()) {
//   await rowDeleteButton.click();

//   const confirmDetachButton = page.locator(
//     '[data-test="PaymentInstrumentActionsDetachModalConfirmButton"]'
//   );
//   await expect(confirmDetachButton).toBeVisible({ timeout: 10_000 });
//   await confirmDetachButton.click();
// }

//   });

