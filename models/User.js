const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


/**
 * USER SCHEMA:
 *          name: String,
 *          password: String,
 *          email: String
 */

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        maxLength: [30, "Name too long"],
        minLength: [3, "Name too short"]
    },

    email: {
        type: String,
        unique: true,
        required: [true, "Please provide email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email"
        }
    },

    password: {
        type: String,
        required: [true, "Please provide password"],
        minLength: [6, "Password too short"]
    }
}, {
    timestamps: true
});

//********************* hashing password before saving ***********************/
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ******************** comparing password while updating to new password *********************/
UserSchema.methods.comparePasswords = async function (userEnteredPassword) {
    const isMatch = await bcrypt.compare(userEnteredPassword, this.password);
    return isMatch;
}


const User = mongoose.model('User', UserSchema);
module.exports = User;