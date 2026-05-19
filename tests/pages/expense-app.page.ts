import { Page, expect } from '@playwright/test';

export const TEST_USER = {
  email: 'user@example.com',
  password: 'password',
  name: 'テスト太郎',
};

export type ExpenseInput = {
  title: string;
  amount: string;
  category?: 'travel' | 'supplies' | 'entertainment';
};

/** 経費申請モックの Page Object */
export class ExpenseAppPage {
  constructor(readonly page: Page) {}

  async gotoFresh() {
    await this.page.goto('/?reset=1');
  }

  async login(user = TEST_USER, options: { fresh?: boolean } = {}) {
    if (options.fresh !== false) {
      await this.gotoFresh();
    } else {
      await this.page.goto('/');
    }
    await this.page.getByTestId('email-input').fill(user.email);
    await this.page.getByTestId('password-input').fill(user.password);
    await this.page.getByTestId('login-button').click();
    await expect(this.page.getByTestId('app-section')).toBeVisible();
    await expect(this.page.getByTestId('user-greeting')).toContainText(user.name);
  }

  async submitExpense({ title, amount, category = 'travel' }: ExpenseInput) {
    await this.page.getByTestId('title-input').fill(title);
    await this.page.getByTestId('amount-input').fill(amount);
    await this.page.getByTestId('category-select').selectOption(category);
    await this.page.getByTestId('submit-expense').click();
  }

  expenseItems() {
    return this.page.getByTestId('expense-item');
  }

  async logout() {
    await this.page.getByTestId('logout-button').click();
  }

  async reload() {
    await this.page.reload();
  }
}
