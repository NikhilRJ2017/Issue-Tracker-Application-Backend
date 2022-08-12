const { StatusCodes } = require('http-status-codes');
const CustomErrorClass = require('./custom_errors');

// ************************* 401 error **************************/
class Unauthenticate extends CustomErrorClass{
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = Unauthenticate;