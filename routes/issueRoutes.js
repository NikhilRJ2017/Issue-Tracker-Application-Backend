const express = require('express');
const authenticateUser = require('../config/middlewares/authMiddleware');
const { getAllIssues, createIssue, updateIssue, getAllLabels } = require('../controllers/issueController');
const router = express.Router();

router.route('/get_labels').get(getAllLabels); 
router.route('/:projectId').get(authenticateUser, getAllIssues).post(authenticateUser, createIssue); //* get all issues for particular project and create project
router.route('/:projectId/:issueId').patch(authenticateUser, updateIssue); //* updates issue (only available through api)

module.exports = router