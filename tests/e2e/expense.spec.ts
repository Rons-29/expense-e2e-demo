import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('経費申請', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('経費を申請すると一覧に表示される', async ({ page }) => {
    await page.getByTestId('title-input').fill('新宿〜渋谷 交通費');
    await page.getByTestId('amount-input').fill('480');
    await page.getByTestId('category-select').selectOption('travel');
    await page.getByTestId('submit-expense').click();

    const item = page.getByTestId('expense-item').first();
    await expect(item.getByTestId('expense-title')).toHaveText('新宿〜渋谷 交通費');
    await expect(item.getByTestId('expense-amount')).toHaveText('480円');
    await expect(item.getByTestId('expense-category')).toHaveText('旅費交通費');
    await expect(page.getByTestId('empty-message')).toBeHidden();
  });

  test('金額が未入力・0以下のときバリデーションエラー', async ({ page }) => {
    await page.getByTestId('title-input').fill('会議費');
    await page.getByTestId('amount-input').fill('0');
    await page.getByTestId('submit-expense').click();

    await expect(page.getByTestId('form-error')).toBeVisible();
    await expect(page.getByTestId('form-error')).toHaveText('金額は1円以上で入力してください。');
    await expect(page.getByTestId('expense-item')).toHaveCount(0);
  });

  test('申請を削除できる', async ({ page }) => {
    await page.getByTestId('title-input').fill('消耗品');
    await page.getByTestId('amount-input').fill('1200');
    await page.getByTestId('submit-expense').click();
    await expect(page.getByTestId('expense-item')).toHaveCount(1);

    await page.getByTestId('delete-expense').click();
    await expect(page.getByTestId('expense-item')).toHaveCount(0);
    await expect(page.getByTestId('empty-message')).toBeVisible();
  });
});
