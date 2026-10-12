import {Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createProject,getAllProjects,getProjectById,updateProject ,deleteProject} from "../controllers/project.controller.js";
const projectRouter=Router();
/**
 * @route POST /api/projects/create
 * @desc Create a new project
 * @access Private (requires authentication)
 */
projectRouter.post("/create",authMiddleware, createProject)

/** 
    * @route GET /api/projects/get-all
    * @desc Get all projects for the authenticated user
    * @access Private (requires authentication)
   
*/

/**
  * @route GET /api/projects/get-all
  * @desc Get all projects for the authenticated user
  * @access Private (requires authentication)
 */
projectRouter.get("/get-all",authMiddleware, getAllProjects)

/**
 * @route GET /api/projects/get/:projectId
 * @desc Get a specific project by its ID for the authenticated user
 * @access Private (requires authentication)
 */
projectRouter.get("/get/:projectId",authMiddleware, getProjectById)

/**
 * @route PUT /api/projects/update/:projectId
 * @desc Update a specific project by its ID for the authenticated user
 * @access Private (requires authentication)
 */
projectRouter.put("/update/:projectId",authMiddleware, updateProject)

/**
 * @route DELETE /api/projects/delete/:projectId
 * @desc Delete a specific project by its ID for the authenticated user
 * @access Private (requires authentication)
 */
projectRouter.delete("/delete/:projectId",authMiddleware, deleteProject)

export default projectRouter