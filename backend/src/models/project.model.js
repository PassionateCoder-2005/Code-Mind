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
        type:Object,
        required: [true, 'Project files are required']
    },
    folders: {
        type:Array,
        required: [true, 'Project folder is required']
    },
},{
    timestamps: true
});
const projectModel = mongoose.model('project', projectSchema);
export default projectModel;