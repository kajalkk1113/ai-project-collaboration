import express from 'express';
import {
  uploadFile,
  getFilesByProject,
  downloadFile,
  deleteFile,
} from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/:projectId', protect, upload.single('file'), uploadFile);
router.get('/:projectId', protect, getFilesByProject);
router.get('/download/:id', downloadFile);
router.delete('/:id', protect, deleteFile);

export default router;