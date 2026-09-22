const multer = require('multer');

// Store in memory buffer so we can stream directly to Cloudinary
const storage = multer.memoryStorage();

// File filter: JPG, JPEG, PNG, WebP
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPG, JPEG, PNG, and WebP images are allowed.'
      ),
      false
    );
  }
};

const multerInstance = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter
});

/**
 * Flexible upload middleware:
 * Uses multerInstance.any() so clients can name the image field anything
 * ('photo', 'image', 'file', 'itemImage', 'picture', etc.) without
 * ever triggering Multer's "Unexpected field" error.
 * Automatically normalizes the primary file onto req.file.
 */
const flexibleUpload = (req, res, next) => {
  multerInstance.any()(req, res, (err) => {
    if (err) {
      // If an unexpected field warning occurs, proceed gracefully without crashing
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message?.includes('Unexpected field')) {
        return next();
      }
      return next(err);
    }

    if (req.files && req.files.length > 0) {
      // Prioritize common image field names if present, else take first file
      req.file =
        req.files.find((f) =>
          ['photo', 'image', 'file', 'itemImage', 'picture', 'itemPhoto'].includes(f.fieldname)
        ) || req.files[0];
    }

    next();
  });
};

// Provide full Multer compatibility methods so existing route definitions keep working
flexibleUpload.single = () => flexibleUpload;
flexibleUpload.any = () => flexibleUpload;
flexibleUpload.array = () => flexibleUpload;
flexibleUpload.fields = () => flexibleUpload;

module.exports = flexibleUpload;
