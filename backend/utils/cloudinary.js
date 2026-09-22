const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary from environment variables
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name_here'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✓ Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('ℹ Cloudinary credentials not fully configured. Local upload fallback is active.');
}

/**
 * Uploads a buffer to Cloudinary via upload_stream.
 * If Cloudinary is not configured or throws auth error, falls back to saving file in backend/uploads.
 */
async function uploadImage(file, req) {
  if (!file) {
    return null;
  }

  // 1. Try Cloudinary if configured
  if (isCloudinaryConfigured) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'lost-and-found',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (err) {
      console.warn('Cloudinary upload error:', err.message);
      console.warn('Falling back to local file storage for demo continuity...');
    }
  }

  // 2. Fallback: Store locally in backend/uploads directory
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(file.originalname) || '.jpg';
  const fileName = `item-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.promises.writeFile(filePath, file.buffer);

  // Construct absolute URL accessible by frontend
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  return `${protocol}://${host}/uploads/${fileName}`;
}

module.exports = {
  isCloudinaryConfigured,
  uploadImage
};
