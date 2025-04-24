import express from 'express';

const app = express.Router();

import authRoutes from './auth.js';
import userRoutes from './user.js';
import validateToken from '../middlwares/validateTokenHandler.js';




app.use('/auth',authRoutes);
app.use('/user/',validateToken,userRoutes)

export default app;