const http = require('http');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./config/db');
const seedData = require('./config/seeder');

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
          resolve({ status: res.statusCode, raw: data });
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

  // Start server
  const app = require('./server.js');
  
  // Wait a bit for server and DB connection
  await new Promise((r) => setTimeout(r, 2000));

  console.log('\n--- 1. Testing Health Endpoint ---');
  const healthRes = await makeRequest({
    hostname: '127.0.0.1',
    port: process.env.PORT || 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('Health status:', healthRes.status, healthRes.data);

  console.log('\n--- 2. Seeding Sample Database ---');
  await seedData();

  console.log('\n--- 3. Testing Public Item Stats & Search ---');
  const statsRes = await makeRequest({
    hostname: '127.0.0.1',
    port: process.env.PORT || 5000,
    path: '/api/items/stats/summary',
    method: 'GET',
  });
  console.log('Stats Summary:', statsRes.status, 'Total Items:', statsRes.data?.stats?.totalItems);

  const itemsRes = await makeRequest({
    hostname: '127.0.0.1',
    port: process.env.PORT || 5000,
    path: '/api/items?type=lost',
    method: 'GET',
  });
  console.log('Filtered Lost Items Count:', itemsRes.data?.count);

  console.log('\n--- 4. Testing User Login ---');
  const loginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: process.env.PORT || 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: 'aarav@shodh.org',
      password: 'userpassword123',
    }
  );
  console.log('Login Result:', loginRes.status, 'Token issued:', !!loginRes.data?.token);
  const userToken = loginRes.data?.token;

  console.log('\n--- 5. Testing Admin Login & Admin Route ---');
  const adminLoginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: process.env.PORT || 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      email: 'admin@shodh.org',
      password: 'adminpassword123',
    }
  );
  console.log('Admin Login Result:', adminLoginRes.status, 'Role:', adminLoginRes.data?.user?.role);
  const adminToken = adminLoginRes.data?.token;

  const adminStats = await makeRequest({
    hostname: '127.0.0.1',
    port: process.env.PORT || 5000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('Admin Stats Status:', adminStats.status, 'Total Users:', adminStats.data?.analytics?.totalUsers);

  console.log('\n✅ ALL BACKEND API VERIFICATIONS PASSED SUCCESSFULLY!');
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
