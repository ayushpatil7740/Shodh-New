const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

let userWriteQueue = Promise.resolve();

function ensureUsersFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: 'admin-1',
        name: 'Campus Administrator',
        email: 'admin@college.edu',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user-1',
        name: 'Rahul Sharma',
        email: 'student@college.edu',
        username: 'student',
        password: 'student123',
        role: 'student',
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf8');
  }
}

async function getUsers() {
  ensureUsersFile();
  try {
    const raw = await fs.promises.readFile(USERS_FILE, 'utf8');
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users.json:', err.message);
    return [];
  }
}

async function saveUsers(users) {
  ensureUsersFile();
  userWriteQueue = userWriteQueue.then(async () => {
    const jsonContent = JSON.stringify(users, null, 2);
    const tempFile = path.join(DATA_DIR, `users.${Date.now()}.${Math.random().toString(36).substring(2, 8)}.tmp`);
    try {
      await fs.promises.writeFile(tempFile, jsonContent, 'utf8');
      await fs.promises.rename(tempFile, USERS_FILE);
    } catch (renameErr) {
      try {
        await fs.promises.writeFile(USERS_FILE, jsonContent, 'utf8');
      } catch (directErr) {
        console.error('Failed to write users.json:', directErr.message);
        throw directErr;
      }
    } finally {
      if (fs.existsSync(tempFile)) {
        try { await fs.promises.unlink(tempFile); } catch (_) {}
      }
    }
  });
  return userWriteQueue;
}

async function findUserByCredentials(identifier, password) {
  const users = await getUsers();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  return users.find((u) => {
    const emailMatch = (u.email || '').toLowerCase() === cleanId;
    const usernameMatch = (u.username || '').toLowerCase() === cleanId;
    const passwordMatch = u.password === cleanPass;
    return (emailMatch || usernameMatch) && passwordMatch;
  });
}

async function createUser(userData) {
  const users = await getUsers();
  users.push(userData);
  await saveUsers(users);
  return userData;
}

module.exports = {
  getUsers,
  findUserByCredentials,
  createUser
};
