const express = require('express');
const router = express.Router();
const authenticateUser = require('../config/middlewares/authMiddleware');
const { getAllProjects, createProject, getSinlgeProject, deleteProject, updateProject, closeProject } = require('../controllers/projectController');

router.route('/').get(getAllProjects).post(authenticateUser,createProject); //* get all available projects and create project
router.route('/update_project/:id').patch(authenticateUser,updateProject); //* update project details
router.route('/close_project/:id').patch(authenticateUser,closeProject); //*close project, therefore can't create issues
router.route('/:id').get(getSinlgeProject).delete(authenticateUser,deleteProject); //* get single project and delete projects (only available through api)

module.exports = router;