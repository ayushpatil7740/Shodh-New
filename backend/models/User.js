const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User: storeUser } = require('../data/store');
const { createHybridModel } = require('./modelHelper');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  // Prevent double-hashing if already a bcrypt hash
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  const cleanPass = String(enteredPassword).trim();
  // Direct plain-text match fallback
  if (this.password === cleanPass) return true;
  try {
    return await bcrypt.compare(cleanPass, this.password);
  } catch (_) {
    return false;
  }
};

const MongoUser = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = createHybridModel(MongoUser, storeUser);
