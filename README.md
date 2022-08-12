# Welcome to Issue Tracker Application - Backend!

Link to website: https://bugz-it.herokuapp.com/

Link to frontend repo: https://github.com/NikhilRJ2017/Issue-Tracker-Application-Frontend

Link to api documentation: https://documenter.getpostman.com/view/21774268/VUjSEiSr


# Steps to install locally

Before installing npm modules and run the project, create '.env' file to the project with following entries: 

	-MONGO_DB_URI="add value"
	-JWT_SECRET_KEY= "add value"
	-JWT_ALGO="add value"
	-JWT_LIFETIME="add value"
	-PORT="add value" (optional, default is 5000)


Now, add following commands to the project:
>npm install &&
>npm install nodemon -D &&
>npm start

App runs on the port 5000 or else provide port value in .env file
