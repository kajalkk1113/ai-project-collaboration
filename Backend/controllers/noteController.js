import Note from '../models/Note.js';
import Activity from '../models/Activity.js';

// @desc    Create new note
// @route   POST /api/notes/:projectId
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { projectId } = req.params;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' });
    }

    const note = await Note.create({
      title,
      content,
      project: projectId,
      author: req.user._id,
    });

    await Activity.create({
      project: projectId,
      user: req.user._id,
      action: 'Created Note',
      description: `Created note "${title}"`,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project notes
// @route   GET /api/notes/:projectId
export const getNotesByProject = async (req, res) => {
  try {
    const notes = await Note.find({ project: req.params.projectId })
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single note detail
// @route   GET /api/notes/detail/:id
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('author', 'name email');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    const updatedNote = await note.save();

    await Activity.create({
      project: note.project,
      user: req.user._id,
      action: 'Updated Note',
      description: `Updated note "${note.title}"`,
    });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.findByIdAndDelete(req.params.id);

    await Activity.create({
      project: note.project,
      user: req.user._id,
      action: 'Deleted Note',
      description: `Deleted note "${note.title}"`,
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};