const { resetDB } = require('../data/store');

const connectDB = async () => {
  console.log('✅ Shodh JSON Database Engine Initialized (Self-contained & Zero-Config)');
  console.log('💡 Note: Running lightweight embedded JSON storage on Node.js — no external database needed!');
  return true;
};

const disconnectDB = async () => {
  // No-op for JSON store
  return true;
};

module.exports = { connectDB, disconnectDB, resetDB };
