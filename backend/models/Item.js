const mongoose = require('mongoose');
const { Item: storeItem } = require('../data/store');
const { createHybridModel } = require('./modelHelper');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an item description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      default: 'Other',
    },
    type: {
      type: String,
      required: [true, 'Please specify if item is lost or found'],
      enum: ['lost', 'found'],
    },
    location: {
      placeName: {
        type: String,
        required: [true, 'Please provide a location/place name'],
        trim: true,
      },
      city: {
        type: String,
        default: 'Main Campus',
        trim: true,
      },
      landmark: {
        type: String,
        default: '',
        trim: true,
      },
    },
    dateLostOrFound: {
      type: Date,
      default: Date.now,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    reward: {
      type: String,
      default: '',
      trim: true,
    },
    contactName: {
      type: String,
      default: '',
      trim: true,
    },
    contactPhone: {
      type: String,
      default: '',
      trim: true,
    },
    contactEmail: {
      type: String,
      default: '',
      trim: true,
    },
    secretQuestion: {
      type: String,
      default: '',
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'claimed', 'resolved', 'closed'],
      default: 'active',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching & filtering
itemSchema.index({ type: 1, status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ postedBy: 1 });
itemSchema.index({ title: 'text', description: 'text', 'location.placeName': 'text' });

const MongoItem = mongoose.models.Item || mongoose.model('Item', itemSchema);

module.exports = createHybridModel(MongoItem, storeItem);
