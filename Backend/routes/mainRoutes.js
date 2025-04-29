import express from 'express';

const app = express.Router();

import authRoutes from './auth.js';
import userRoutes from './user.js';
import serviceRoutes from './service.js'
import bookingRoutes from './booking.js'

// middlwares
import validateToken from '../middlwares/validateTokenHandler.js';




app.use('/auth',authRoutes);
app.use('/user',validateToken,userRoutes);
app.use('/service',validateToken,serviceRoutes);
app.use('/booking',validateToken,bookingRoutes)

export default app;