/**
 * Shodh Seeder
 * Demo accounts have been removed for production security.
 * Real users register via the portal (/register) or via Google Sign-In.
 * Use `npm run make-admin <email>` to grant admin privileges to any real account.
 */

const seedData = async () => {
  console.log('ℹ️ Demo seed data has been disabled for production security.');
  console.log('💡 Users can register via the portal (/register) or using "Continue with Google".');
  console.log('👑 To promote any user to Admin, run: node backend/scripts/makeAdmin.js <email>');
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
