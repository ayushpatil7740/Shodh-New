const { v4: uuidv4 } = require('uuid');
const jsonStorage = require('../utils/jsonStorage');
const { uploadImage } = require('../utils/cloudinary');
const { findMatches } = require('../utils/matchEngine');

// Default placeholder images if no image was provided
const CATEGORY_PLACEHOLDERS = {
  'Mobile Phone': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
  'Wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
  'ID Card': 'https://images.unsplash.com/photo-1589330694653-dad6d3240a91?w=800&auto=format&fit=crop&q=80',
  'Keys': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
  'Bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  'Laptop': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  'Earphones': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  'Watch': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
  'Documents': 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80',
  'Jewelry': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
  'Clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
  'Books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
  'Other': 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&auto=format&fit=crop&q=80'
};

/**
 * Helper to sanitize input strings
 */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

/**
 * Validate item payload
 */
function validateItemPayload(body) {
  const errors = [];
  if (!body.itemName || !body.itemName.trim()) errors.push('Item name is required.');
  if (!body.category || !body.category.trim()) errors.push('Category is required.');
  if (!body.description || !body.description.trim()) errors.push('Description is required.');
  if (!body.location || !body.location.trim()) errors.push('Location is required.');
  if (!body.date || !body.date.trim()) errors.push('Date is required.');

  // Either contactName or finderName
  const contactName = body.contactName || body.finderName;
  if (!contactName || !contactName.trim()) {
    errors.push('Contact/Finder name is required.');
  }

  // At least email or phone must be provided
  const email = body.contactEmail || '';
  const phone = body.contactPhone || '';
  if (!email.trim() && !phone.trim()) {
    errors.push('Please provide at least a phone number or an email address.');
  }

  return errors;
}

/**
 * POST /api/items/lost
 * Create a Lost Item report
 */
async function createLostItem(req, res, next) {
  try {
    const errors = validateItemPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file, req);
    } else if (req.body.imageUrl) {
      imageUrl = sanitize(req.body.imageUrl);
    } else {
      imageUrl = CATEGORY_PLACEHOLDERS[req.body.category] || CATEGORY_PLACEHOLDERS['Other'];
    }

    const newItem = {
      id: uuidv4(),
      type: 'lost',
      itemName: sanitize(req.body.itemName),
      category: sanitize(req.body.category),
      description: sanitize(req.body.description),
      location: sanitize(req.body.location),
      date: sanitize(req.body.date),
      time: sanitize(req.body.time || ''),
      imageUrl: imageUrl,
      contactName: sanitize(req.body.contactName || req.body.finderName),
      contactEmail: sanitize(req.body.contactEmail || ''),
      contactPhone: sanitize(req.body.contactPhone || ''),
      additionalInfo: sanitize(req.body.additionalInfo || ''),
      status: 'active', // active, resolved
      createdAt: new Date().toISOString()
    };

    await jsonStorage.saveItem(newItem);

    // Compute immediate possible matches against existing found items
    const allItems = await jsonStorage.getItems();
    const possibleMatches = findMatches(newItem, allItems);

    res.status(201).json({
      success: true,
      message: 'Lost item reported successfully!',
      data: newItem,
      matches: possibleMatches
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/items/found
 * Create a Found Item report
 */
async function createFoundItem(req, res, next) {
  try {
    const errors = validateItemPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file, req);
    } else if (req.body.imageUrl) {
      imageUrl = sanitize(req.body.imageUrl);
    } else {
      imageUrl = CATEGORY_PLACEHOLDERS[req.body.category] || CATEGORY_PLACEHOLDERS['Other'];
    }

    const newItem = {
      id: uuidv4(),
      type: 'found',
      itemName: sanitize(req.body.itemName),
      category: sanitize(req.body.category),
      description: sanitize(req.body.description),
      location: sanitize(req.body.location),
      date: sanitize(req.body.date),
      time: sanitize(req.body.time || ''),
      imageUrl: imageUrl,
      contactName: sanitize(req.body.finderName || req.body.contactName),
      contactEmail: sanitize(req.body.contactEmail || ''),
      contactPhone: sanitize(req.body.contactPhone || ''),
      additionalInfo: sanitize(req.body.additionalInfo || ''),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    await jsonStorage.saveItem(newItem);

    // Compute immediate possible matches against existing lost items
    const allItems = await jsonStorage.getItems();
    const possibleMatches = findMatches(newItem, allItems);

    res.status(201).json({
      success: true,
      message: 'Found item reported successfully!',
      data: newItem,
      matches: possibleMatches
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/items
 * Get all items with optional filters: type, category, location, sort
 */
async function getAllItems(req, res, next) {
  try {
    const { type, category, location, sort = 'newest' } = req.query;
    let items = await jsonStorage.getItems();

    // Filter by type: lost or found
    if (type && type !== 'all') {
      items = items.filter((item) => item.type === type.toLowerCase());
    }

    // Filter by category
    if (category && category !== 'all') {
      items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by location
    if (location && location.trim()) {
      const loc = location.toLowerCase();
      items = items.filter((item) => item.location && item.location.toLowerCase().includes(loc));
    }

    // Sort by date/createdAt
    if (sort === 'oldest') {
      items.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
    } else {
      // Default: newest first
      items.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/items/:id
 * Get single item by ID, including its possible matches
 */
async function getItemById(req, res, next) {
  try {
    const { id } = req.params;
    const item = await jsonStorage.getItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    const allItems = await jsonStorage.getItems();
    const matches = findMatches(item, allItems);

    res.status(200).json({
      success: true,
      data: item,
      matches
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/items/search?q=...
 * Search across itemName, description, category, location
 */
async function searchItems(req, res, next) {
  try {
    const query = req.query.q || '';
    const results = await jsonStorage.searchItems(query);

    res.status(200).json({
      success: true,
      count: results.length,
      query,
      data: results
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/items/:id/matches
 * Explicit endpoint to get possible matches for an item
 */
async function getItemMatches(req, res, next) {
  try {
    const { id } = req.params;
    const item = await jsonStorage.getItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    const allItems = await jsonStorage.getItems();
    const matches = findMatches(item, allItems);

    res.status(200).json({
      success: true,
      itemId: id,
      matches
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/items/:id
 * Delete an item report
 */
async function deleteItem(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await jsonStorage.deleteItem(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or already deleted.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/items/:id
 * Update item details or mark resolved
 */
async function updateItem(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await jsonStorage.getItemById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    const updateData = { ...req.body };

    // If new image uploaded
    if (req.file) {
      updateData.imageUrl = await uploadImage(req.file, req);
    }

    const updated = await jsonStorage.updateItem(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/items
 * Generic endpoint to create either a lost or found item based on req.body.type
 */
async function createItem(req, res, next) {
  const itemType = (req.body.type || 'lost').toLowerCase();
  if (itemType === 'found') {
    return createFoundItem(req, res, next);
  } else {
    return createLostItem(req, res, next);
  }
}

module.exports = {
  createItem,
  createLostItem,
  createFoundItem,
  getAllItems,
  getItemById,
  searchItems,
  getItemMatches,
  deleteItem,
  updateItem
};
