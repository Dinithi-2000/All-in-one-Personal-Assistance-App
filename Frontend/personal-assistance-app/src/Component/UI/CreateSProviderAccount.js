import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { 
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import { CloudUpload, Visibility, VisibilityOff, Person, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3803/api'; // Backend base URL

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: '#FAF9F6',
  padding: theme.spacing(4),
}));

const StyledForm = styled('form')(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#40E0D0',
  color: 'white',
  padding: theme.spacing(1.5, 4),
  '&:hover': {
    backgroundColor: '#38CAB8',
    boxShadow: theme.shadows[4],
  },
  '&:disabled': {
    backgroundColor: '#CCF0EB',
    color: '#88D8CF',
  },
}));

const CreateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceData = location.state?.serviceData || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    policeClearance: null,
    photo: null, // Add photo field
    agreedToTerms: false,
    showPassword: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    policeClearance: '',
    photo: '',
    agreedToTerms: '',
  });

  const [policeClearanceFileName, setPoliceClearanceFileName] = useState(''); 

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result }); // Update formData with the photo URL
      };
      reader.readAsDataURL(file); // Convert the file to a base64 URL
    }
  };

  const handlePoliceClearanceChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, policeClearance: file });
      setPoliceClearanceFileName(file.name); // Set the file name for display
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    if (!validateForm()) {
      setLoading(false);
      return;
    }
  
    try {
      const profileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        serviceType: serviceData.serviceType || 'General',
        location: serviceData.location || 'Default Location',
        payRate: serviceData.payRate || [500, 2000],
        selectedLanguages: serviceData.selectedLanguages || ['English'],
        about: 'Sample about text',
        selectedServices: serviceData.selectedServices || ['Default Service'],
        policeClearance: URL.createObjectURL(formData.policeClearance),
        photo: formData.photo || 'https://via.placeholder.com/200',// Default photo (or handle user-uploaded photo)
        selectedPetTypes: serviceData.selectedPetTypes || [], // Optional field
        selectedSyllabi: serviceData.selectedSyllabi || [], // Optional field
        selectedSubjects: serviceData.selectedSubjects || [], // Optional field
        selectedGrades: serviceData.selectedGrades || [], // Optional field
        selectedAgeGroups: serviceData.selectedAgeGroups || [], // Optional field
      };

      console.log('Profile Data:', profileData);
  
      const response = await axios.post(`${API_BASE_URL}/create-service-provider`, profileData);
      localStorage.setItem('serviceProviderProfile', JSON.stringify(response.data));
      navigate('/viewspprofile');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Error:', err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#000080' }}>
        Create Your Account
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: '#000080', mb: 4 }}>
        Create an account to get started
      </Typography>

      <StyledForm onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: '#FFF5F2', color: '#FF7F50' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
           {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name *"
              variant="outlined"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={!!errors.firstName}
              helperText={errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#40E0D0' },
                },
              }}
            />
          </Grid>
          {/* Last Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name *"
              variant="outlined"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#40E0D0' },
                },
              }}
            />
          </Grid>

              {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#40E0D0' },
                },
              }}
            />
          </Grid>

{/* Mobile Number */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mobile Number *"
              variant="outlined"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, mobile: value });
              }}
              error={!!errors.mobile}
              helperText={errors.mobile}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    +94
                  </InputAdornment>
                ),
                inputProps: {
                  maxLength: 9,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#40E0D0' },
                },
              }}
            />
          </Grid>

{/* Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password *"
              type={formData.showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                    >
                      {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#40E0D0' },
                },
              }}
            />
          </Grid>

          {/* Confirm Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm Password *"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#40E0D0' },
                },
              }}
            />
          </Grid>

 {/* Police Clearance Report Input Field */}
 <Grid item xs={12}>
    {policeClearanceFileName && ( // Display the uploaded file name
      <Box sx={{ mb: 2 }}>
        <Chip
          label={`Uploaded: ${policeClearanceFileName}`}
          onDelete={() => {
            setFormData({ ...formData, policeClearance: null });
            setPoliceClearanceFileName('');
          }}
          sx={{ backgroundColor: '#40E0D0', color: 'white' }}
        />
      </Box>
    )}
    <Button
      component="label"
      variant="outlined"
      startIcon={<CloudUpload />}
      sx={{
        width: '100%',
        py: 2,
        border: '2px dashed #40E0D0',
        color: '#000080',
        '&:hover': {
          border: '2px dashed #38CAB8',
        },
      }}
    >
      Upload Police Clearance Certificate *
      <input
        type="file"
        hidden
        accept=".pdf,.jpg,.png"
        onChange={handlePoliceClearanceChange}
      />
    </Button>
    {errors.policeClearance && (
      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
        {errors.policeClearance}
      </Typography>
    )}
  </Grid>
          {/* Profile Photo */}
          <Grid item xs={12}>
            {formData.photo && (
              <Avatar
                src={formData.photo}
                alt="Profile Photo"
                sx={{ width: 100, height: 100, mb: 2 }}
              />
            )}
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              sx={{
                width: '100%',
                py: 2,
                border: '2px dashed #40E0D0',
                color: '#000080',
                '&:hover': {
                  border: '2px dashed #38CAB8',
                },
              }}
            >
              Upload Profile Photo *
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
            {errors.photo && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.photo}
              </Typography>
            )}
          </Grid>


          {/* Terms and Conditions */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  sx={{
                    color: '#40E0D0',
                    '&.Mui-checked': {
                      color: '#40E0D0',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#000080' }}>
                  I agree to SereniLux's{' '}
                  <Link href="#" sx={{ color: '#40E0D0', fontWeight: 500 }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" sx={{ color: '#40E0D0', fontWeight: 500 }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
            {errors.agreedToTerms && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: -1 }}>
                {errors.agreedToTerms}
              </Typography>
            )}
          </Grid>

{/* Create Account Button */}
          <Grid item xs={12}>
            <StyledButton
              fullWidth
              type="submit"
              disabled={loading}
              variant="contained"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </StyledButton>
          </Grid>
        </Grid>
      </StyledForm>
    </StyledContainer>
  );
};

export default CreateAccount;