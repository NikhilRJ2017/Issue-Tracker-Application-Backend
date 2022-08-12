const { StatusCodes } = require('http-status-codes');
const CustomErrorClass = require('./custom_errors');

// ************************ 403 error *************************/
class Unauthorize extends CustomErrorClass{
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = Unauthorize;