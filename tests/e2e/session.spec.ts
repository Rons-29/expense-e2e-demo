import { test, expect } from '@playwright/test';
import { login } from './helpers';

test('ログアウトするとログイン画面に戻る', async ({ page }) => {
  await login(page);
  await page.getByTestId('logout-button').click();

  await expect(page.getByTestId('login-section')).toBeVisible();
  await expect(page.getByTestId('app-section')).toBeHidden();
});
