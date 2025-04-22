import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getBioData,
  createOrUpdateBioData,
  deleteBioData
} from '../controllers/bioDataController.js';

const router = express.Router();

router.route('/')
  .get(protect, getBioData)
  .post(protect, createOrUpdateBioData)
  .delete(protect, deleteBioData);

export default router;