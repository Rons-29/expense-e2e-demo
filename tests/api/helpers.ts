import { APIRequestContext } from '@playwright/test';

export const API_BASE = process.env.API_BASE_URL ?? 'http://127.0.0.1:4174';
export const TEST_USER = { email: 'user@example.com', password: 'password' };

export async function resetApi(request: APIRequestContext) {
  await request.post(`${API_BASE}/api/admin/reset`);
}

export async function loginApi(request: APIRequestContext) {
  const res = await request.post(`${API_BASE}/api/auth/login`, {
    data: TEST_USER,
  });
  return res;
}

export async function getToken(request: APIRequestContext): Promise<string> {
  const res = await loginApi(request);
  const body = await res.json();
  return body.token as string;
}

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}
