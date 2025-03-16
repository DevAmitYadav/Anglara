import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directory from environment variables (default: 'uploads/')
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');

// Ensure uploads directory exists
(async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error('❌ Error creating upload directory:', err.message);
  }
})();

// Allowed file extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const safeFilename = `${crypto.randomUUID()}${fileExt}`;
    cb(null, safeFilename);
  },
});

// File filter: Allow only images (JPG, PNG, GIF)
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExt)) {
    return cb(new Error(`❌ Unsupported file type. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
  cb(null, true);
};

// Set file size limit (5MB max)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Export middleware
export default upload;
