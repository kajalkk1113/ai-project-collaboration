import File from '../models/File.js';
import Activity from '../models/Activity.js';
import path from 'path';
import fs from 'fs';

// @desc    Upload file to project
// @route   POST /api/files/:projectId
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { projectId } = req.params;

    const file = await File.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      project: projectId,
      uploadedBy: req.user._id,
    });

    await Activity.create({
      project: projectId,
      user: req.user._id,
      action: 'Uploaded File',
      description: `Uploaded file "${req.file.originalname}"`,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project files
// @route   GET /api/files/:projectId
export const getFilesByProject = async (req, res) => {
  try {
    const files = await File.find({ project: req.params.projectId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download file
// @route   GET /api/files/download/:id
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const absolutePath = path.resolve(file.filePath);
    res.download(absolutePath, file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete local physical file
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await File.findByIdAndDelete(req.params.id);

    await Activity.create({
      project: file.project,
      user: req.user._id,
      action: 'Deleted File',
      description: `Deleted file "${file.originalName}"`,
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};