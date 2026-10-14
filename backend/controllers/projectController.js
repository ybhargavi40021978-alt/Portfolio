const mongoose = require('mongoose');
const Project = require('../models/Project');

/**
 * @desc   Get projects with advanced discovery (search, category, tech, sort)
 * @route  GET /api/projects
 * @access Public
 */
const getProjects = async (req, res, next) => {
  try {
    const query = {};

    // 1. Featured filter
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // 2. Category filter
    if (req.query.category && req.query.category !== 'All Projects') {
      query.category = new RegExp(`^${req.query.category.trim()}$`, 'i');
    }

    // 3. Technology filter
    if (req.query.tech && req.query.tech !== 'All') {
      query.technologies = new RegExp(`^${req.query.tech.trim()}$`, 'i');
    }

    // 4. Live Search (title & description)
    if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim().length > 0) {
      const searchRegex = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // 5. Sorting options
    let sortOption = { order: 1, createdAt: -1 };
    if (req.query.sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (req.query.sort === 'featured') {
      sortOption = { featured: -1, order: 1 };
    } else if (req.query.sort === 'title') {
      sortOption = { title: 1 };
    }

    const projects = await Project.find(query).sort(sortOption);
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single project by ID or title
 * @route  GET /api/projects/:id
 * @access Public
 */
const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let project = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    } else {
      project = await Project.findOne({
        $or: [
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
          { title: new RegExp(`^${id}$`, 'i') }
        ]
      });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project with identifier '${id}' not found.`
      });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get list of all unique technologies across projects
 * @route  GET /api/projects/meta/technologies
 * @access Public
 */
const getTechnologies = async (req, res, next) => {
  try {
    const techs = await Project.distinct('technologies');
    res.status(200).json(techs.sort());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  getTechnologies
};
