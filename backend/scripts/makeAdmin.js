const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Parse CLI arguments
const arg2 = (process.argv[2] || '').trim();
const arg3 = (process.argv[3] || '').trim();
const arg4 = (process.argv[4] || '').trim();

let email = arg2.toLowerCase();
let password = '';
let explicitMongoUri = '';

// Support flexible arguments:
// node makeAdmin.js <email>
// node makeAdmin.js <email> <password>
// node makeAdmin.js <email> <mongodb_uri>
// node makeAdmin.js <email> <password> <mongodb_uri>
if (arg3.startsWith('mongodb://') || arg3.startsWith('mongodb+srv://')) {
  explicitMongoUri = arg3;
} else if (arg3) {
  password = arg3;
}

if (arg4.startsWith('mongodb://') || arg4.startsWith('mongodb+srv://')) {
  explicitMongoUri = arg4;
}

if (explicitMongoUri) {
  process.env.MONGO_URI = explicitMongoUri;
}

// Load .env from backend directory or project root if not already set
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
  if (!email) {
    console.log('\n======================================================');
    console.log('👑 Shodh Admin Provisioning Tool');
    console.log('======================================================');
    console.error('❌ Error: No email address provided.\n');
    console.log('Usage:');
    console.log('  node backend/scripts/makeAdmin.js <email> [password] [mongodb_uri]');
    console.log('Examples:');
    console.log('  node backend/scripts/makeAdmin.js ayushpatil7740@gmail.com');
    console.log('  node backend/scripts/makeAdmin.js ayushpatil7740@gmail.com mypassword123');
    console.log('  node backend/scripts/makeAdmin.js ayushpatil7740@gmail.com mypassword123 "mongodb+srv://..."\n');
    process.exit(1);
  }

  const hasMongoUri = !!(process.env.MONGO_URI || process.env.MONGODB_URI);

  console.log('\n======================================================');
  console.log(`👑 Shodh Admin Setup: ${email}`);
  console.log('======================================================');
  console.log(`🔍 Connecting to database (${hasMongoUri ? 'MongoDB Atlas' : 'Local Storage'})...`);

  await connectDB();

  let user = await User.findOne({ email });

  if (user) {
    // Existing user: promote to Admin
    user.role = 'admin';
    if (password) {
      user.password = password;
      user.authProvider = 'local';
    }
    await user.save();

    console.log('\n======================================================');
    console.log(`🎉 SUCCESS: Existing user promoted to ADMIN!`);
    console.log('======================================================');
    console.log(`👤 Name:     ${user.name}`);
    console.log(`📧 Email:    ${user.email}`);
    console.log(`👑 Role:     ${user.role}`);
    console.log(`🔑 Provider: ${user.authProvider || 'local'}`);
    console.log('======================================================\n');
  } else {
    // User does not exist yet: auto-create the Admin account!
    const defaultName =
      email === 'ayushpatil7740@gmail.com'
        ? 'Ayush Patil'
        : email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const adminPassword = password || 'AdminPassword123';

    user = await User.create({
      name: defaultName,
      email,
      password: adminPassword,
      role: 'admin',
      authProvider: 'local',
      bio: 'Project Lead & System Administrator',
    });

    console.log('\n======================================================');
    console.log(`🎉 SUCCESS: Brand new ADMIN account created!`);
    console.log('======================================================');
    console.log(`👤 Name:     ${user.name}`);
    console.log(`📧 Email:    ${user.email}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👑 Role:     ${user.role}`);
    console.log(`🔑 Provider: local (also eligible for Google OAuth)`);
    console.log('======================================================');
    console.log(`💡 You can now log in at /login with this email and password,`);
    console.log(`   or click "Continue with Google" using this email address.\n`);
  }

  if (!hasMongoUri) {
    console.log('ℹ️ [Atlas Notice]:');
    console.log('  Because MONGO_URI is not currently set in a local backend/.env file,');
    console.log('  this account was saved to your local storage.');
    console.log('  To apply directly to your live production MongoDB Atlas database:');
    console.log('  Option 1: Add your Atlas MONGO_URI to backend/.env:');
    console.log('            MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/shodh_db?retryWrites=true&w=majority');
    console.log('            Then run: node backend/scripts/makeAdmin.js ' + email);
    console.log('  Option 2: Pass your Atlas URI in the command:');
    console.log('            node backend/scripts/makeAdmin.js ' + email + ' "MyPass123" "mongodb+srv://..."');
    console.log('  Option 3: In MongoDB Atlas Web UI (Browse Collections -> users):');
    console.log(`            db.users.updateOne({ email: "${email}" }, { $set: { role: "admin" } }, { upsert: true })\n`);
  }

  await disconnectDB();
  process.exit(0);
}

makeAdmin().catch(async (err) => {
  console.error('\n❌ Error provisioning admin account:', err.message);
  await disconnectDB();
  process.exit(1);
});
