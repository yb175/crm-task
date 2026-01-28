import express from "express";
import userController from "../../controllers/user/userController.js";
import adminMiddleware from "../../middleware/adminmiddleware.js";

const userRouter = express.Router();

userRouter.get("/", adminMiddleware, userController.getAllUsers);
userRouter.get("/:id", adminMiddleware, userController.getUserById);
userRouter.patch("/:id", adminMiddleware, userController.updateUserRole);

export default userRouter;