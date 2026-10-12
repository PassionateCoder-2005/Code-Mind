import mongoose from 'mongoose';
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Project owner is required']
    },
    files: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
},
    folders: {
        type:Array,
        required: [true, 'Project folder is required']
    },
},{
    timestamps: true,
    minimize: false // Prevents Mongoose from removing empty objects
});
const projectModel = mongoose.model('project', projectSchema);
export default projectModel;