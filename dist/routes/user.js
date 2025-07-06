import express from "express";
import { newUser } from "../controller/user.js";
const app = express.Router();
//router -> api/v1/user/new
app.post("/new", newUser);
export default app;
