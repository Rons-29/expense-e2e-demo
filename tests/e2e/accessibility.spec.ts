import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ExpenseAppPage } from '../pages/expense-app.page';

test.describe('アクセシビリティ（smoke）', () => {
  test('ログイン画面に重大な a11y 違反がない', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.gotoFresh();

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
  });

  test('申請画面に重大な a11y 違反がない', async ({ page }) => {
    const app = new ExpenseAppPage(page);
    await app.login();

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
  });
});
