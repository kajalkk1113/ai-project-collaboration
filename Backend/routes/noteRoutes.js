import express from 'express';
import {
  createNote,
  getNotesByProject,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:projectId', protect, createNote);
router.get('/:projectId', protect, getNotesByProject);
router.get('/detail/:id', protect, getNoteById);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

export default router;