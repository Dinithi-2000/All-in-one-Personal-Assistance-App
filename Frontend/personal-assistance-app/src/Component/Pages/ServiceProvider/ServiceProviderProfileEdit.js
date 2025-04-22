import React, { useState, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { updateServiceProvider } from './api'; 
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Avatar,
  Paper
} from '@mui/material';
import { CloudUpload, Edit } from '@mui/icons-material';
import { initialProfileData, validateProfile } from './ServiceProviderData';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider'; // Backend base URL

const EditServiceProviderProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { serviceType, id } = location.state || {};
  console.log('ID from location.state:', id); // Debugging

  const [profileData, setProfileData] = useState(initialProfileData(serviceType));
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [formData, setFormData] = useState({});
const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('serviceProviderProfile');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Retrieved Profile Data:', parsedData);
        setProfileData(parsedData);
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }
  }, [serviceType]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
  
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }
  
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
  
    // Mobile validation
    const mobileRegex = /^[0-9]{9}$/;
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be 9 digits';
      isValid = false;
    }
  
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least 6 characters, one uppercase, one lowercase, one number, and one special character';
      isValid = false;
    }
  
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
  
    // Police Clearance validation
    if (!formData.policeClearance) {
      newErrors.policeClearance = 'Police Clearance Certificate is required';
      isValid = false;
    }
  
    // Photo validation
    if (!formData.photo) {
      newErrors.photo = 'Profile photo is required';
      isValid = false;
    }
  
    // Terms agreement validation
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, photo: reader.result });
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(`Checkbox ${name} is ${checked ? 'checked' : 'unchecked'}`);
    setProfileData((prevState) => ({
      ...prevState,
      selectedServices: checked
        ? [...prevState.selectedServices, name]
        : prevState.selectedServices.filter((service) => service !== name),
    }));
    console.log('Updated selectedServices:', profileData.selectedServices);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await updateServiceProvider(id, updatedData);
      console.log('Update successful:', response);
      // Optionally, show a success message to the user
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating service provider:', error);
      // Optionally, show an error message to the user
      alert('Failed to update profile. Please try again.');
    }
  };

  
