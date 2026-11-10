import Project from '../models/Project.js';
import Note from '../models/Note.js';
import File from '../models/File.js';
import Activity from '../models/Activity.js';


export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId },
      ],
    }).sort({ updatedAt: -1 });

    const projectIds = projects.map((project) => project._id);

    const totalProjects = projects.length;

    const createdProjects = projects.filter(
      (project) =>
        project.owner &&
        project.owner.toString() === userId.toString()
    ).length;

    const joinedProjects = totalProjects - createdProjects;

    const totalNotes = projectIds.length
      ? await Note.countDocuments({
          project: { $in: projectIds },
        })
      : 0;

    const totalFiles = projectIds.length
      ? await File.countDocuments({
          project: { $in: projectIds },
        })
      : 0;

    const recentActivities = projectIds.length
      ? await Activity.find({
          project: { $in: projectIds },
        })
            .populate('user', 'name')
            .populate('project', 'title')
            .sort({ createdAt: -1 })
            .limit(8)
      : [];

    res.status(200).json({
      totalProjects,
      createdProjects,
      joinedProjects,
      totalNotes,
      totalFiles,
      recentProjects: projects.slice(0, 5),
      recentActivities,
    });
  } catch (error) {
    console.error('Dashboard Error:', error.stack);

    res.status(500).json({
      message: error.message,
    });
  }
};



export const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate('members', 'name email')
      .populate('owner', 'name email');

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    const notes = await Note.find({ project: projectId });
    const files = await File.find({ project: projectId });

    const activities = await Activity.find({
      project: projectId,
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Owner + Members
    const allMembers = [
      project.owner,
      ...project.members,
    ].filter(Boolean);

    const uniqueMembers = [
      ...new Map(
        allMembers.map((member) => [
          member._id.toString(),
          member,
        ])
      ).values(),
    ];

    const memberStats = uniqueMembers.map((member) => {
      const notesCreated = notes.filter(
        (note) =>
          note.author?.toString() === member._id.toString()
      ).length;

      const filesUploaded = files.filter(
        (file) =>
          file.uploadedBy?.toString() === member._id.toString()
      ).length;

      return {
        memberId: member._id,
        name: member.name,
        email: member.email,
        notesCreated,
        filesUploaded,
        totalContributions: notesCreated + filesUploaded,
      };
    });

    res.json({
      totalNotes: notes.length,
      totalFiles: files.length,
      totalMembers: uniqueMembers.length,
      memberStats,
      recentActivities: activities.slice(0, 10),
    });

  } catch (error) {
    console.error('Project Analytics Error:', error);

    res.status(500).json({
      message: error.message,
    });
  }
};
