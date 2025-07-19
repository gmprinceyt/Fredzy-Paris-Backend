import express from 'express'
import { getdashboardData, pieChartData } from '../controller/inventory.js';

const app = express.Router();


///api/v1/inventory/dashboard
app.get('/dashboard', getdashboardData);


//api/v1/inventory/pie
app.get('/pie', pieChartData);

export default app;