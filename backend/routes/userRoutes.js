const express = require('express');
const { registerUser, loginUser,getProfile } = require('../controllers/userController');
const expressAsyncHandler = require('express-async-handler');
const {protect} = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

module.exports = router;