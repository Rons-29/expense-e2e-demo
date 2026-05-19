const STORAGE_KEY = 'expense-mock-expenses';

const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const userNameEl = document.getElementById('user-name');
const logoutButton = document.getElementById('logout-button');
const expenseForm = document.getElementById('expense-form');
const formError = document.getElementById('form-error');
const expenseList = document.getElementById('expense-list');
const emptyMessage = document.getElementById('empty-message');

const VALID_USER = { email: 'user@example.com', password: 'password', name: 'テスト太郎' };

const categoryLabels = {
  travel: '旅費交通費',
  supplies: '消耗品費',
  entertainment: '交際費',
};

function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveExpenses(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function showLogin() {
  loginSection.hidden = false;
  appSection.hidden = true;
  loginError.hidden = true;
  expenseForm.reset();
}

function showApp(name) {
  loginSection.hidden = true;
  appSection.hidden = false;
  userNameEl.textContent = name;
  renderExpenses();
}

function renderExpenses() {
  const items = loadExpenses();
  expenseList.innerHTML = '';
  emptyMessage.hidden = items.length > 0;

  items.forEach((item) => {
    const li = document.createElement('li');
    li.dataset.testid = 'expense-item';
    li.dataset.id = item.id;
    li.innerHTML = `
      <div>
        <strong data-testid="expense-title">${escapeHtml(item.title)}</strong>
        <div class="expense-meta">
          <span data-testid="expense-amount">${item.amount.toLocaleString()}円</span>
          · <span data-testid="expense-category">${categoryLabels[item.category] || item.category}</span>
        </div>
      </div>
      <button type="button" class="delete-btn" data-testid="delete-expense">削除</button>
    `;
    li.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(item.id));
    expenseList.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function deleteExpense(id) {
  const next = loadExpenses().filter((e) => e.id !== id);
  saveExpenses(next);
  renderExpenses();
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (email === VALID_USER.email && password === VALID_USER.password) {
    showApp(VALID_USER.name);
    return;
  }

  loginError.textContent = 'メールアドレスまたはパスワードが正しくありません。';
  loginError.hidden = false;
});

logoutButton.addEventListener('click', () => {
  showLogin();
});

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formError.hidden = true;

  const title = document.getElementById('title').value.trim();
  const amount = Number(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if (!title) {
    formError.textContent = '用途を入力してください。';
    formError.hidden = false;
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    formError.textContent = '金額は1円以上で入力してください。';
    formError.hidden = false;
    return;
  }

  const items = loadExpenses();
  items.push({
    id: crypto.randomUUID(),
    title,
    amount,
    category,
    createdAt: new Date().toISOString(),
  });
  saveExpenses(items);
  expenseForm.reset();
  renderExpenses();
});

// デモ用: 毎回同じ初期状態にしたい場合は localStorage をクリア可能
if (new URLSearchParams(location.search).get('reset') === '1') {
  localStorage.removeItem(STORAGE_KEY);
}

showLogin();
