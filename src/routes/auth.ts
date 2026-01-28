import express from "express";
import registerUser from "../../controllers/auth/register.js";
import loginUser from "../../controllers/auth/login.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);


export default authRouter;
