import express from 'express';
import {
  explainText,
  generateDocs,
  generateReadme,
} from '../controllers/geminiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/explain', protect, explainText);
router.post('/docs', protect, generateDocs);
router.post('/readme', protect, generateReadme);

export default router;