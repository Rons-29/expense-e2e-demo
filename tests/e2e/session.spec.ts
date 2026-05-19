import { test, expect } from '@playwright/test';
import { ExpenseAppPage } from '../pages/expense-app.page';

test('ログアウトするとログイン画面に戻る', async ({ page }) => {
  const app = new ExpenseAppPage(page);
  await app.login();
  await app.logout();

  await expect(page.getByTestId('login-section')).toBeVisible();
  await expect(page.getByTestId('app-section')).toBeHidden();
});
