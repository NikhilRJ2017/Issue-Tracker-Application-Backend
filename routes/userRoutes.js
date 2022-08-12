const express = require('express');
const router = express.Router();
const { getCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController');
const authenticateUser = require('../config/middlewares/authMiddleware');

router.route('/current_user').get(authenticateUser, getCurrentUser); //* gets you a current logged in user
router.route('/update_user').patch(authenticateUser, updateUser); //* update user details such as name and email
router.route('/update_user_password').patch(authenticateUser, updateUserPassword); //* update user password


module.exports = router;