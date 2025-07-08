import express from "express";
import { delateUser, getallUser, getUser, newUser } from "../controller/user.js";

const app = express.Router();

//router -> api/v1/user/new
app.post("/new", newUser);

//router -> api/v1/user/all
app.get("/all", getallUser);

//router -> api/v1/user/:id ? Dynemic Routing
app.get("/:id", getUser);
//router -> api/v1/user/:id ? Dynemic Routing
app.delete("/:id", delateUser);

export default app;
