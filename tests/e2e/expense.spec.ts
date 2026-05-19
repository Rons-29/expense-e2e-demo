import { test, expect } from '@playwright/test';
import { ExpenseAppPage } from '../pages/expense-app.page';

test.describe('経費申請', () => {
  let app: ExpenseAppPage;

  test.beforeEach(async ({ page }) => {
    app = new ExpenseAppPage(page);
    await app.login();
  });

  test('経費を申請すると一覧に表示される', async ({ page }) => {
    await app.submitExpense({ title: '新宿〜渋谷 交通費', amount: '480', category: 'travel' });

    const item = app.expenseItems().first();
    await expect(item.getByTestId('expense-title')).toHaveText('新宿〜渋谷 交通費');
    await expect(item.getByTestId('expense-amount')).toHaveText('480円');
    await expect(item.getByTestId('expense-category')).toHaveText('旅費交通費');
    await expect(page.getByTestId('empty-message')).toBeHidden();
  });

  test('勘定科目ごとにラベルが正しく表示される', async ({ page }) => {
    const cases = [
      { category: 'travel' as const, label: '旅費交通費', title: 'タクシー' },
      { category: 'supplies' as const, label: '消耗品費', title: '文房具' },
      { category: 'entertainment' as const, label: '交際費', title: '会食' },
    ];

    for (const { category, label, title } of cases) {
      await app.submitExpense({ title, amount: '1000', category });
    }

    await expect(app.expenseItems()).toHaveCount(3);
    await expect(app.expenseItems().filter({ hasText: '旅費交通費' })).toHaveCount(1);
    await expect(app.expenseItems().filter({ hasText: '消耗品費' })).toHaveCount(1);
    await expect(app.expenseItems().filter({ hasText: '交際費' })).toHaveCount(1);
  });

  test('申請成功後にフォームがリセットされる', async ({ page }) => {
    await app.submitExpense({ title: '交通費', amount: '500' });

    await expect(page.getByTestId('title-input')).toHaveValue('');
    await expect(page.getByTestId('amount-input')).toHaveValue('');
    await expect(page.getByTestId('form-error')).toBeHidden();
  });

  test('用途が空のときバリデーションエラー', async ({ page }) => {
    await page.getByTestId('amount-input').fill('100');
    await page.getByTestId('submit-expense').click();

    await expect(page.getByTestId('form-error')).toBeVisible();
    await expect(page.getByTestId('form-error')).toHaveText('用途を入力してください。');
    await expect(app.expenseItems()).toHaveCount(0);
  });

  test('金額が0以下のときバリデーションエラー', async ({ page }) => {
    await app.submitExpense({ title: '会議費', amount: '0' });

    await expect(page.getByTestId('form-error')).toBeVisible();
    await expect(page.getByTestId('form-error')).toHaveText('金額は1円以上で入力してください。');
    await expect(app.expenseItems()).toHaveCount(0);
  });

  test('金額が負数のときバリデーションエラー', async ({ page }) => {
    await app.submitExpense({ title: '会議費', amount: '-100' });

    await expect(page.getByTestId('form-error')).toHaveText('金額は1円以上で入力してください。');
    await expect(app.expenseItems()).toHaveCount(0);
  });

  test('複数申請を登録できる', async ({ page }) => {
    await app.submitExpense({ title: '交通費A', amount: '300' });
    await app.submitExpense({ title: '交通費B', amount: '450' });

    await expect(app.expenseItems()).toHaveCount(2);
    await expect(page.getByTestId('empty-message')).toBeHidden();
  });

  test('複数件あるとき1件だけ削除できる', async ({ page }) => {
    await app.submitExpense({ title: '残す', amount: '100' });
    await app.submitExpense({ title: '消す', amount: '200' });

    await app.expenseItems().filter({ hasText: '消す' }).getByTestId('delete-expense').click();

    await expect(app.expenseItems()).toHaveCount(1);
    await expect(app.expenseItems().first()).toContainText('残す');
  });

  test('最後の1件を削除すると空メッセージが表示される', async ({ page }) => {
    await app.submitExpense({ title: '消耗品', amount: '1200' });
    await app.expenseItems().getByTestId('delete-expense').click();

    await expect(app.expenseItems()).toHaveCount(0);
    await expect(page.getByTestId('empty-message')).toBeVisible();
  });
});
