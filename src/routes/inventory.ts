import express from "express";
import {
  getdashboardData,
  pieChartData,
  barChartData,
  lineCharts,
} from "../controller/inventory.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

///api/v1/inventory/dashboard
app.get("/dashboard",adminOnly, getdashboardData);

//api/v1/inventory/pie
app.get("/pie",adminOnly, pieChartData);

//api/v1/inventory/bar
app.get("/bar",adminOnly, barChartData);

//api/v1/inventory/bar
app.get("/line",adminOnly, lineCharts);

export default app;
