import express from 'express';
import { getPublicProject } from '../controllers/projectController.js';

const router = express.Router();

router.get('/projects/:shareToken', getPublicProject);

export default router;