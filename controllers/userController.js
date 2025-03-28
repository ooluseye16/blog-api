const User = require('../models/user');
const jwt = require('jsonwebtoken');

// register user
const registerUser = async (req, res) => {
    try {
        const user = await User.create({
            ...req.body,
            role: req.body.username.includes('admin') ? 'admin' : 'user',
        });
        res.status(201).json({
            status: 'success',
            data: user,
            message: 'User registered successfully',
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages });
        } else {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }
        const isMatch = await user.correctPassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, });
        res.status(200).json({
            status: 'success',
            token,
            message: 'User logged in successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

//get user
const getUser = async (req, res) => {
    res.json({
        status: 'success',
        data: req.user,
        message: 'User fetched successfully',
    });
}

// get user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.status(200).json({

                status: 'success',
                data: user,
                message: 'User fetched successfully',
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

module.exports = { registerUser, loginUser, getUser, getUserById };
