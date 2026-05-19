# テストピラミッド（このリポジトリ）

| 層 | ツール | 本リポジトリ |
|----|--------|--------------|
| E2E | Playwright（ブラウザ） | `tests/e2e/` — クリティカルパス・UI |
| API | Playwright `request` + **runn** | `tests/api/` + `runn/` |
| a11y smoke | axe-playwright | `tests/e2e/accessibility.spec.ts` |
| Unit | （未実装） | 静的HTMLのため対象外 |

面接での言い方: 「E2Eはユーザーシナリオを厳選。APIは契約とバリデーションを速く回す。runn は LayerX でも使われているツールを学習で入れた」
