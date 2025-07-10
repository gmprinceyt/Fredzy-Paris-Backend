import express  from "express";
import { configDotenv } from "dotenv";
import { connect } from "./utils/database.connect.js";
import { logger } from "./utils/logger.js";
import { ErrorMiddleware } from "./middleware/error.js";
configDotenv();
const app = express();

// Basic Middlewere
app.use(express.json()); // accept json value in req.body


import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js"
//? Route Register
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product",productRoute )

// Error Middleware! Make Sure This Route At Last Line of Other Routes.
app.use(ErrorMiddleware);


//? Connect Database or Server listen by Express
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
