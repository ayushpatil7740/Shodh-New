const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsersAdmin,
  updateUserRoleAdmin,
  getAllClaimsAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/adminAuth');

router.use(protect);
router.use(authorizeAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/role', updateUserRoleAdmin);
router.get('/claims', getAllClaimsAdmin);

module.exports = router;
