import { Page, expect } from '@playwright/test';

export const TEST_USER = {
  email: 'user@example.com',
  password: 'password',
  name: 'テスト太郎',
};

/** 毎テストで localStorage をリセットしてトップへ */
export async function gotoFresh(page: Page) {
  await page.goto('/?reset=1');
}

export async function login(page: Page) {
  await gotoFresh(page);
  await page.getByTestId('email-input').fill(TEST_USER.email);
  await page.getByTestId('password-input').fill(TEST_USER.password);
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('app-section')).toBeVisible();
  await expect(page.getByTestId('user-greeting')).toContainText(TEST_USER.name);
}
