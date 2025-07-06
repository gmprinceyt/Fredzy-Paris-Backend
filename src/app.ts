import express from "express";
import { configDotenv } from "dotenv";
import userRoute from "./routes/user.js";
import { connect } from "./utils/database.connect.js";
import { logger } from "./utils/logger.js";
configDotenv();
const app = express();

// Basic Middlewere
app.use(express.json());

//? Routes 
app.use("/api/v1/user", userRoute);
app.get("/", (req, res) => {
  res.status(200).send("Working ");
});



//? Connect or Server listen by Express
const PORT = process.env.PORT || 4000;
function main() {
  connect().then(() => {
    app.listen(PORT, () => {
      logger.info(`Express runing  at http://localhost:${PORT}`);
    });
    app.on('error', (error)=> {
      logger.error("express server failed ", error)
    })
  });
}

main();
