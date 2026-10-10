const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Parse CLI arguments
const emailArg = (process.argv[2] || '').trim().toLowerCase();
const passwordArg = (process.argv[3] || '').trim();
const mongoUriArg = (process.argv[4] || '').trim();

if (mongoUriArg && (mongoUriArg.startsWith('mongodb://') || mongoUriArg.startsWith('mongodb+srv://'))) {
  process.env.MONGO_URI = mongoUriArg;
}

// Load .env
const envPaths = [
  path.join(__dirname, '..', '.env'),
  path.join(process.cwd(), 'backend', '.env'),
  path.join(process.cwd(), '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');

async function resetPassword() {
  if (!emailArg || !passwordArg) {
    console.log('\n======================================================');
    console.log('🔑 Shodh Password Reset Tool');
    console.log('======================================================');
    console.error('❌ Error: Both email and new password are required.\n');
    console.log('Usage:');
    console.log('  node backend/scripts/resetPassword.js <user-email> <new-password> [mongodb-uri]\n');
    console.log('Examples:');
    console.log('  node backend/scripts/resetPassword.js ayushpatil7740@gmail.com MyNewPassword123');
    console.log('  node backend/scripts/resetPassword.js ayushpatil7740@gmail.com MyNewPassword123 "mongodb+srv://..."\n');
    process.exit(1);
  }

  const hasMongoUri = !!(process.env.MONGO_URI || process.env.MONGODB_URI);

  console.log('\n======================================================');
  console.log(`🔑 Resetting Password for: ${emailArg}`);
  console.log('======================================================');
  console.log(`🔍 Connecting to database (${hasMongoUri ? 'MongoDB Atlas' : 'Local Storage'})...`);

  await connectDB();

  let user = await User.findOne({ email: emailArg });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordArg, salt);

  if (!user) {
    // If user does not exist, create them with this password
    const defaultName =
      emailArg === 'ayushpatil7740@gmail.com'
        ? 'Ayush Patil'
        : emailArg.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    user = await User.create({
      name: defaultName,
      email: emailArg,
      password: hashedPassword,
      role: emailArg === 'ayushpatil7740@gmail.com' ? 'admin' : 'user',
      authProvider: 'local',
    });

    console.log('\n======================================================');
    console.log(`🎉 SUCCESS: User account created with new password!`);
    console.log('======================================================');
  } else {
    user.password = hashedPassword;
    user.authProvider = 'local';
    user.isPasswordModified = true;
    await user.save();

    console.log('\n======================================================');
    console.log(`🎉 SUCCESS: Password successfully updated!`);
    console.log('======================================================');
  }

  console.log(`👤 Name:     ${user.name}`);
  console.log(`📧 Email:    ${user.email}`);
  console.log(`🔑 Password: ${passwordArg}`);
  console.log(`👑 Role:     ${user.role}`);
  console.log('======================================================');
  console.log(`💡 You can now log in at /login with this email and password!\n`);

  await disconnectDB();
  process.exit(0);
}

resetPassword().catch(async (err) => {
  console.error('\n❌ Error resetting password:', err.message);
  await disconnectDB();
  process.exit(1);
});
