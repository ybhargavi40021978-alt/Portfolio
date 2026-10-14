const Skill = require('../models/Skill');

const CATEGORY_METADATA = {
  'Frontend': {
    id: 'frontend',
    title: 'Frontend',
    description: 'Technologies for building user interfaces and responsive web applications.',
    icon: 'monitor',
    order: 1
  },
  'Backend': {
    id: 'backend',
    title: 'Backend',
    description: 'Server-side technologies and frameworks for building scalable applications.',
    icon: 'server',
    order: 2
  },
  'Database': {
    id: 'database',
    title: 'Database',
    description: 'Databases and data management systems for storing and retrieving information.',
    icon: 'database',
    order: 3
  },
  'Tools': {
    id: 'tools',
    title: 'Tools',
    description: 'Development tools and platforms for efficient workflow and version control.',
    icon: 'wrench',
    order: 4
  },
  'Additional': {
    id: 'additional',
    title: 'Additional',
    description: 'Other useful technologies and concepts I work with.',
    icon: 'star',
    order: 5
  }
};

/**
 * @desc   Get skills (supports ?preview=true or full categorized dataset)
 * @route  GET /api/skills
 * @access Public
 */
const getSkills = async (req, res, next) => {
  try {
    const isPreview = req.query.preview === 'true';

    if (isPreview) {
      // Find preview skills or top 8
      let skills = await Skill.find({ isPreview: true }).sort({ order: 1 });
      if (!skills || skills.length === 0) {
        skills = await Skill.find().sort({ order: 1 }).limit(8);
      }
      return res.status(200).json(skills.map(s => ({ name: s.name, icon: s.icon, proficiency: s.proficiency })));
    }

    // Retrieve all skills ordered
    const allSkills = await Skill.find().sort({ order: 1, name: 1 });

    if (!allSkills || allSkills.length === 0) {
      return res.status(200).json({ categories: [], skills: [] });
    }

    // Group by category
    const grouped = {};
    for (const skill of allSkills) {
      const cat = skill.category || 'Additional';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push({
        id: skill._id,
        name: skill.name,
        icon: skill.icon,
        proficiency: skill.proficiency,
        order: skill.order
      });
    }

    // Format categories matching the category metadata
    const categories = Object.keys(CATEGORY_METADATA)
      .filter(catName => grouped[catName] && grouped[catName].length > 0)
      .map(catName => {
        const meta = CATEGORY_METADATA[catName];
        return {
          id: meta.id,
          title: meta.title,
          description: meta.description,
          icon: meta.icon,
          order: meta.order,
          skills: grouped[catName]
        };
      })
      .sort((a, b) => a.order - b.order);

    res.status(200).json({
      categories,
      skills: allSkills.map(s => ({ name: s.name, icon: s.icon }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills
};
