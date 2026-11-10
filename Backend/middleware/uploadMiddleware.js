import multer from 'multer';
import path from 'path';

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Generate unique file name using timestamp
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter function for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /js|jsx|ts|tsx|py|html|css|json|md|txt|png|jpg|jpeg|pdf/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not supported. Please upload allowed file formats.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter,
});

export default upload;