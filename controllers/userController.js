const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../config/errors");
const { createTokenUser, attachCookiesToResponse } = require("../config/utils");
const User = require("../models/User");



//************************** Get a single user *************************/
const getCurrentUser = async (req, res) => {
    const { name, userId } = req.user;
    res.status(StatusCodes.OK).json({
        message: 'Success',
        user: {
            name,
            userId
        }
    })
};

//************************* Update user ************************/
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new BadRequestError("Please provide both name and email");
    }

    const { userId } = req.user;
    const user = await User.findOneAndUpdate({ _id: userId }, { name, email }, { new: true, runValidators: true });
    
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });


    res.status(StatusCodes.OK).json({
        message: "Success",
        user: tokenUser,
    })
};

//************************* Update user password *****************************/
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new BadRequestError("Please provide both old and new passwords");
    }

    const { userId } = req.user;
    const user = await User.findOne({ _id: userId });
    
    const isOldPasswordMatch = user.comparePasswords(oldPassword);
    if (!isOldPasswordMatch) {
        throw new BadRequestError("Please provide valid old password");
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({
        message: 'Success'
    })
};

module.exports = {
    getCurrentUser,
    updateUser,
    updateUserPassword
}