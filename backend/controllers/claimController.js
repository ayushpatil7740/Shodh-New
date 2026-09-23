const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');

// @desc    Submit a claim / match request for an item
// @route   POST /api/claims
// @access  Private
const createClaim = async (req, res, next) => {
  try {
    const { itemId, claimantName, claimantPhone, claimantEmail, proofDescription } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Prevent claiming own item
    if (item.postedBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot file a claim on an item you reported yourself',
      });
    }

    // Check if already claimed by this user
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user.id,
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a claim for this item',
      });
    }

    let proofImageUrl = '';
    if (req.file) {
      proofImageUrl = `/uploads/${req.file.filename}`;
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user.id,
      claimantName: claimantName || req.user.name,
      claimantPhone: claimantPhone || req.user.phone || '',
      claimantEmail: claimantEmail || req.user.email,
      proofDescription,
      proofImageUrl,
      status: 'pending',
    });

    // Notify item poster
    await Notification.create({
      recipient: item.postedBy,
      sender: req.user.id,
      item: item._id,
      claim: claim._id,
      type: 'claim_received',
      message: `${req.user.name} submitted a claim on your ${item.type} listing: "${item.title}".`,
    });

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully! The poster has been notified.',
      claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims submitted by the logged in user
// @route   GET /api/claims/my-claims
// @access  Private
const getMySentClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimant: req.user.id })
      .populate({
        path: 'item',
        populate: { path: 'postedBy', select: 'name email phone avatar' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims received on items posted by logged in user
// @route   GET /api/claims/received
// @access  Private
const getMyReceivedClaims = async (req, res, next) => {
  try {
    // Find all items posted by user
    const myItems = await Item.find({ postedBy: req.user.id }).select('_id');
    const itemIds = myItems.map((item) => item._id);

    const claims = await Claim.find({ item: { $in: itemIds } })
      .populate('item')
      .populate('claimant', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claims for a specific item
// @route   GET /api/claims/item/:itemId
// @access  Private (Poster or Admin)
const getClaimsForItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view claims for this item',
      });
    }

    const claims = await Claim.find({ item: req.params.itemId })
      .populate('claimant', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a claim
// @route   PUT /api/claims/:id
// @access  Private (Poster or Admin)
const updateClaimStatus = async (req, res, next) => {
  try {
    const { status, adminOrOwnerNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be approved or rejected.',
      });
    }

    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimant', 'name email phone');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    const item = await Item.findById(claim.item._id).populate('postedBy', 'name email phone');

    // Check authorization: must be item poster or admin
    if (
      item.postedBy._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this claim',
      });
    }

    claim.status = status;
    if (adminOrOwnerNotes) {
      claim.adminOrOwnerNotes = adminOrOwnerNotes;
    }
    await claim.save();

    if (status === 'approved') {
      // Mark item as claimed/resolved
      item.status = item.type === 'found' ? 'handed_over' : 'claimed';
      item.claimedBy = claim.claimant._id;
      await item.save();

      // Notify claimant with contact details
      await Notification.create({
        recipient: claim.claimant._id,
        sender: req.user.id,
        item: item._id,
        claim: claim._id,
        type: 'claim_approved',
        message: `🎉 Great news! Your claim for "${item.title}" was approved by ${item.postedBy.name}. Contact: ${item.contactPhone || item.postedBy.phone || item.contactEmail || item.postedBy.email}`,
      });
    } else if (status === 'rejected') {
      // Notify claimant about rejection
      await Notification.create({
        recipient: claim.claimant._id,
        sender: req.user.id,
        item: item._id,
        claim: claim._id,
        type: 'claim_rejected',
        message: `Your claim for "${item.title}" was not approved. Note: ${adminOrOwnerNotes || 'Details did not match.'}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Claim successfully marked as ${status}`,
      claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel / Delete a pending claim
// @route   DELETE /api/claims/:id
// @access  Private (Claimant or Admin)
const deleteClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    if (claim.claimant.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this claim',
      });
    }

    await claim.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Claim cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClaim,
  getMySentClaims,
  getMyReceivedClaims,
  getClaimsForItem,
  updateClaimStatus,
  deleteClaim,
};
