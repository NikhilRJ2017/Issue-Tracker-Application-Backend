const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../config/errors');
const { checkPermission } = require('../config/utils');
const Project = require('../models/Project');
const User = require('../models/User');

//******************** Get All Projects ***********************/
const getAllProjects = async (req, res) => {
    const { name, status } = req.query;
    const queryObject = {};

    //* search by project name
    if (name) {
        queryObject.name = { $regex: name, $options: 'i'};
    }
    //* search by project status
    if (status === 'closed') {
        queryObject.status = "closed";
    }

    const projects = await Project.find(queryObject)
        .populate({
            path: 'user',
            select: 'name'
        }).sort({createdAt: -1})

    res.status(StatusCodes.OK).json({
        message: "Success",
        count: projects.length,
        projects: projects
    })
};

//******************** Get Single Project **********************/
const getSinlgeProject = async (req, res) => {
    const { id: projectId } = req.params;
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
        throw new NotFoundError(`No project with id ${projectId}`);
    }

    // checkPermission(req.user, project.user);

    await project.populate({
        path: 'user',
        select: 'name'
    })

    res.status(StatusCodes.OK).json({
        message: "Success",
        project: project
    })
};

//******************** Create Project ***********************/
const createProject = async (req, res) => {
    const { name, description } = req.body;
    const { userId: user } = req.user;

    if (!name || !description) {
        throw new BadRequestError("Please provide both project name and description")
    }

    const project = await Project.create({ name, description, user });

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        project: project,
    });

};

//******************** Update Project ***********************/
const updateProject = async (req, res) => {
    const { id: projectId } = req.params;
    let project = await Project.findOne({ _id: projectId });
    if (!project) {
        throw new NotFoundError(`No project with id ${projectId}`);
    }

    if (project.status === "closed") {
        throw new BadRequestError("You cannot update project details on closed project");
    }
    checkPermission(req.user, project.user);

    const { name, description } = req.body;
    project = await Project.findOneAndUpdate({ _id: project }, { name, description }, { new: true, runValidators: true });

    res.status(StatusCodes.OK).json({
        message: "Success",
        project: project
    })
};

//******************** Delete Project : ONLY AVAILABLE THROUGH API ************************/
const deleteProject = async (req, res) => {
    const { id: projectId } = req.params;
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
        throw new NotFoundError(`No project with id ${projectId}`);
    }

    checkPermission(req.user, project.user);

    await project.remove();
    res.status(StatusCodes.OK).json({
        message: "Success"
    })

};

//******************** Close Project ************************/
const closeProject = async (req, res) => {
    const { id: projectId } = req.params;
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
        throw new NotFoundError(`No project with id ${projectId}`);
    }

    checkPermission(req.user, project.user);

    const { password, name } = req.body;
    if (!password || !name) {
        throw new BadRequestError("Please provide both password and name");
    }
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId });
    const isPasswordMatch = await user.comparePasswords(password);
    if (!isPasswordMatch) {
        throw new BadRequestError("Please provide valid password");
    }

    const isNameMatch = project.compareName(name);
    if (!isNameMatch) {
        throw new BadRequestError("Please provide valid name");
    }

    project.status = 'closed';
    project.save();

    res.status(StatusCodes.OK).json({
        message: "Success",
        project: project
    })
};

module.exports = {
    getAllProjects,
    getSinlgeProject,
    createProject,
    deleteProject,
    updateProject,
    closeProject
}