const mongoose = require('mongoose');

// ******************** creating a mongo db connection **********************/
const connectDB = (url) => { 
    return mongoose.connect(url);
}

module.exports = connectDB;