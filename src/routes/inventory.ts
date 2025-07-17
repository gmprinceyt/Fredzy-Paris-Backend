import express from 'express'
import { getDesboardData } from '../controller/inventory.js';

const app = express.Router();

app.get('/desboard', getDesboardData)

export default app;