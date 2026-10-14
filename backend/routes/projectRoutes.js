const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, getTechnologies } = require('../controllers/projectController');

router.get('/meta/technologies', getTechnologies);
router.get('/', getProjects);
router.get('/:id', getProjectById);

module.exports = router;
