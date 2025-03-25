import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const API_BASE_URL = 'http://localhost:5000/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Configure axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  // Add request interceptor for token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor for error handling
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Auto-logout if 401 response returned from api
        logout();
        message.error('Session expired. Please login again.');
      }
      return Promise.reject(error);
    }
  );

  // Check auth status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const [userRes, bioRes] = await Promise.all([
            api.get('/auth/me'),
            api.get('/biodata').catch(() => ({ data: null }))
          ]);

          setUser(userRes.data);
          setBioData(bioRes?.data || null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Register new user
  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      message.success('Registration successful! Please login');
      navigate('/login');
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User login
  const login = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data);

      // Fetch bio data after login
      try {
        const bioRes = await api.get('/biodata');
        setBioData(bioRes.data);
        
        if (!bioRes.data) {
          message.warning(
            'Please complete your biomedical data for better healthcare services',
            6
          );
        }
      } catch (bioError) {
        console.error('Bio data fetch error:', bioError);
        setBioData(null);
      }

      navigate('/profile');
      return res.data;
    } catch (error) {
      let errorMsg = 'Login failed';
      if (error.response) {
        errorMsg = error.response.data.message || errorMsg;
        if (error.response.status === 401) {
          errorMsg = 'Invalid email or password';
        }
      }
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setBioData(null);
    navigate('/login');
    message.success('Logged out successfully');
  };

  // Get biomedical data
  const getBioData = async () => {
    try {
      const res = await api.get('/biodata');
      setBioData(res.data || null);
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        setBioData(null);
        return null;
      }
      const errorMsg = error.response?.data?.message || 'Failed to load biomedical data';
      message.error(errorMsg);
      throw error;
    }
  };

  // Save biomedical data (create or update)
  const saveBioData = async (data) => {
    try {
      setLoading(true);
      const res = await api.post('/biodata', data);
      setBioData(res.data);
      message.success('Biomedical data saved successfully');
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save biomedical data';
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete biomedical data
  const deleteBioData = async () => {
    try {
      await api.delete('/biodata');
      setBioData(null);
      message.success('Biomedical data deleted');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete biomedical data';
      message.error(errorMsg);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const res = await api.put('/users/profile', data);
      setUser(res.data);
      message.success('Profile updated successfully');
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile';
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/forgotpassword', { email });
      message.success(res.data.message || 'Password reset email sent');
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send reset email';
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const res = await api.put(`/auth/resetpassword/${token}`, { password });
      message.success(res.data.message || 'Password reset successfully');
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to reset password';
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        bioData,
        loading,
        authChecked,
        register,
        login,
        logout,
        getBioData,
        saveBioData,
        deleteBioData,
        updateProfile,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};