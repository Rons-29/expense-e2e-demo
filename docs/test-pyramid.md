# テストピラミッド（このリポジトリ）

| 層 | ツール | 本リポジトリ |
|----|--------|--------------|
| E2E | Playwright（ブラウザ） | `tests/e2e/` — クリティカルパス・UI |
| API | Playwright `request` + **runn** | `tests/api/` + `runn/` |
| a11y smoke | axe-playwright | `tests/e2e/accessibility.spec.ts` |
| Unit | （未実装） | 静的HTMLのため対象外 |
