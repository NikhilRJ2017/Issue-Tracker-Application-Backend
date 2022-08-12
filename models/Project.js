const mongoose = require('mongoose');

/**
 * PROJECT SCHEMA:
 *              name: String,
 *              description: String,
 *              status: String, enum,
 *              numOfIssues: Number,
 *              user: ObjectId, ref: User
 */
const ProjectSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please provide project name"],
        maxLength: [30, "Project Name too long"],
        unique: true,
        trim: true
    },

    description: {
        type: String,
        required: [true, "Please provide project description"],
        minLength: [10, "Description too short"]
    },

    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },

    numOfIssues: {
        type: Number,
        default: 0
    },
    
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Project must have author"]
    }
    
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

//******************** comparing project name, keeping them unique *********************/
ProjectSchema.methods.compareName = function(name){ 
    return this.name === name;
}

// removing all associated issues when removing project using pre remove hook
ProjectSchema.pre('remove', async function () {
    await this.model('Issue').deleteMany({ project: this._id });
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;