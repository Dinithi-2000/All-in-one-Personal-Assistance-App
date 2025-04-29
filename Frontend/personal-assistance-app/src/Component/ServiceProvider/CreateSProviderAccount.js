import React, { useState,useEffect } from 'react';
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
  Chip,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { CloudUpload, Visibility, VisibilityOff, Person, Email } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import NavBar from 'Component/UI/NavBar';
import api from 'Lib/api';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider'; // Backend base URL

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
    photo: null,
    nic: '',
    birthCertificate: null,
    availability: '',
    gender: '',
    agreedToTerms: false,
    showPassword: false,
  });

  const [userData, setUserData] = useState({});
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
    nic: '',
    birthCertificate: '',
    availability: '',
    gender: '',
    agreedToTerms: '',
  });

  const [policeClearanceFileName, setPoliceClearanceFileName] = useState('');
  const [birthCertificateFileName, setBirthCertificateFileName] = useState('');

  useEffect(() => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch (error) {
          console.error("Failed to parse userData from localStorage:", error);
        }
      }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/"); // Redirect to home
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Police Clearance validation
    if (!formData.policeClearance) {
      newErrors.policeClearance = 'Police Clearance Certificate is required';
      isValid = false;
    } else {
      newErrors.policeClearance = '';
    }

    // Photo validation
    if (!formData.photo) {
      newErrors.photo = 'Profile photo is required';
      isValid = false;
    } else {
      newErrors.photo = '';
    }


    // Availability validation
    if (!formData.availability) {
      newErrors.availability = 'Availability is required';
      isValid = false;
    } else {
      newErrors.availability = '';
    }


    // Terms agreement validation
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
      isValid = false;
    } else {
      newErrors.agreedToTerms = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePoliceClearanceChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, policeClearance: file });
      setPoliceClearanceFileName(file.name);
    }
  };

  const handleBirthCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, birthCertificate: file });
      setBirthCertificateFileName(file.name);
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
        serviceType: serviceData.serviceType || 'General',
        location: serviceData.location || 'Default Location',
        payRate: serviceData.payRate || [500, 2000],
        selectedLanguages: serviceData.selectedLanguages || ['English'],
        // about: 'Sample about text',
        selectedServices: serviceData.selectedServices || ['Default Service'],
        policeClearance: URL.createObjectURL(formData.policeClearance),
        photo: formData.photo || 'https://via.placeholder.com/200',
        selectedPetTypes: serviceData.selectedPetTypes || [],
        selectedSyllabi: serviceData.selectedSyllabi || [],
        selectedSubjects: serviceData.selectedSubjects || [],
        selectedGrades: serviceData.selectedGrades || [],
        selectedAgeGroups: serviceData.selectedAgeGroups || [],
        birthCertificate: URL.createObjectURL(formData.birthCertificate),
        availability: formData.availability,
      };

       const token = localStorage.getItem("authToken");
      if (!token) {
        Swal.fire("Not logged in", "Please sign in first.", "warning");
        navigate("/signin");
        return;
      }

      const response = await api.post('/service/add-new-service',profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response);
      

      if(response.status == 201){
        Swal.fire("Success", response.data.message, "success").then(() => {
          navigate("/services");
        });
      }else{
        Swal.fire("error", response.data.message , "error");
      }

    
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar handleLogout={handleLogout}  user={userData}/>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#003366]">Add Service</h2>
        
        <StyledContainer maxWidth="sm">

      <StyledForm onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: '#FFF5F2', color: '#FF7F50' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>


          {/* Police Clearance Report Input Field */}
          <Grid item xs={12}>
            {policeClearanceFileName && (
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

          {/* Birth Certificate Input Field */}
          <Grid item xs={12}>
            {birthCertificateFileName && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={`Uploaded: ${birthCertificateFileName}`}
                  onDelete={() => {
                    setFormData({ ...formData, birthCertificate: null });
                    setBirthCertificateFileName('');
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
              Upload Birth Certificate *
              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.png"
                onChange={handleBirthCertificateChange}
              />
            </Button>
            {errors.birthCertificate && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.birthCertificate}
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

          {/* Availability */}
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.availability}>
              <FormLabel component="legend">Availability *</FormLabel>
              <RadioGroup
                row
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <FormControlLabel value="yes" control={<Radio sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }} />} label="No" />
              </RadioGroup>
              {errors.availability && (
                <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                  {errors.availability}
                </Typography>
              )}
            </FormControl>
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
              {loading ? 'Add Service...' : 'Add Service'}
            </StyledButton>
          </Grid>
        </Grid>
      </StyledForm>
    </StyledContainer>

      </div>
    </div>
   
  );
};

export default CreateAccount;