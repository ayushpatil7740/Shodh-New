const Item = require('../models/Item');
const Claim = require('../models/Claim');
const User = require('../models/User');

// @desc    Get all items with search, filters, and pagination
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const {
      type,
      category,
      status,
      search,
      location,
      startDate,
      endDate,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by type (lost / found)
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by status (default to active if not specified, or allow all)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by location
    if (location && location.trim() !== '') {
      query.$or = [
        { 'location.placeName': { $regex: location, $options: 'i' } },
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.landmark': { $regex: location, $options: 'i' } },
      ];
    }

    // Filter by text search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchCondition = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.placeName': searchRegex },
        { 'location.city': searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchCondition }];
        delete query.$or;
      } else {
        query.$or = searchCondition;
      }
    }

    // Filter by date range
    if (startDate || endDate) {
      query.dateLostOrFound = {};
      if (startDate) query.dateLostOrFound.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.dateLostOrFound.$lte = end;
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'date') {
      sortOptions = { dateLostOrFound: -1 };
    } else if (sortBy === 'views') {
      sortOptions = { viewsCount: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('postedBy', 'name email phone avatar')
      .populate('claimedBy', 'name email avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email phone avatar createdAt')
      .populate('claimedBy', 'name email phone avatar');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Increment views count silently
    item.viewsCount += 1;
    await item.save({ validateBeforeSave: false });

    // Fetch related claims count or claims if requester is the poster
    let claims = [];
    if (req.user && (req.user.id === item.postedBy._id.toString() || req.user.role === 'admin')) {
      claims = await Claim.find({ item: item._id })
        .populate('claimant', 'name email phone avatar')
        .sort({ createdAt: -1 });
    }

    // Check if current user has already submitted a claim on this item
    let userClaim = null;
    if (req.user) {
      userClaim = await Claim.findOne({
        item: item._id,
        claimant: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      item,
      claims,
      userClaim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lost or found item report
// @route   POST /api/items
// @access  Private
const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      type,
      placeName,
      city,
      landmark,
      dateLostOrFound,
      reward,
      contactName,
      contactPhone,
      contactEmail,
      secretQuestion,
      tags,
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Process tags if passed as comma-separated string or array
    let processedTags = [];
    if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim().toLowerCase());
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location: {
        placeName,
        city: city || 'Campus / City',
        landmark: landmark || '',
      },
      dateLostOrFound: dateLostOrFound || Date.now(),
      imageUrl,
      reward: reward || '',
      contactName: contactName || req.user.name,
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email,
      secretQuestion: secretQuestion || '',
      postedBy: req.user._id,
      tags: processedTags,
    });

    const populatedItem = await Item.findById(item._id).populate(
      'postedBy',
      'name email phone avatar'
    );

    res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`,
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Verify ownership or admin role
    if (
      item.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this item listing',
      });
    }

    const {
      title,
      description,
      category,
      type,
      placeName,
      city,
      landmark,
      dateLostOrFound,
      status,
      reward,
      contactName,
      contactPhone,
      contactEmail,
      secretQuestion,
      tags,
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (type) item.type = type;
    if (placeName) item.location.placeName = placeName;
    if (city !== undefined) item.location.city = city;
    if (landmark !== undefined) item.location.landmark = landmark;
    if (dateLostOrFound) item.dateLostOrFound = dateLostOrFound;
    if (status) item.status = status;
    if (reward !== undefined) item.reward = reward;
    if (contactName) item.contactName = contactName;
    if (contactPhone !== undefined) item.contactPhone = contactPhone;
    if (contactEmail) item.contactEmail = contactEmail;
    if (secretQuestion !== undefined) item.secretQuestion = secretQuestion;

    if (tags) {
      if (typeof tags === 'string') {
        item.tags = tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      } else if (Array.isArray(tags)) {
        item.tags = tags.map((t) => String(t).trim().toLowerCase());
      }
    }

    if (req.file) {
      item.imageUrl = `/uploads/${req.file.filename}`;
    }

    await item.save();

    const updatedItem = await Item.findById(item._id).populate(
      'postedBy',
      'name email phone avatar'
    );

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Verify ownership or admin
    if (
      item.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item listing',
      });
    }

    // Delete related claims
    await Claim.deleteMany({ item: item._id });
    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item listing and associated claims removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posted items
// @route   GET /api/items/my-items
// @access  Private
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ postedBy: req.user._id })
      .populate('claimedBy', 'name email avatar')
      .sort({ createdAt: -1 });

    // Include claims count for each item
    const itemsWithClaims = await Promise.all(
      items.map(async (item) => {
        const claimsCount = await Claim.countDocuments({ item: item._id });
        const pendingClaimsCount = await Claim.countDocuments({
          item: item._id,
          status: 'pending',
        });
        return {
          ...item.toObject(),
          claimsCount,
          pendingClaimsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: items.length,
      items: itemsWithClaims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics & recent items for landing page
// @route   GET /api/items/stats/summary
// @access  Public
const getStatsSummary = async (req, res, next) => {
  try {
    const totalItems = await Item.countDocuments();
    const totalLost = await Item.countDocuments({ type: 'lost' });
    const totalFound = await Item.countDocuments({ type: 'found' });
    const totalResolved = await Item.countDocuments({
      status: { $in: ['claimed', 'resolved', 'handed_over'] },
    });
    const totalUsers = await User.countDocuments();
    const totalClaims = await Claim.countDocuments();

    const resolutionRate = totalItems > 0 ? Math.round((totalResolved / totalItems) * 100) : 0;

    // Recent items
    const recentLost = await Item.find({ type: 'lost', status: 'active' })
      .populate('postedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(6);

    const recentFound = await Item.find({ type: 'found', status: 'active' })
      .populate('postedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(6);

    // Category counts
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

    const categoryBreakdown = await Promise.all(
      categories.map(async (cat) => {
        const count = await Item.countDocuments({ category: cat });
        return { category: cat, count };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        totalLost,
        totalFound,
        totalResolved,
        totalUsers,
        totalClaims,
        resolutionRate,
      },
      recentLost,
      recentFound,
      categoryBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getStatsSummary,
};
