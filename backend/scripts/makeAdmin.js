const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Check potential locations for .env file
const envPaths = [
  path.join(__dirname, '..', '.env'),
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'backend', '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');

async function makeAdmin() {
  const email = (process.argv[2] || '').trim().toLowerCase();

  if (!email) {
    console.log('\n======================================================');
    console.log('👑 Shodh Admin Provisioning Tool');
    console.log('======================================================');
    console.error('❌ Error: No email address provided.\n');
    console.log('Usage:');
    console.log('  node backend/scripts/makeAdmin.js <user-email>');
    console.log('  or: npm run make-admin <user-email>\n');
    console.log('Example:');
    console.log('  node backend/scripts/makeAdmin.js realuser@gmail.com\n');
    process.exit(1);
  }

  console.log(`\n🔍 Connecting to database to locate user: ${email}...`);
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    console.error(`\n❌ User not found with email: ${email}`);
    console.log('💡 Note: The user must first create an account on Shodh (or sign in once with Google),');
    console.log('   then you can run this script to elevate their account to an Admin.\n');
    await disconnectDB();
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();

  console.log('\n======================================================');
  console.log(`🎉 SUCCESS: User promoted to ADMIN!`);
  console.log('======================================================');
  console.log(`👤 Name:     ${user.name}`);
  console.log(`📧 Email:    ${user.email}`);
  console.log(`👑 Role:     ${user.role}`);
  console.log(`🔑 Provider: ${user.authProvider || 'local'}`);
  console.log('======================================================\n');

  await disconnectDB();
  process.exit(0);
}

makeAdmin().catch(async (err) => {
  console.error('\n❌ Failed to promote user:', err.message);
  await disconnectDB();
  process.exit(1);
});
