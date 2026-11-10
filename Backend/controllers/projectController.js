import Project from '../models/Project.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

// @desc    Create project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { title, description, visibility } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const shareToken = Math.random().toString(36).substring(2, 12);

    const project = await Project.create({
      title,
      description,
      visibility: visibility || 'private',
      owner: req.user._id,
      members: [req.user._id],
      shareToken,
    });

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'Created Project',
      description: `Project "${title}" was created.`,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member or project is public
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember && project.visibility !== 'public') {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can edit settings' });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description !== undefined ? req.body.description : project.description;
    project.visibility = req.body.visibility || project.visibility;

    const updatedProject = await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'Updated Project Settings',
      description: `Project details updated.`,
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can delete project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
export const addProjectMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can add members' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a project member' });
    }

    project.members.push(userToAdd._id);
    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'Added Member',
      description: `Added ${userToAdd.name} (${userToAdd.email}) to project.`,
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
export const removeProjectMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can remove members' });
    }

    if (req.params.memberId === project.owner.toString()) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.memberId
    );
    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: 'Removed Member',
      description: `Removed a member from project.`,
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by public share token
// @route   GET /api/public/projects/:shareToken
export const getPublicProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      shareToken: req.params.shareToken,
      visibility: 'public',
    })
      .populate('owner', 'name')
      .populate('members', 'name');

    if (!project) {
      return res.status(404).json({ message: 'Public project not found or made private' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};