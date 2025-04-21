import mongoose from 'mongoose';
import ServiceProvider from './ServiceProvider.js';

// Create a new service provider
export const createServiceProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      serviceType,
      location,
      payRate,
      selectedLanguages,
      about,
      selectedServices,
      policeClearance,
      photo,
      selectedPetTypes,
      selectedSyllabi,
      selectedSubjects,
      selectedGrades,
      selectedAgeGroups,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !serviceType ||
      !location ||
      !payRate ||
      !selectedLanguages ||
      !about ||
      !selectedServices ||
      !policeClearance ||
      !photo
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newServiceProvider = new ServiceProvider({
      name,
      email,
      password,
      serviceType,
      location,
      payRate,
      selectedLanguages,
      about,
      selectedServices,
      policeClearance,
      photo,
      selectedPetTypes: selectedPetTypes || [],
      selectedSyllabi: selectedSyllabi || [],
      selectedSubjects: selectedSubjects || [],
      selectedGrades: selectedGrades || [],
      selectedAgeGroups: selectedAgeGroups || [],
    });

    await newServiceProvider.save();
    res.status(201).json(newServiceProvider);
  } catch (error) {
    console.error('Error creating service provider:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all service providers
export const getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviders = await ServiceProvider.find();
    res.status(200).json(serviceProviders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single service provider by ID
export const getServiceProviderById = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.status(200).json(serviceProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a service provider by ID
export const updateServiceProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log('Received ID:', id);
    console.log('Received updated data:', updatedData);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedServiceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    console.log('Updated service provider:', updatedServiceProvider);
    res.status(200).json({ data: updatedServiceProvider }); // Wrap the response in a `data` field
  } catch (error) {
    console.error('Error updating service provider:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a service provider by ID
export const deleteServiceProvider = async (req, res) => {
  try {
    const deletedServiceProvider = await ServiceProvider.findByIdAndDelete(req.params.id);
    if (!deletedServiceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.status(200).json({ message: 'Service provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};