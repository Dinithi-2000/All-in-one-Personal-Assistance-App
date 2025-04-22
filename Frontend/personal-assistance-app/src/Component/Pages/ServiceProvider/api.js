import axios from 'axios';

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider'; // Backend base URL

// Create a new service provider
export const createServiceProvider = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-service-provider`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating service provider:', error);
    throw error;
  }
};

// Get all service providers
export const getAllServiceProviders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service-providers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service providers:', error);
    throw error;
  }
};

// Get a single service provider by ID
export const getServiceProviderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service-providers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service provider:', error);
    throw error;
  }
};

export const updateServiceProvider = async (id, data) => {
  try {
    console.log('Updating service provider with ID:', id);
    console.log('Data being sent:', data);

    const response = await axios.put(`${API_BASE_URL}/update-service-provider/${id}`, data);
    console.log('Update response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error updating service provider:', error);
    throw error;
  }
};
// Delete a service provider by ID
export const deleteServiceProvider = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete-service-provider/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service provider:', error);
    throw error;
  }
};