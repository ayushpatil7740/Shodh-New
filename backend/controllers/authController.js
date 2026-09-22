const { v4: uuidv4 } = require('uuid');
const userStorage = require('../utils/userStorage');

/**
 * POST /api/auth/login
 * Handles login via email/username + password, or admin passcode
 */
async function login(req, res, next) {
  try {
    const { email, username, password, passcode } = req.body;

    const identifier = email || username || '';
    const userPass = password || passcode || '';

    // 1. Quick admin check: if passcode 'admin123' is provided
    if (userPass === 'admin123' && (!identifier || identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@college.edu')) {
      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        token: `demo-token-admin-${Date.now()}`,
        user: {
          id: 'admin-1',
          name: 'Campus Administrator',
          email: 'admin@college.edu',
          username: 'admin',
          role: 'admin'
        }
      });
    }

    if (!identifier && !userPass) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/username and password, or admin passcode.'
      });
    }

    // 2. Check in users.json
    const user = await userStorage.findUserByCredentials(identifier, userPass);

    if (user) {
      // Don't return password in response
      const { password: _, ...safeUser } = user;
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: `demo-token-${user.id}-${Date.now()}`,
        user: safeUser
      });
    }

    // 3. Fallback for demo convenience: if username is admin and pass is admin123
    if ((identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@college.edu') && userPass === 'admin123') {
      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        token: `demo-token-admin-${Date.now()}`,
        user: {
          id: 'admin-1',
          name: 'Campus Administrator',
          email: 'admin@college.edu',
          username: 'admin',
          role: 'admin'
        }
      });
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. For admin evaluation, use admin / admin123'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/register
 * Register a new demo student/faculty account
 */
async function register(req, res, next) {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const users = await userStorage.getUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      username: username ? username.trim().toLowerCase() : email.split('@')[0],
      password: password.trim(),
      role: 'student',
      createdAt: new Date().toISOString()
    };

    await userStorage.createUser(newUser);

    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token: `demo-token-${newUser.id}-${Date.now()}`,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Return current authenticated user profile
 */
async function getMe(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Provide Authorization header.'
      });
    }

    // Default admin mock for demo token
    res.status(200).json({
      success: true,
      user: {
        id: 'admin-1',
        name: 'Campus Administrator',
        email: 'admin@college.edu',
        role: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res) {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

module.exports = {
  login,
  register,
  getMe,
  logout
};
