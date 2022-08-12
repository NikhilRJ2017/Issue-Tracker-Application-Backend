const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register); //* register a user
router.post('/login', login); //* login a user
router.get('/logout', logout); //* logs out  user

module.exports = router;