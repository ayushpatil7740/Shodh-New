const { resetDB } = require('../data/store');

const seedData = async () => {
  console.log('🧹 Resetting database with initial realistic sample data...');
  resetDB();
  console.log('✅ Shodh database successfully reset and seeded!');
  console.log('----------------------------------------------------');
  console.log('🔑 DEMO CREDENTIALS:');
  console.log('  👑 Admin Account:');
  console.log('     Email:    admin@shodh.org');
  console.log('     Password: adminpassword123');
  console.log('  👤 User Account 1:');
  console.log('     Email:    aarav@shodh.org');
  console.log('     Password: userpassword123');
  console.log('  👤 User Account 2:');
  console.log('     Email:    priya@shodh.org');
  console.log('     Password: userpassword123');
  console.log('----------------------------------------------------');
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
