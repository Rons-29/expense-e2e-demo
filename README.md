# expense-e2e-demo

B2B 風の**経費申請モック**と **Playwright E2E** の学習・ポートフォリオ用リポジトリです。  
架空アプリであり、特定の商用サービスとは無関係です。

## 含まれるもの

| 項目 | 内容 |
|------|------|
| デモアプリ | 静的 HTML + JS（ログイン → 経費申請 → 一覧・削除） |
| E2E | Playwright **17本**（Page Object + クリティカルパス） |
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

## テスト一覧（17本）

| グループ | 内容 |
|----------|------|
| **クリティカルパス** | ログイン → 申請 → 削除 → ログアウト（1本） |
| **ログイン** | 画面表示、誤認証、パスワード誤り、成功 |
| **経費申請** | 登録、勘定科目3種、フォームリセット、用途/金額バリデーション、複数件、部分削除 |
| **永続化** | リロード後のセッション・一覧、再ログイン後のデータ残存 |
| **セッション** | ログアウト |

構成: `tests/pages/expense-app.page.ts`（Page Object）+ `tests/e2e/*.spec.ts`

## リポジトリ

https://github.com/Rons-29/expense-e2e-demo

## 設計メモ（面接・ブログ用）

- E2E は**ログイン → 申請 → 一覧**のクリティカルパスを1本で担保
- `data-testid` でセレクタを安定化
- 本番相当では E2E は厳選し、API / コンポーネントテストと役割分担する（テストピラミッド）

## License

MIT（必要に応じて変更してください）
