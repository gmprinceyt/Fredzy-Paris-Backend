import express from 'express'
import { getDesboardData } from '../controller/inventory.js';

const app = express.Router();


///api/v1/inventory/desboard
app.get('/desboard', getDesboardData);

export default app;