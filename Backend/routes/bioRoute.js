import express from 'express';
import { submitBioData } from '../controllers/bioController.js';

const router = express.Router();

router.post('/submit', submitBioData);

export default router;