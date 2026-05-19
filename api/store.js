/** インメモリ DB（デモ用・プロセス再起動でリセット） */
const users = [{ email: 'user@example.com', password: 'password', name: 'テスト太郎' }];
const tokens = new Map();
const expenses = new Map();

let expenseSeq = 0;

function reset() {
  tokens.clear();
  expenses.clear();
  expenseSeq = 0;
}

function login(email, password) {
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  const token = `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tokens.set(token, user.email);
  if (!expenses.has(user.email)) expenses.set(user.email, []);
  return { token, user: { name: user.name, email: user.email } };
}

function auth(token) {
  if (!token || !tokens.has(token)) return null;
  return tokens.get(token);
}

function listExpenses(email) {
  return expenses.get(email) ?? [];
}

function createExpense(email, { title, amount, category }) {
  const item = {
    id: `exp-${++expenseSeq}`,
    title: String(title).trim(),
    amount: Number(amount),
    category,
    createdAt: new Date().toISOString(),
  };
  const list = expenses.get(email) ?? [];
  list.push(item);
  expenses.set(email, list);
  return item;
}

function deleteExpense(email, id) {
  const list = expenses.get(email) ?? [];
  const next = list.filter((e) => e.id !== id);
  if (next.length === list.length) return false;
  expenses.set(email, next);
  return true;
}

module.exports = { reset, login, auth, listExpenses, createExpense, deleteExpense };
