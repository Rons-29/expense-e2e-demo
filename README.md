# expense-e2e-demo

B2B 風の**経費申請モック**と **Playwright E2E** の学習・ポートフォリオ用リポジトリです。  
架空アプリであり、特定の商用サービスとは無関係です。

## 含まれるもの

| 項目 | 内容 |
|------|------|
| デモアプリ | 静的 HTML + JS（ログイン → 経費申請 → 一覧・削除） |
| E2E | Playwright 7本 |
| CI | GitHub Actions（`main` push / PR） |

## クイックスタート

```bash
cd ~/project/expense-e2e-demo
npm install
npx playwright install chromium
npm test
```

UIモード:

```bash
npm run test:ui
```

アプリのみ:

```bash
npm start
# http://127.0.0.1:4173
```

### デモ用ログイン

| 項目 | 値 |
|------|-----|
| メール | `user@example.com` |
| パスワード | `password` |

## テスト一覧

- ログイン画面表示 / 認証エラー / ログイン成功
- 経費申請 → 一覧表示
- 金額バリデーション
- 申請削除
- ログアウト

## リポジトリ

https://github.com/Rons-29/expense-e2e-demo

## 設計メモ（面接・ブログ用）

- E2E は**ログイン → 申請 → 一覧**のクリティカルパスを1本で担保
- `data-testid` でセレクタを安定化
- 本番相当では E2E は厳選し、API / コンポーネントテストと役割分担する（テストピラミッド）

## License

MIT（必要に応じて変更してください）
