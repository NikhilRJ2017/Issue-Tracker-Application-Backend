const Issue = require('../models/Issue');
const Project = require('../models/Project');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../config/errors');
const { checkPermission } = require('../config/utils');



//********************** Get All Issues ***********************/
const getAllIssues = async (req, res) => {
    const { projectId } = req.params;

    await isProjectExists(projectId);

    const { title, label } = req.query;
    const queryObject = {};

    queryObject.project = projectId;

    //*searching by issue title
    if (title) {
        queryObject.title = { $regex: title, $options: 'i' };
    }

    //*searching by issue label
    if (label) {
        let regexLabels = label.replace(/,/g, '|');
        queryObject.label = { $regex: regexLabels, $options: 'i' };
    }

    const issues = await Issue.find(queryObject)
        .populate({
            path: "user",
            select: "name"
        }).sort({ createdAt: -1 });
    
    
    res.status(StatusCodes.OK).json({
        message: "Success",
        count: issues.length,
        issues: issues
    })
}

//********************** Create Issue ***********************/
const createIssue = async (req, res) => {
    const { projectId } = req.params;

    // *check if project exists and the status is open 
    await isProjectExists(projectId);

    const { title, description, label } = req.body;
    if (!title || !description) {
        throw new BadRequestError("Please provide both title and description for the issue");
    }

    const { userId } = req.user;
    let issue;
    if (!label) {
        issue = await Issue.create({ title, description, user: userId, project: projectId })
    } else {
        issue = await Issue.create({ title, description, label, user: userId, project: projectId });
    }

    res.status(StatusCodes.CREATED).json({
        message: "Success",
        issue: issue
    })
}

//********************* Update Issue: AVAILABLE ONLY THROUGH API ***********************/
const updateIssue = async (req, res) => {

    const { label } = req.body;
    if (!label) {
        throw new BadRequestError("Please provide label for the issue");
    }
    const { projectId, issueId } = req.params;

    //*check if project exists and status is open
    const project = await isProjectExists(projectId);

    //*check if issue exists
    const issue = await isIssueExists(issueId, projectId);

    //*check if the logged in user is the creater of project i.e author of project
    checkPermission(req.user, project.user)

    //*update only label of issue
    issue.label = label;
    issue.save();

    await issue.populate({ path: "user", select: "name" });

    res.status(StatusCodes.OK).json({
        message: "Success",
        issue: issue
    })
}

//********************* get all enums of labels *********************/
const getAllLabels = async (req, res) => {
    const enumValues = await Issue.schema.path('label').enumValues;

    res.status(StatusCodes.OK).json({
        message: "Success",
        labels: enumValues
    });
}

//********************* check if project exists *********************/
const isProjectExists = async (projectId) => {
    const project = await Project.findOne({ _id: projectId, status: 'open' });
    if (!project) {
        throw new NotFoundError(`No project with id ${projectId} is open project`);
    }

    return project;
}

//********************* check if issue exists *********************/
const isIssueExists = async (issueId, projectId) => {
    const issue = await Issue.findOne({ _id: issueId, project: projectId });
    if (!issue) {
        throw new NotFoundError(`No issue with id ${issueId} for project with id ${projectId}`);
    }

    return issue;
}
module.exports = {
    getAllIssues,
    createIssue,
    updateIssue,
    getAllLabels
}