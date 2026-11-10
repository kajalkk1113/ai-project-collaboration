import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Setup uploads static directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public', publicRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('CollabSphere API Server is running standard!');
});
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-project-collaboration.vercel.app'
  ],
  credentials: true,
}));
// Custom Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});