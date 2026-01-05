import { userAuth } from "../middelware/user-auth.js";  // Corrected the folder name (from "middelware" to "middleware")
import express from 'express';
import { getUserData } from "../controller/user-controller.js";

const userRouter = express.Router();  // Use only Router, not app.use here.

// Define your route
userRouter.get("/data", userAuth, getUserData);  // Define the route with middleware first, then controller

export default userRouter;  // Export the router
