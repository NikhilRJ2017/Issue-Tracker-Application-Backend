require('dotenv').config({ path: '../../.env' });
const jwt = require('jsonwebtoken');

// ******************* creating JWT ************************/
const createJWT = ({ payload }) => { 
    const secret = process.env.JWT_SECRET;
    const options = {
        algorithm: process.env.JWT_ALGO,
        expiresIn: process.env.JWT_LIFE
    }

    const token = jwt.sign(payload, secret, options);
    return token;
}

// *********************** attaching cookies with response **********************/
const attachCookiesToResponse = ({ res, user })=>{
    const token = createJWT({ payload: user });
    const oneDay = 1000 * 60 * 60 * 24;

    //Todo: add sameSite and secure properties while deployment
    const cookieOptions = {
        expires: new Date(Date.now() + oneDay),
        signed: true,
    };

    res.cookie('token', token, cookieOptions);
}

// ******************** verifying jwt **********************/
const isTokenValid = ({ token }) => { 
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    attachCookiesToResponse,
    isTokenValid
}