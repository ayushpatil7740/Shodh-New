const mongoose = require('mongoose');
const { Claim: storeClaim } = require('../data/store');
const { createHybridModel } = require('./modelHelper');

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimantName: {
      type: String,
      default: '',
      trim: true,
    },
    claimantPhone: {
      type: String,
      default: '',
      trim: true,
    },
    claimantEmail: {
      type: String,
      default: '',
      trim: true,
    },
    proofDescription: {
      type: String,
      required: [true, 'Please provide details or proof of ownership'],
      maxlength: [1000, 'Proof description cannot exceed 1000 characters'],
    },
    proofImageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

claimSchema.index({ item: 1, claimant: 1 });
claimSchema.index({ status: 1 });

const MongoClaim = mongoose.models.Claim || mongoose.model('Claim', claimSchema);

module.exports = createHybridModel(MongoClaim, storeClaim);
