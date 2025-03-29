const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Please provide all fields',
                success: false,
            });
        }

        // Check if user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists',
                success: false,
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await userModel.create({
            username,
            email,
            password: hashPassword,
        });

        return res.status(201).json({
            message: 'User registered successfully',
            success: true,
            newUser,
        });


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: 'Error in user register',
            success: false,
        });
    }
}

module.exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide all fields',
                success: false,
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User does not exist',
                success: false,
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials',
                success: false,
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set cookie with token
        res.cookie('token', token);

        return res.status(200).json({
            message: 'User logged in successfully',
            success: true,
            user,
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: 'Error in user login',
            success: false,
        });
    }
}

module.exports.userLogout = async (req, res) => {
    try {
        res.cookie('token', '', {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        return res.status(200).json({
            message: 'User logged out successfully',
            success: true,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: 'Error in user logout',
            success: false,
        });
    }
}