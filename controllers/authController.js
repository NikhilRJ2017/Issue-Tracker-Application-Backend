const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const createTokenUser = require('../config/utils/createTokenUser');
const { attachCookiesToResponse } = require('../config/utils');
const { BadRequestError, UnauthenticateError } = require('../config/errors');


//******************** Register ********************/
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError("Please provide name, email and password")
    }

    const user = await User.create({ name, email, password });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.CREATED).json({
        message: 'Success',
        user: tokenUser
    })
}

//******************** Login *******************/
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide both email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticateError("Invalid credentials");
    }

    const isPasswordMatch = await user.comparePasswords(password);
    if (!isPasswordMatch) {
        throw new UnauthenticateError("Invalid credentials");
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.OK).json({
        message: "Success",
        user: tokenUser
    })
}

//******************** Logout *******************/
const logout = async (req, res) => {
    const cookieOptions = {
        signed: true,
        expires: new Date(Date.now() + (1000 * 10))
    }

    res.cookie('token', 'logout', cookieOptions);

    res.status(StatusCodes.OK).json({
        message: "Success"
    })
}

module.exports = {
    register,
    login,
    logout
}