import { test, expect } from '@playwright/test';
import {
  API_BASE,
  TEST_USER,
  resetApi,
  loginApi,
  getToken,
  authHeaders,
} from './helpers';

test.describe('Expense API', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ request }) => {
    await resetApi(request);
  });

  test('GET /api/health は 200', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/health`);
    expect(res.status()).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: 'ok' });
  });

  test('POST /api/auth/login 成功で token を返す', async ({ request }) => {
    const res = await loginApi(request);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toBeTruthy();
    expect(body.user.name).toBe('テスト太郎');
  });

  test('POST /api/auth/login 失敗で 401', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/auth/login`, {
      data: { email: 'wrong@example.com', password: 'x' },
    });
    expect(res.status()).toBe(401);
  });

  test('認証なしで GET /api/expenses は 401', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/expenses`);
    expect(res.status()).toBe(401);
  });

  test('POST /api/expenses で作成し GET で取得できる', async ({ request }) => {
    const token = await getToken(request);

    const create = await request.post(`${API_BASE}/api/expenses`, {
      headers: authHeaders(token),
      data: { title: 'API交通費', amount: 600, category: 'travel' },
    });
    expect(create.status()).toBe(201);
    const created = await create.json();
    expect(created.item.title).toBe('API交通費');
    expect(created.item.categoryLabel).toBe('旅費交通費');

    const list = await request.get(`${API_BASE}/api/expenses`, {
      headers: authHeaders(token),
    });
    expect(list.status()).toBe(200);
    const { items } = await list.json();
    expect(items).toHaveLength(1);
    expect(items[0].amount).toBe(600);
  });

  test('金額0で POST /api/expenses は 400', async ({ request }) => {
    const token = await getToken(request);
    const res = await request.post(`${API_BASE}/api/expenses`, {
      headers: authHeaders(token),
      data: { title: '会議費', amount: 0, category: 'supplies' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('金額');
  });

  test('DELETE /api/expenses/:id で削除できる', async ({ request }) => {
    const token = await getToken(request);
    const create = await request.post(`${API_BASE}/api/expenses`, {
      headers: authHeaders(token),
      data: { title: '削除対象', amount: 100, category: 'travel' },
    });
    const { item } = await create.json();

    const del = await request.delete(`${API_BASE}/api/expenses/${item.id}`, {
      headers: authHeaders(token),
    });
    expect(del.status()).toBe(204);

    const list = await request.get(`${API_BASE}/api/expenses`, {
      headers: authHeaders(token),
    });
    const { items } = await list.json();
    expect(items).toHaveLength(0);
  });
});
