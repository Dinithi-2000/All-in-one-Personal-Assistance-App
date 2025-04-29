import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from 'Component/UI/NavBar';
import api from 'Lib/api';
import Swal from 'sweetalert2';

// Placeholder image for services without an image
const PLACEHOLDER = '/Images/service-placeholder.png';

export default function ServicePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Static sample services to display when none exist
  // const sampleServices = [
  //   {
  //     _id: 'sample-1',
  //     title: 'Home Cleaning',
  //     description: 'Professional home cleaning: dusting, vacuuming, and mopping for a spotless home.',
  //     price: '75',
  //     category: 'Cleaning',
  //     imageUrl: '/Images/sample-cleaning.jpg'
  //   },
  // ];

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  // Fetch from API
  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchServices();
  }, [token]);

  const fetchServices = async () => {
    try {
      const res = await api.get('/service/get-my-services', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Ensure it's always an array
      const data = Array.isArray(res.data) ? res.data : [];
  
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
      Swal.fire('Error', 'Could not fetch services.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Decide whether to show real services or sample placeholders
  const displayServices = !loading && services.length === 0 ;

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit new service
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Success', 'Service added!', 'success');
      setShowModal(false);
      setFormData({ title: '', description: '', price: '', category: '', imageUrl: '' });
      fetchServices();
    } catch (err) {
      console.error('Failed to add service:', err);
      Swal.fire('Error', 'Could not add service.', 'error');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const clickAddServiceHndle =() => {
    navigate('/service-selections');
  }

  // Retrieve stored user for NavBar
  const stored = localStorage.getItem('userData');
  const userData = stored ? JSON.parse(stored) : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar handleLogout={handleLogout} user={userData} />

      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#003366]">My Services</h1>
          <button
          onClick={() => clickAddServiceHndle()}
            //onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        </div>

        {loading ? (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600" />
  </div>
) : services.length === 0 ? (
  <div className="text-center py-20 text-gray-500 text-xl">
    You haven't added any services yet.
  </div>
) : (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {services.map(service => (
      <div
        key={service._id}
        className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition"
      >
        <img
          src={service.photo || PLACEHOLDER}
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-5">
          <h2 className="text-2xl font-semibold text-[#003366] mb-2">{service.serviceType}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{service.createdAt}</p>
          <div className="flex justify-between items-center">
            {Array.isArray(service.payRate) && service.payRate.length === 2 ? (
              <>
                <span className="text-xl font-bold text-teal-600">${service.payRate[0]}</span> -
                <span className="text-xl font-bold text-teal-600">${service.payRate[1]}</span>
              </>
            ) : (
              <span className="text-gray-500">No rate info</span>
            )}
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">{service.serviceType}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
        {/* Modal for adding a service */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl"
              >
                ×
              </button>
              <h3 className="text-2xl font-semibold text-[#003366] mb-4">New Service</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Create Service
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
