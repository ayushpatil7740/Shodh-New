const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateItem = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Electronics',
      'Documents & IDs',
      'Wallets & Bags',
      'Keys',
      'Clothing & Accessories',
      'Books & Stationery',
      'Jewelry & Watches',
      'Other',
    ])
    .withMessage('Please select a valid category'),
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['lost', 'found'])
    .withMessage('Type must be either lost or found'),
  body('placeName')
    .trim()
    .notEmpty()
    .withMessage('Location / Landmark is required'),
  handleValidationErrors,
];

const validateClaim = [
  body('claimantName').trim().notEmpty().withMessage('Claimant name is required'),
  body('claimantPhone').trim().notEmpty().withMessage('Claimant contact phone is required'),
  body('claimantEmail').trim().isEmail().withMessage('Valid email is required'),
  body('proofDescription')
    .trim()
    .notEmpty()
    .withMessage('Proof of ownership or identifying details are required')
    .isLength({ max: 1000 })
    .withMessage('Proof description cannot exceed 1000 characters'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateItem,
  validateClaim,
  handleValidationErrors,
};
