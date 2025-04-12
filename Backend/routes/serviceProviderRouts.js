const express = require('express');
const router = express.Router();
const {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider,
} = require('./controller');

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

module.exports = router;
