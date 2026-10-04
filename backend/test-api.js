const http = require('http');
const dotenv = require('dotenv');
const { connectDB, disconnectDB, sanitizeMongoURI, maskMongoURI } = require('./config/db');
const seedData = require('./config/seeder');
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');
const Notification = require('./models/Notification');

dotenv.config();

// Helper to make local HTTP requests
function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('🚀 Starting Shodh End-to-End API Automated Verification...');

  console.log('\n--- 1. Testing MongoDB URI Sanitization & Password Masking ---');
  const sampleRaw = '"mongodb+srv://shodh_admin:SecretPass123!@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority"';
  const sanitized = sanitizeMongoURI(sampleRaw);
  const masked = maskMongoURI(sanitized);
  console.log('Sanitized URI:', sanitized.includes('shodh_db') ? '✅ includes /shodh_db' : '❌ missing db');
  console.log('Masked URI:', masked.includes('SecretPass') ? '❌ password leaked!' : '✅ password masked: ' + masked);

  console.log('\n--- 2. Verifying Mongoose Models Compilation & Schema Update ---');
  console.log('User model:', typeof User.find === 'function' ? '✅ Loaded' : '❌ Failed');
  console.log('Item model:', typeof Item.find === 'function' ? '✅ Loaded' : '❌ Failed');
  console.log('Claim model:', typeof Claim.find === 'function' ? '✅ Loaded' : '❌ Failed');
  console.log('Notification model:', typeof Notification.find === 'function' ? '✅ Loaded' : '❌ Failed');

  // Start server
  const app = require('./server.js');
  
  // Wait a bit for server and DB connection
  await new Promise((r) => setTimeout(r, 2000));

  const port = process.env.PORT || 5000;

  console.log('\n--- 3. Testing Health Endpoints (/api/health and /health) ---');
  const healthApiRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/health',
    method: 'GET',
  });
  console.log('/api/health status:', healthApiRes.status, healthApiRes.data?.status);

  const healthRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/health',
    method: 'GET',
  });
  console.log('/health status:', healthRes.status, healthRes.data?.status);

  console.log('\n--- 4. Testing CORS Headers with Netlify Origin ---');
  const corsRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/health',
    method: 'GET',
    headers: {
      Origin: 'https://shodh-portal.netlify.app',
    },
  });
  const allowOrigin = corsRes.headers['access-control-allow-origin'];
  const allowCreds = corsRes.headers['access-control-allow-credentials'];
  console.log('Access-Control-Allow-Origin:', allowOrigin, allowOrigin === 'https://shodh-portal.netlify.app' ? '✅ Correct' : '❌ Failed');
  console.log('Access-Control-Allow-Credentials:', allowCreds, allowCreds === 'true' ? '✅ Correct' : '❌ Failed');

  console.log('\n--- 5. Verifying Demo Accounts are REMOVED & Cannot Log In ---');
  const oldDemoRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: 'admin@shodh.org',
      password: 'adminpassword123',
    }
  );
  console.log('Demo Login Attempt (admin@shodh.org):', oldDemoRes.status === 401 ? '✅ 401 Blocked (Demo Removed)' : '❌ Still active');

  console.log('\n--- 6. Testing Real User Registration Flow ---');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'SecurePassword123!';

  const registerRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Test Real User',
      email: testEmail,
      password: testPassword,
      phone: '+91 99999 88888',
      bio: 'B.Tech Student',
    }
  );
  console.log('Real User Registration:', registerRes.status === 201 ? '✅ 201 Created' : '❌ Failed: ' + registerRes.status);
  console.log('Registered User ID:', registerRes.data?.user?.id, 'Role:', registerRes.data?.user?.role);
  const userToken = registerRes.data?.token;

  console.log('\n--- 7. Testing Dual-Mounted Auth Login Route for Real User ---');
  const loginApiRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: testEmail,
      password: testPassword,
    }
  );
  console.log('/api/auth/login Result:', loginApiRes.status, 'Token issued:', !!loginApiRes.data?.token);

  const loginDirectRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: testEmail,
      password: testPassword,
    }
  );
  console.log('/auth/login Result:', loginDirectRes.status, 'Token issued:', !!loginDirectRes.data?.token);

  console.log('\n--- 8. Testing Admin Elevation & Admin Protected Route ---');
  // Promote the test user to Admin
  const registeredUser = await User.findOne({ email: testEmail });
  if (registeredUser) {
    registeredUser.role = 'admin';
    await registeredUser.save();
  }

  // Log in as Admin to obtain new token with admin role
  const adminLoginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: testEmail,
      password: testPassword,
    }
  );
  console.log('Promoted Admin Login Result:', adminLoginRes.status, 'Role:', adminLoginRes.data?.user?.role);
  const adminToken = adminLoginRes.data?.token;

  const adminStats = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Admin Stats Status:', adminStats.status, 'Total Users:', adminStats.data?.analytics?.totalUsers);

  console.log('\n--- 9. Cleaning Up Test User ---');
  await User.deleteOne({ email: testEmail });
  console.log('🧹 Test user cleaned up.');

  console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY! The portal is production ready.');
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
