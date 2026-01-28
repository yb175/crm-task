import express from "express";
import { createTask,getTasks, updateTaskStatus } from "../../controllers/tasks/tasksController.js";
import adminMiddleware from "../../middleware/adminmiddleware.js";
import userMiddleware from "../../middleware/usermiddleware.js";

const tasksRouter = express.Router();

tasksRouter.post("/", adminMiddleware, createTask);


tasksRouter.get("/", userMiddleware, getTasks);


tasksRouter.patch("/:id/status", userMiddleware, updateTaskStatus);

export default tasksRouter;