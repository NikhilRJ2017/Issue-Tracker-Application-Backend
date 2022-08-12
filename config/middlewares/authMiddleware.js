const { UnauthenticateError } = require('../errors/index');
const { isTokenValid } = require('../utils/jwt');

// ******************* authenticates user while routing particular route **********************/
const authenticateUser = async (req, res, next)=>{
    const token = req.signedCookies.token;
    if (!token) {
        throw new UnauthenticateError("Authentication invalid");
    }

    try {
        const { name, userId } = isTokenValid({ token });
        req.user = {
            name,
            userId
        }

        next();
        
    } catch (error) {
        throw new UnauthenticateError("Authentication invalid")
    }
}

module.exports = authenticateUser;