const handleSaveProfile = async () => {
  if (loading) return; // Prevent multiple submissions
  setLoading(true);

  const validationErrors = validateProfile(profileData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setLoading(false);
    return;
  }

  try {
    const updatedData = {
      name: profileData.name,
        email: profileData.email,
        password: profileData.password,
        serviceType: profileData.serviceType,
        location: profileData.location,
        payRate: profileData.payRate,
        selectedLanguages: profileData.selectedLanguages,
        about: profileData.about,
        selectedServices: profileData.selectedServices,
        policeClearance: profileData.policeClearance,
        photo: profileData.photo || 'https://via.placeholder.com/200',
        selectedPetTypes: profileData.selectedPetTypes || [],
        selectedSyllabi: profileData.selectedSyllabi || [],
        selectedSubjects: profileData.selectedSubjects || [],
        selectedGrades: profileData.selectedGrades || [],
        selectedAgeGroups: profileData.selectedAgeGroups || [],

    };

    console.log('Updating profile with ID:', id);
    console.log('Updated data:', updatedData);

    const response = await updateServiceProvider(id, updatedData);
    console.log('Update response:', response);

    if (response && response.data) {
      localStorage.setItem('serviceProviderProfile', JSON.stringify(response.data));
      navigate('/viewspprofile');
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile. Please try again.');
  } finally {
    setLoading(false); // Reset loading state
  }
};

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!validateForm()) {
      setLoading(false);
      return;
    }
  
    try {
      const updatedData = {
        name: profileData.name,
        email: profileData.email,
        password: profileData.password,
        serviceType: profileData.serviceType, 
        location: profileData.location,
        payRate: profileData.payRate,
        selectedLanguages: profileData.selectedLanguages,
        about: profileData.about,
        selectedServices: profileData.selectedServices,
        policeClearance: profileData.policeClearance, 
        photo: profileData.photo || 'https://via.placeholder.com/200', 
        selectedPetTypes: profileData.selectedPetTypes || [],
        selectedSyllabi: profileData.selectedSyllabi || [],
        selectedSubjects: profileData.selectedSubjects || [],
        selectedGrades: profileData.selectedGrades || [],
        selectedAgeGroups: profileData.selectedAgeGroups || [],
      };
  
      console.log('Updating profile with ID:', id);
      console.log('Updated data:', updatedData);
  
      // Call the update API
      const response = await updateServiceProvider(id, updatedData);
      console.log('Update response:', response);
  
      // Save the updated data to localStorage
      localStorage.setItem('serviceProviderProfile', JSON.stringify(updatedData));
  
      
      navigate('/viewspprofile');
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`); 
      console.error('Error:', err.response?.data || err.message); 
    } finally {
      setLoading(false); //loadding state reset
    }
  };
  
  const getServicesOffered = () => {
    switch (serviceType) {
      case 'PetCare':
        return ['Walking', 'Day Care', 'Overnight Sitting', 'Training', 'Grooming', 'Transportation'];
      case 'ChildCare':
        return ['Day Care', 'After School Care', 'Nannies', 'Baby Sitters', 'In-Home Care', 'Childminders'];
      case 'Education':
        return [];
      case 'HouseCleaning':
        return ['Bathroom Cleaning', 'Carpet Cleaning', 'Kitchen Cleaning', 'Laundry', 'Windows Cleaning'];
      case 'KitchenHelpers':
        return ['Birthday', 'Family Reunion', 'Friends Gathering', 'Alms Giving', 'Foodie Adventure', 'Other'];
      case 'ElderCare':
        return ['Personal Care', 'Transportation', 'Specialized Care', 'Household Tasks', 'Hospice Care', 'Nursing and Health Care'];
      default:
        return ['House Cleaning', 'Kitchen Helpers', 'Elder Care', 'Pet Care', 'Child Care', 'Education'];
    }
  };

  const renderServiceSpecificFields = () => {
    switch (serviceType) {
      case 'PetCare':
        return (
          <>
            {/* Pet Types */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                Pet Types
              </Typography>
              {['Dogs', 'Cats', 'Birds', 'Fish'].map((pet) => (
                <FormControlLabel
                  key={pet}
                  control={
                    <Checkbox
                      name={pet}
                      checked={profileData.selectedPetTypes?.includes(pet) || false}
                      onChange={(e) => {
                        const { name, checked } = e.target;
                        setProfileData((prevState) => ({
                          ...prevState,
                          selectedPetTypes: checked
                            ? [...prevState.selectedPetTypes, name]
                            : prevState.selectedPetTypes.filter((type) => type !== name),
                        }));
                      }}
                      sx={{ color: '#40E0D0' }}
                    />
                  }
                  label={pet}
                />
              ))}
            </Grid>
          </>
        );
      case 'ChildCare':
        return (
          <>
            {/* Age Groups */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                Age Groups
              </Typography>
              {['Newborn', 'Toddler', 'Pre-school', 'Primary School', 'Teenager (12+ years)'].map((age) => (
                <FormControlLabel
                  key={age}
                  control={
                    <Checkbox
                      name={age}
                      checked={profileData.selectedAgeGroups?.includes(age) || false}
                      onChange={(e) => {
                        const { name, checked } = e.target;
                        setProfileData((prevState) => ({
                          ...prevState,
                          selectedAgeGroups: checked
                            ? [...prevState.selectedAgeGroups, name]
                            : prevState.selectedAgeGroups.filter((group) => group !== name),
                        }));
                      }}
                      sx={{ color: '#40E0D0' }}
                    />
                  }
                  label={age}
                />
              ))}
            </Grid>
          </>
        );
      case 'Education':
        return (
          <>
            {/* Syllabus */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                Syllabus
              </Typography>
              {['Local Syllabus', 'Cambridge Syllabus', 'Edxcel Syllabus'].map((syllabus) => (
                <FormControlLabel
                  key={syllabus}
                  control={
                    <Checkbox
                      name={syllabus}
                      checked={profileData.selectedSyllabi?.includes(syllabus) || false}
                      onChange={(e) => {
                        const { name, checked } = e.target;
                        setProfileData((prevState) => ({
                          ...prevState,
                          selectedSyllabi: checked
                            ? [...prevState.selectedSyllabi, name]
                            : prevState.selectedSyllabi.filter((syl) => syl !== name),
                        }));
                      }}
                      sx={{ color: '#40E0D0' }}
                    />
                  }
                  label={syllabus}
                />
              ))}
            </Grid>
            {/* Subjects */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                Subjects
              </Typography>
              {['Art', 'Business', 'ICT', 'Mathematics', 'Physics', 'Science', 'Music', 'English', 'Chemistry', 'History', 'Other Languages'].map((subject) => (
                <FormControlLabel
                  key={subject}
                  control={
                    <Checkbox
                      name={subject}
                      checked={profileData.selectedSubjects?.includes(subject) || false}
                      onChange={(e) => {
                        const { name, checked } = e.target;
                        setProfileData((prevState) => ({
                          ...prevState,
                          selectedSubjects: checked
                            ? [...prevState.selectedSubjects, name]
                            : prevState.selectedSubjects.filter((sub) => sub !== name),
                        }));
                      }}
                      sx={{ color: '#40E0D0' }}
                    />
                  }
                  label={subject}
                />
              ))}
            </Grid>
            {/* Grades */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                Grades
              </Typography>
              {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'O/L', 'A/L'].map((grade) => (
                <FormControlLabel
                  key={grade}
                  control={
                    <Checkbox
                      name={grade}
                      checked={profileData.selectedGrades?.includes(grade) || false}
                      onChange={(e) => {
                        const { name, checked } = e.target;
                        setProfileData((prevState) => ({
                          ...prevState,
                          selectedGrades: checked
                            ? [...prevState.selectedGrades, name]
                            : prevState.selectedGrades.filter((grd) => grd !== name),
                        }));
                      }}
                      sx={{ color: '#40E0D0' }}
                    />
                  }
                  label={grade}
                />
              ))}
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        backgroundColor: '#FAF9F6', 
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h4" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 4 }}>
          Edit {serviceType} Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Photo */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={profileData.photo}
                alt="Profile Photo"
                sx={{ width: 100, height: 100 }}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                sx={{
                  backgroundColor: '#40E0D0', // Turquoise blue
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#38CAB8',
                  },
                }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden 
                  accept="image/*"
                  
                  onChange={handlePhotoChange}
                />
              </Button>
              <TextField
                fullWidth
                label="Or Enter Image URL"
                name="photo"
                value={profileData.photo}
                onChange={handleChange}
                sx={{ flex: 1 }}
              />
            </Box>
          </Grid>

          {/* Common Fields */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={profileData.name || ''}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                name="location"
                value={profileData.location || ''}
                onChange={handleChange}
                error={!!errors.location}
              >
                {[
                  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'
                ].map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
              {errors.location && (
                <Typography color="error" variant="caption">
                  {errors.location}
                </Typography>
              )}
            </FormControl>
          </Grid>
    
{/* Pay Rate */}

<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Min Hourly Rate (RS)"
    name="payRate[0]"
    type="number"
    value={profileData.payRate[0] || 500}
    onChange={(e) => {
      const newPayRate = [...profileData.payRate];
      newPayRate[0] = e.target.value;
      setProfileData({ ...profileData, payRate: newPayRate });
    }}
    error={!!errors.payRate}
    helperText={errors.payRate}
    sx={{ mb: 2 }}
  />
</Grid>
<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Max Hourly Rate (RS)"
    name="payRate[1]"
    type="number"
    value={profileData.payRate[1] || 2000}
    onChange={(e) => {
      const newPayRate = [...profileData.payRate];
      newPayRate[1] = e.target.value;
      setProfileData({ ...profileData, payRate: newPayRate });
    }}
    error={!!errors.payRate}
    helperText={errors.payRate}
    sx={{ mb: 2 }}
  />
</Grid>

          {/* Languages Spoken */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
              Languages Spoken
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Languages</InputLabel>
              <Select
                multiple
                value={profileData.selectedLanguages || []}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    selectedLanguages: e.target.value,
                  })
                }
                renderValue={(selected) => selected.join(', ')}
                error={!!errors.selectedLanguages}
              >
                {['Sinhala', 'English', 'Tamil'].map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
              {errors.selectedLanguages && (
                <Typography color="error" variant="caption">
                  {errors.selectedLanguages}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* About Me Section */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="About Me"
              name="about"
              value={profileData.about || ''}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!errors.about}
              helperText={errors.about}
              sx={{ mb: 2 }}
            />
          </Grid>


          {/* Services Offered */}
          {serviceType !== 'Education' && (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
              Services Offered
            </Typography>
            {getServicesOffered().map((service) => (
              <FormControlLabel
                key={service}
                control={
                  <Checkbox
                    name={service}
                    checked={profileData.selectedServices?.includes(service) || false}
                    //onChange={handleCheckboxChange}
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      setProfileData((prevState) => ({
                        ...prevState,
                        selectedServices: checked
                          ? [...prevState.selectedServices, name]
                          : prevState.selectedServices.filter((s) => s !== name),
                      }));
                    }}
                    sx={{ color: '#40E0D0' }}
                  />
                }
                label={service}
              />
            ))}
            {errors.selectedServices && (
              <Typography color="error" variant="caption">
                {errors.selectedServices}
              </Typography>
            )}
          </Grid>
           )}

          {/* Service-Specific Fields */}
          {renderServiceSpecificFields()}

          {/* Save Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveProfile}
              sx={{backgroundColor: '#40E0D0', // Turquoise blue
                color: 'white',
                py: 1.5,
                px: 4,
                '&:hover': {
                  backgroundColor: '#38CAB8',
                },
              }}
            >
              Save Profile
            </Button>
          </Grid>
        </Grid>
        </Paper>
    </Container>
  );
};

export default EditServiceProviderProfile;