const mongoose = require('mongoose');

/**
 * ISSUE SCHEMA :
 *              project: ObjectId, ref: project
 *              user: ObjectId, ref: User,
 *              title: String,
 *              description: String,
 *              label: String, enums
 */
const IssueSchema = new mongoose.Schema({

    project: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: [true, "Please provide project to which issue is created"]
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Issue must have user"]
    },

    title: {
        type: String,
        required: [true, "Please provide title of issue"]
    },

    description: {
        type: String,
        required: [true, "Please provide description to issue"],
        minLength: [10, "Description too short"]
    },

    label: {
        type: String,
        enum: ['unlabeled', 'bug', 'discussion', 'documentation', 'duplicate', 'enhancement', 'good-first-issue', 'help-wanted', 'invalid', 'question', 'wont-fix', 'closed'],
        default: 'unlabeled'
    }

}, {
    timestamps: true
});

//************************** aggregate function to calculate number of issues per project **************************/
IssueSchema.statics.calculateNumOfIssues = async function (projectId) {
    const result = await this.aggregate([
        { $match: { project: projectId } },
        { $group: { _id: null, numOfIssues: { $sum: 1 } } }
    ]);

    try {
        await this.model("Project").findOneAndUpdate({ _id: projectId }, { numOfIssues: result[0].numOfIssues })
    } catch (error) {
        throw new Error(error)
    }
}

//*************************** calculating number of issues on every post save hook of a issue *************************/
IssueSchema.post('save', async function () {
    await this.constructor.calculateNumOfIssues(this.project);
})


const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;