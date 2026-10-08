const mongoose = require('mongoose');
const { resetDB } = require('../data/store');

/**
 * Sanitize and validate MongoDB Connection URI
 */
function sanitizeMongoURI(rawUri) {
  if (!rawUri) return null;
  let uri = rawUri.trim().replace(/^["']+|["']+$/g, '').trim();

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return null;
  }

  // Ensure database name exists before query parameters or at end
  const defaultDB = 'shodh_db';
  if (uri.includes('?')) {
    const parts = uri.split('?');
    const base = parts[0];
    const query = parts.slice(1).join('?');
    const protocolIndex = base.indexOf('://');
    const slashAfterProtocol = base.indexOf('/', protocolIndex + 3);

    if (slashAfterProtocol === -1) {
      uri = `${base}/${defaultDB}?${query}`;
    } else if (base.endsWith('/')) {
      uri = `${base}${defaultDB}?${query}`;
    }
  } else {
    const protocolIndex = uri.indexOf('://');
    const slashAfterProtocol = uri.indexOf('/', protocolIndex + 3);

    if (slashAfterProtocol === -1) {
      uri = `${uri}/${defaultDB}`;
    } else if (uri.endsWith('/')) {
      uri = `${uri}${defaultDB}`;
    }
  }

  return uri;
}

/**
 * Mask password in connection string for safe logging
 */
function maskMongoURI(uri) {
  if (!uri) return '';
  return uri.replace(/(:\/\/)([^:@]+):([^@]+)@/, '$1$2:****@');
}

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

let isConnecting = false;

const connectDB = async () => {
  // Ensure .env is loaded if called before server initialization
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
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
  }

  const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!rawUri) {
    console.warn('\n⚠️ [Database Warning] Neither MONGO_URI nor MONGODB_URI is set.');
    console.warn('💡 Running in self-contained embedded storage mode.');
    console.warn('📌 For Production (Render/Atlas): Set MONGO_URI in your dashboard environment variables:');
    console.warn('   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shodh_db?retryWrites=true&w=majority\n');
    return false;
  }

  const sanitizedUri = sanitizeMongoURI(rawUri);
  if (!sanitizedUri) {
    console.error('\n❌ [Database Error] Invalid MONGO_URI format. Must start with mongodb:// or mongodb+srv://');
    console.warn('💡 Falling back to self-contained embedded storage mode.\n');
    return false;
  }

  if (isConnecting || mongoose.connection.readyState === 1) {
    return true;
  }

  isConnecting = true;

  try {
    const conn = await mongoose.connect(sanitizedUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });

    isConnecting = false;
    const masked = maskMongoURI(sanitizedUri);
    console.log(`\n✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📡 Database URI: ${masked}`);
    console.log(`🗄️ Database Name: ${conn.connection.name}\n`);
    return true;
  } catch (error) {
    isConnecting = false;
    const masked = maskMongoURI(sanitizedUri);
    console.error('\n❌ MongoDB Atlas Connection Failed!');
    console.error(`📡 Attempted URI: ${masked}`);
    console.error(`💥 Error: ${error.message}`);
    console.error('\n🛠️ MongoDB Atlas Connection Troubleshooting:');
    console.error('  1. Check Network Access (IP Whitelist) on MongoDB Atlas:');
    console.error('     Ensure IP 0.0.0.0/0 (Allow access from anywhere) is added so Render can connect.');
    console.error('  2. Verify Database User Credentials:');
    console.error('     Check username and password in Atlas Database Access. Ensure special characters in password are URL-encoded if applicable.');
    console.error('  3. Ensure the Atlas cluster is active (not paused or deleted).');
    console.warn('💡 Falling back to self-contained embedded storage mode so the server stays operational.\n');
    return false;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed gracefully.');
  }
  return true;
};

// Handle process termination gracefully
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB,
  resetDB,
  sanitizeMongoURI,
  maskMongoURI,
};
