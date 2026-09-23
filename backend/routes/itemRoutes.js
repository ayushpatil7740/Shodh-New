const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getStatsSummary,
} = require('../controllers/itemController');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateItem } = require('../middleware/validation');

// Specific sub-routes first to avoid :id collisions
router.get('/stats/summary', getStatsSummary);
router.get('/my-items', protect, getMyItems);

router
  .route('/')
  .get(getItems)
  .post(protect, upload.single('image'), validateItem, createItem);

router
  .route('/:id')
  .get(optionalAuth, getItemById)
  .put(protect, upload.single('image'), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
