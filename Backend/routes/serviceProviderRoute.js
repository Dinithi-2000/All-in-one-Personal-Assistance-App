import express from 'express';
const router = express.Router();
import {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider,
} from '../models/servicePController.js';

// Create a new service provider
router.post('/create-service-provider', createServiceProvider);

// Get all service providers
router.get('/service-providers', getAllServiceProviders);

// Get a single service provider by ID
router.get('/service-providers/:id', getServiceProviderById);

// Update a service provider by ID
router.put('/update-service-provider/:id', updateServiceProvider);

// Delete a service provider by ID
router.delete('/delete-service-provider/:id', deleteServiceProvider);

// Export the router as the default export
export default router;