import projectModel from "../models/project.model.js";

export const createProject = async (req, res) => {
      try {
        const {name}=req.body;
        if(!name){
            return res.status(400).json({
                success:false,
                message:"Project name is required"
            });
        }
        const userId=req.userId;
        const newProject=await projectModel.create({
            name,
            owner:userId,
            files:{},
            folders:[]
        });
        return res.status(201).json({
            success:true,
            message:"Project created successfully",
            project:newProject
        });

    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};
export const getAllProjects = async (req, res) => {
    try {
        const userId=req.userId;
        const projects=await projectModel.find({owner:userId});
        if(!projects){
            return res.status(404).json({
                success:false,
                message:"No projects found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Projects fetched successfully",
            projects
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};
export const getProjectById = async (req, res) => {
    try {
        const {projectId}=req.params;
        const userId=req.userId;
        const project=await projectModel.findOne({_id:projectId,owner:userId});
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Project fetched successfully",
            project
        });
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};
export const updateProject = async (req, res) => {
    try {
        const {projectId}=req.params;
        const userId=req.userId;
        const {name,files,folders}=req.body;
        const project=await projectModel.findOne({_id:projectId,owner:userId});
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            });
        }
        const updatedProject=await projectModel.findByIdAndUpdate(projectId, {name,files,folders}, {new:true});
        return res.status(200).json({
            success:true,
            message:"Project updated successfully",
            project:updatedProject
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};
export const deleteProject = async (req, res) => {
    try {
        const {projectId}=req.params;
        const userId=req.userId;
        const project=await projectModel.findOne({_id:projectId,owner:userId});
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            });
        }
        await projectModel.findByIdAndDelete(projectId,{
            returnDocument: 'after'
        });
        return res.status(200).json({
            success:true,
            message:"Project deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};