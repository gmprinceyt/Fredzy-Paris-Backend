import express from "express";
import { delateUser, getallUser, getUser, newUser } from "../controller/user.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();
//router -> api/v1/user/new
app.post("/new", newUser);
//router -> api/v1/user/all
app.get("/all", adminOnly, getallUser);
//router -> api/v1/user/:id ? Dynemic Routing
app.route("/:id").get(getUser).delete(adminOnly, delateUser);
export default app;
//# sourceMappingURL=user.js.map