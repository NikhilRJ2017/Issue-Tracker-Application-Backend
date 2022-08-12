require("dotenv").config();
require("express-async-errors");
const express = require('express');
const connectDB = require('./config/db/connect');
const app = express();

//********************** other packages ***********************/
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

//********************** importing page not found and error handler routes ***********************/
const pageNotFound = require('./config/middlewares/page_not_found');
const errorHandler = require('./config/middlewares/error_handler');

//********************** importing all routes *********************/
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');

//********************** security packages ********************/
// add helmet, xss-clean and mongo-sanitize security packages when deploying
app.use(cors({
    // Todo: add front end url once deployed
    origin: "http://localhost:5500",
    credentials: true
}));

//********************** morgan logger *********************/
app.use(morgan('tiny'));

//********************** cookie parser *********************/

app.use(cookieParser(process.env.JWT_SECRET));

//********************** body parsing middleware ********************/
app.use(express.json())

//********************** main routes **********************/
app.get('/', (req, res) => {
    res.send("Issue Tracker APP");
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/issue', issueRoutes);

//********************* error handler and page not found routes *************************/
app.use(pageNotFound);
app.use(errorHandler);

//********************** Spinning up the server only when DB is connected ***********************/
const PORT = process.env.PORT || 5000;
const start = async () => { 
    try {
        await connectDB(process.env.MONGO_DB_URI);
        app.listen(PORT, () => { 
            console.log(`Server is running on port ${PORT}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();