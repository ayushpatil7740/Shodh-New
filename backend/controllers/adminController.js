const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

// @desc    Get complete administrative analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalLost = await Item.countDocuments({ type: 'lost' });
    const totalFound = await Item.countDocuments({ type: 'found' });
    const totalActive = await Item.countDocuments({ status: 'active' });
    const totalResolved = await Item.countDocuments({
      status: { $in: ['claimed', 'resolved', 'handed_over'] },
    });
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    const approvedClaims = await Claim.countDocuments({ status: 'approved' });

    // Category distribution
    const categories = [
      'Electronics',
      'Documents & IDs',
      'Wallets & Bags',
      'Keys',
      'Clothing & Accessories',
      'Books & Stationery',
      'Jewelry & Watches',
      'Other',
    ];

    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Item.countDocuments({ category: cat });
        const lostCount = await Item.countDocuments({ category: cat, type: 'lost' });
        const foundCount = await Item.countDocuments({ category: cat, type: 'found' });
        return { category: cat, total: count, lost: lostCount, found: foundCount };
      })
    );

    // Recent items
    const recentItems = await Item.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(8);

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalItems,
        totalLost,
        totalFound,
        totalActive,
        totalResolved,
        totalClaims,
        pendingClaims,
        approvedClaims,
        resolutionRate: totalItems > 0 ? Math.round((totalResolved / totalItems) * 100) : 0,
      },
      categoryStats,
      recentItems,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin directory
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const itemsReported = await Item.countDocuments({ postedBy: user._id });
        const claimsMade = await Claim.countDocuments({ claimant: user._id });
        return {
          ...user.toObject(),
          itemsReported,
          claimsMade,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (user <-> admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRoleAdmin = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be user or admin.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent removing admin from own account
    if (user._id.toString() === req.user.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote your own admin account.',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform claims for dispute resolution
// @route   GET /api/admin/claims
// @access  Private (Admin)
const getAllClaimsAdmin = async (req, res, next) => {
  try {
    const claims = await Claim.find()
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

module.exports = {
  getAdminStats,
  getAllUsersAdmin,
  updateUserRoleAdmin,
  getAllClaimsAdmin,
};
