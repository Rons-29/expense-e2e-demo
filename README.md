# expense-e2e-demo

B2B 風の**経費申請モック**と **Playwright（E2E + API）** の学習・ポートフォリオ用リポジトリです。  
架空アプリであり、特定の商用サービスとは無関係です。

## 含まれるもの

| 層 | 内容 |
|----|------|
| UI | 静的 HTML/JS（`app/`）— ログイン → 経費申請 → 一覧・削除 |
| API | Node HTTP API（`api/`）— 認証・経費 CRUD |
| E2E | Playwright **19本**（POM・クリティカルパス・a11y smoke） |
| APIテスト | Playwright `request` **7本** |
| runn | `runn/` にシナリオ2本（任意・Go要） |
| CI | GitHub Actions |

## クイックスタート

```bash
cd ~/project/expense-e2e-demo
npm install
npx playwright install chromium   # 初回のみ（数分）
```

**速い確認（分割推奨）**

```bash
npm run test:api    # 約10秒・ブラウザ不要
npm run test:e2e    # 約20秒
```

全部まとめて:

```bash
npm test
```

| コマンド | 用途 |
|----------|------|
| `npm start` | UIのみ http://127.0.0.1:4173 |
| `npm run api` | APIのみ http://127.0.0.1:4174 |
| `npm run test:ui` | E2E UIモード |

### デモ用ログイン（UI / API 共通）

| 項目 | 値 |
|------|-----|
| メール | `user@example.com` |
| パスワード | `password` |

## テストピラミッド

詳細: [docs/test-pyramid.md](docs/test-pyramid.md)

## リポジトリ

https://github.com/Rons-29/expense-e2e-demo



## License

MIT
