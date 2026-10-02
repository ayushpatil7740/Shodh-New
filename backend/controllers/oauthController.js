const jwt = require('jsonwebtoken');

// Generate JWT token matching authController standard
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'shodh_super_secret_jwt_key_2026_change_in_production',
    {
      expiresIn: '30d',
    }
  );
};

// Handle successful Google authentication callback
const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login?error=' + encodeURIComponent('Authentication failed with Google'));
    }

    const token = generateToken(req.user._id);

    const safeUser = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      avatar: req.user.avatar || '',
      bio: req.user.bio || '',
      role: req.user.role || 'user',
      createdAt: req.user.createdAt,
    };

    // Attach token as cookies for flexibility
    res.cookie('shodh_token', token, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    res.cookie('token', token, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    // Determine frontend redirect destination
    const targetUrl = '/dashboard';

    // Send an immediate browser bridge that sets localStorage and navigates to the dashboard
    // This allows the existing React frontend to receive the token with zero frontend file changes!
    const htmlResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authenticating with Google...</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f8fafc;
      color: #0f172a;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #0d9488;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <p style="font-weight: 600; font-size: 15px;">Completing Google Sign-In, please wait...</p>
  <script>
    try {
      localStorage.setItem('shodh_token', ${JSON.stringify(token)});
      localStorage.setItem('shodh_user', JSON.stringify(${JSON.stringify(safeUser)}));
    } catch (e) {
      console.error('Storage error:', e);
    }
    window.location.replace('${targetUrl}?token=' + encodeURIComponent(${JSON.stringify(token)}));
  </script>
</body>
</html>`;

    res.status(200).send(htmlResponse);
  } catch (error) {
    console.error('Google Callback Controller Error:', error);
    res.redirect('/login?error=' + encodeURIComponent('Failed to process Google sign-in'));
  }
};

module.exports = {
  googleCallback,
};
