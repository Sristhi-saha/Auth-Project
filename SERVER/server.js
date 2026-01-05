import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// connect DB
connectDb();

import path from "path";
import userRouter from "./routes/userRoute.js";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const allowedorigins = ['http://localhost:5174']

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:allowedorigins,credentials: true }));

// routes
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);

app.listen(port, () =>
  console.log(`Server started on port: ${port}`)
);
