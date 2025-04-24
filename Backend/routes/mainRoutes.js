import express from 'express';

const app = express.Router();

import authRoutes from './auth.js';
import userRoutes from './user.js';


app.use('/auth',authRoutes);
app.use('/user/',userRoutes)

export default app;