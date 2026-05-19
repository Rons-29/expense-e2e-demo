import { test, expect } from '@playwright/test';
import { ExpenseAppPage, TEST_USER } from '../pages/expense-app.page';

test.describe('データ永続化', () => {
  test('リロード後もログイン状態と申請一覧が維持される', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.login();
    await app.submitExpense({ title: 'リロード確認', amount: '999' });

    await app.reload();

    await expect(page.getByTestId('app-section')).toBeVisible();
    await expect(app.expenseItems()).toHaveCount(1);
    await expect(app.expenseItems().first()).toContainText('リロード確認');
  });

  test('ログアウト後に再ログインすると申請データは残る', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.login();
    await app.submitExpense({ title: '再ログイン後も残る', amount: '1500' });
    await app.logout();

    await expect(page.getByTestId('login-section')).toBeVisible();

    await app.login(TEST_USER, { fresh: false });
    await expect(app.expenseItems()).toHaveCount(1);
    await expect(app.expenseItems().first()).toContainText('再ログイン後も残る');
  });
});
