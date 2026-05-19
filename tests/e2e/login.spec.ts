import { test, expect } from '@playwright/test';
import { ExpenseAppPage, TEST_USER } from '../pages/expense-app.page';

test.describe('ログイン', () => {
  test('ログイン画面が表示される', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.gotoFresh();
    await expect(page.getByTestId('login-section')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();
    await expect(page.getByTestId('app-section')).toBeHidden();
  });

  test('誤った認証情報でエラーが表示される', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.gotoFresh();
    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('wrong');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toHaveText(
      'メールアドレスまたはパスワードが正しくありません。'
    );
    await expect(page.getByTestId('app-section')).toBeHidden();
  });

  test('パスワードのみ誤りのときもログインできない', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.gotoFresh();
    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill('not-the-password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('app-section')).toBeHidden();
  });

  test('正しい認証情報で申請画面に遷移する', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.login();
    await expect(page.getByTestId('expense-form')).toBeVisible();
    await expect(page.getByTestId('empty-message')).toBeVisible();
  });
});
