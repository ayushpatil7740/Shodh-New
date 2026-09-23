const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMySentClaims,
  getMyReceivedClaims,
  getClaimsForItem,
  updateClaimStatus,
  deleteClaim,
} = require('../controllers/claimController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateClaim } = require('../middleware/validation');

// All claim routes require authentication
router.use(protect);

router.post('/', upload.single('proofImage'), validateClaim, createClaim);
router.get('/my-claims', getMySentClaims);
router.get('/received', getMyReceivedClaims);
router.get('/item/:itemId', getClaimsForItem);
router.put('/:id', updateClaimStatus);
router.delete('/:id', deleteClaim);

module.exports = router;
