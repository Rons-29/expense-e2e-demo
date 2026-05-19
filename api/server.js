const http = require('http');
const store = require('./store');

const PORT = Number(process.env.API_PORT || 4174);

const CATEGORY_LABELS = {
  travel: '旅費交通費',
  supplies: '消耗品費',
  entertainment: '交際費',
};

function send(res, status, body) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };
  if (status === 204) {
    res.writeHead(status, headers);
    return res.end();
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function getToken(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function validateExpense(body) {
  const title = String(body.title ?? '').trim();
  const amount = Number(body.amount);
  const category = body.category;
  if (!title) return { error: '用途を入力してください。', status: 400 };
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: '金額は1円以上で入力してください。', status: 400 };
  }
  if (!CATEGORY_LABELS[category]) {
    return { error: '勘定科目が不正です。', status: 400 };
  }
  return { title, amount, category };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 204, {});
  }

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/api/admin/reset') {
    store.reset();
    return send(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    try {
      const body = await parseBody(req);
      const result = store.login(body.email, body.password);
      if (!result) return send(res, 401, { error: 'メールアドレスまたはパスワードが正しくありません。' });
      return send(res, 200, result);
    } catch {
      return send(res, 400, { error: 'Invalid JSON' });
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return send(res, 200, { status: 'ok' });
  }

  const email = store.auth(getToken(req));
  if (!email) {
    return send(res, 401, { error: 'Unauthorized' });
  }

  if (req.method === 'GET' && url.pathname === '/api/expenses') {
    const items = store.listExpenses(email).map((item) => ({
      ...item,
      categoryLabel: CATEGORY_LABELS[item.category],
    }));
    return send(res, 200, { items });
  }

  if (req.method === 'POST' && url.pathname === '/api/expenses') {
    try {
      const body = await parseBody(req);
      const validated = validateExpense(body);
      if (validated.error) return send(res, validated.status, { error: validated.error });
      const item = store.createExpense(email, validated);
      return send(res, 201, {
        item: { ...item, categoryLabel: CATEGORY_LABELS[item.category] },
      });
    } catch {
      return send(res, 400, { error: 'Invalid JSON' });
    }
  }

  const deleteMatch = url.pathname.match(/^\/api\/expenses\/([^/]+)$/);
  if (req.method === 'DELETE' && deleteMatch) {
    const ok = store.deleteExpense(email, deleteMatch[1]);
    if (!ok) return send(res, 404, { error: 'Not found' });
    return send(res, 204, {});
  }

  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`API listening on http://127.0.0.1:${PORT}`);
});
