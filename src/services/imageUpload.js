
import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: '1kbIdeas',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 400, height: 400, crop: 'limit' }],
});
const uploads = multer({ storage });

export default uploads;
