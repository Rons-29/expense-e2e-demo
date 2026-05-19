import { test, expect } from '@playwright/test';
import { ExpenseAppPage } from '../pages/expense-app.page';

/**
 * E2Eシナリオテスト: 顧客が行うクリティカルパスを1本で通す。
 * （LayerX のテストピラミッドで E2E に置くイメージの代表例）
 */
test('クリティカルパス: ログイン → 経費申請 → 一覧確認 → 削除 → ログアウト', async ({ page }) => {
  const app = new ExpenseAppPage(page);
  await app.gotoFresh();

  // ログイン
  await page.getByTestId('email-input').fill('user@example.com');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('user-greeting')).toContainText('テスト太郎');

  // 申請
  await app.submitExpense({
    title: '取引先打合せ 交通費',
    amount: '1280',
    category: 'travel',
  });
  const row = app.expenseItems().first();
  await expect(row).toContainText('取引先打合せ 交通費');
  await expect(row.getByTestId('expense-amount')).toHaveText('1,280円');

  // 削除
  await row.getByTestId('delete-expense').click();
  await expect(page.getByTestId('empty-message')).toBeVisible();

  // ログアウト
  await app.logout();
  await expect(page.getByTestId('login-section')).toBeVisible();
});
