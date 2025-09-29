const User = require('../models/User');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {

     if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
     if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
    
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = expressAsyncHandler(async (req,res)=>{
if(req.user){
 res.status(200).json({
  id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      specialization: req.user.specialization,
      location: req.user.location,
      likes: req.user.likes,
      matches: req.user.matches,
      createdAt: req.user.createdAt,
 })
}
else{
  res.status(404);
  throw new Error('User not found');
}
}
);

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};