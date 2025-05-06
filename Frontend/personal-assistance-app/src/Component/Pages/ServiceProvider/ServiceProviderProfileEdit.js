import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Radio,
  RadioGroup,
  FormLabel,
  Chip,
  Avatar,
  Paper,
  Tab,
  Tabs,
  Divider,
  Card,
  CardContent,
  Stack,
  IconButton,
  Rating,
  useMediaQuery,
  useTheme,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CloudUpload,
  Edit,
  Save,
  Preview,
  LocationOn,
  Language,
  Money,
  AccessTime,
  Person,
  Description,
  Security,
  School,
  Badge,
  VerifiedUser,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { initialProfileData, validateProfile } from './ServiceProviderData';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider'; // Backend base URL

// Styled components for better aesthetics
const ProfileSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: '#001F3F',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    color: '#40E0D0',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #40E0D0 30%, #4AEDC4 90%)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '30px',
  boxShadow: '0 3px 15px rgba(64, 224, 208, 0.3)',
  transition: 'all 0.3s ease',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(45deg, #3BC6B8 30%, #3CD6AF 90%)',
    boxShadow: '0 6px 20px rgba(64, 224, 208, 0.5)',
    transform: 'translateY(-2px)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'linear-gradient(45deg, #40E0D0 30%, #4AEDC4 90%)',
  color: 'white',
  fontWeight: 500,
  boxShadow: '0 2px 8px rgba(64, 224, 208, 0.3)',
}));

const UploadButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #40E0D0 30%, #4AEDC4 90%)',
  color: 'white',
  borderRadius: '12px',
  padding: '10px 15px',
  boxShadow: '0 3px 12px rgba(64, 224, 208, 0.25)',
  transition: 'all 0.3s',
  '&:hover': {
    background: 'linear-gradient(45deg, #3BC6B8 30%, #3CD6AF 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(64, 224, 208, 0.4)',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  marginRight: theme.spacing(2),
}));

const FormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  height: '100%',
}));

// Custom tabs styling
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#40E0D0',
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  '&.Mui-selected': {
    color: '#40E0D0',
  },
}));

// Profile Preview Card Component
const ProfilePreviewCard = ({ data, serviceType }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to render service-specific chips
  const renderSpecificChips = () => {
    switch (serviceType) {
      case 'PetCare':
        return (
          <>
            <Typography variant="subtitle2" gutterBottom>Pet Types</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {data.selectedPetTypes?.map((pet) => (
                <StyledChip key={pet} label={pet} size="small" />
              ))}
            </Box>
          </>
        );
      case 'ChildCare':
        return (
          <>
            <Typography variant="subtitle2" gutterBottom>Age Groups</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {data.selectedAgeGroups?.map((age) => (
                <StyledChip key={age} label={age} size="small" />
              ))}
            </Box>
          </>
        );
      case 'Education':
        return (
          <>
            <Typography variant="subtitle2" gutterBottom>Subjects</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {data.selectedSubjects?.map((subject) => (
                <StyledChip key={subject} label={subject} size="small" />
              ))}
            </Box>
            <Typography variant="subtitle2" gutterBottom>Grades</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {data.selectedGrades?.map((grade) => (
                <StyledChip key={grade} label={grade} size="small" />
              ))}
            </Box>
            <Typography variant="subtitle2" gutterBottom>Syllabi</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {data.selectedSyllabi?.map((syllabus) => (
                <StyledChip key={syllabus} label={syllabus} size="small" />
              ))}
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ProfileSection elevation={3}>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start' }}>
        <ProfileAvatar src={data.photo || 'https://via.placeholder.com/200'} alt={data.name} />
        <Box sx={{ flex: 1, ml: isMobile ? 0 : 2, textAlign: isMobile ? 'center' : 'left', mt: isMobile ? 2 : 0 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>{data.name || 'Your Name'}</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>{serviceType} Professional</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <Rating value={5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>New Provider</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <LocationOn fontSize="small" sx={{ color: '#40E0D0', mr: 0.5 }} />
            <Typography variant="body2">{data.location || 'Location'}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {data.selectedLanguages?.map((language) => (
              <StyledChip key={language} label={language} size="small" />
            ))}
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <SectionTitle><Description fontSize="small" /> About Me</SectionTitle>
        <Typography variant="body1" paragraph>
          {data.about || 'Tell customers about yourself, your experience, and why they should choose you.'}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <SectionTitle><Money fontSize="small" /> Rate</SectionTitle>
        <Typography variant="h6" color="primary" fontWeight="bold">
          RS {data.payRate?.[0] || 500} - {data.payRate?.[1] || 2000} / hour
        </Typography>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <SectionTitle><AccessTime fontSize="small" /> Availability</SectionTitle>
        <Typography>
          {data.availability === 'yes' ? 'Available for new clients' : 'Currently unavailable'}
        </Typography>
      </Box>
      
      {serviceType !== 'Education' && (
        <Box sx={{ mt: 3 }}>
          <SectionTitle>Services Offered</SectionTitle>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {data.selectedServices?.map((service) => (
              <StyledChip key={service} label={service} size="small" />
            ))}
          </Box>
        </Box>
      )}
      
      <Box sx={{ mt: 3 }}>
        {renderSpecificChips()}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <VerifiedUser sx={{ color: '#40E0D0', mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Verified profile with ID and documents
        </Typography>
      </Box>
    </ProfileSection>
  );
};

const EditServiceProviderProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceType, id } = location.state || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  console.log('ID from location.state:', id);

  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState(initialProfileData(serviceType));
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [policeClearanceFileName, setPoliceClearanceFileName] = useState('');
  const [birthCertificateFileName, setBirthCertificateFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Steps for stepper in edit mode
  const steps = [
    'Basic Information',
    'Professional Details',
    'Verification Documents',
    'Review Profile'
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('serviceProviderProfile');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Retrieved Profile Data:', parsedData);
        setProfileData({
          ...initialProfileData(serviceType),
          ...parsedData,
          payRate: parsedData.payRate || [500, 2000],
          selectedPetTypes: parsedData.selectedPetTypes || [],
          selectedSyllabi: parsedData.selectedSyllabi || [],
          selectedSubjects: parsedData.selectedSubjects || [],
          selectedGrades: parsedData.selectedGrades || [],
          selectedAgeGroups: parsedData.selectedAgeGroups || [],
        });
        if (parsedData.policeClearance) {
          setPoliceClearanceFileName('Police Clearance Uploaded');
        }
        if (parsedData.birthCertificate) {
          setBirthCertificateFileName('Birth Certificate Uploaded');
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }
  }, [serviceType]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
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

  const handlePoliceClearanceChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, policeClearance: URL.createObjectURL(file) });
      setPoliceClearanceFileName(file.name);
    }
  };

  const handleBirthCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, birthCertificate: URL.createObjectURL(file) });
      setBirthCertificateFileName(file.name);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      selectedServices: checked
        ? [...(prevState.selectedServices || []), name]
        : (prevState.selectedServices || []).filter((service) => service !== name),
    }));
  };

  const validateForm = () => {
    const validationErrors = validateProfile(profileData);
    const additionalErrors = {};

    if (!profileData.nic?.trim()) {
      additionalErrors.nic = 'NIC is required';
    }
    if (!profileData.birthCertificate) {
      additionalErrors.birthCertificate = 'Birth Certificate is required';
    }
    if (!profileData.availability) {
      additionalErrors.availability = 'Availability is required';
    }
    if (!profileData.gender) {
      additionalErrors.gender = 'Gender is required';
    }

    const allErrors = { ...validationErrors, ...additionalErrors };
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (loading) return;
    setLoading(true);

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
        userType: 'sp', // Default value as per schema
        nic: profileData.nic,
        birthCertificate: profileData.birthCertificate,
        availability: profileData.availability,
        gender: profileData.gender,
      };

      console.log('Updating profile with ID:', id);
      console.log('Updated data:', updatedData);

      const response = await axios.put(`${API_BASE_URL}/update-service-provider/${id}`, updatedData);
      console.log('Update response:', response);

      if (response && response.data) {
        // Store the actual service provider data, not the wrapped response
        localStorage.setItem('serviceProviderProfile', JSON.stringify(response.data.data));
        navigate('/viewspprofile');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
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
          <FormCard>
            <CardContent>
              <SectionTitle>
                <Badge /> Pet Types
              </SectionTitle>
              <Grid container spacing={1}>
                {['Dogs', 'Cats', 'Birds', 'Fish'].map((pet) => (
                  <Grid item xs={6} sm={3} key={pet}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={pet}
                          checked={profileData.selectedPetTypes?.includes(pet) || false}
                          onChange={(e) => {
                            const { name, checked } = e.target;
                            setProfileData((prevState) => ({
                              ...prevState,
                              selectedPetTypes: checked
                                ? [...(prevState.selectedPetTypes || []), name]
                                : (prevState.selectedPetTypes || []).filter((type) => type !== name),
                            }));
                          }}
                          sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }}
                        />
                      }
                      label={pet}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </FormCard>
        );
      case 'ChildCare':
        return (
          <FormCard>
            <CardContent>
              <SectionTitle>
                <Person /> Age Groups
              </SectionTitle>
              <Grid container spacing={1}>
                {['Newborn', 'Toddler', 'Pre-school', 'Primary School', 'Teenager (12+ years)'].map((age) => (
                  <Grid item xs={12} sm={6} key={age}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={age}
                          checked={profileData.selectedAgeGroups?.includes(age) || false}
                          onChange={(e) => {
                            const { name, checked } = e.target;
                            setProfileData((prevState) => ({
                              ...prevState,
                              selectedAgeGroups: checked
                                ? [...(prevState.selectedAgeGroups || []), name]
                                : (prevState.selectedAgeGroups || []).filter((group) => group !== name),
                            }));
                          }}
                          sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }}
                        />
                      }
                      label={age}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </FormCard>
        );
      case 'Education':
        return (
          <>
            <FormCard sx={{ mb: 3 }}>
              <CardContent>
                <SectionTitle>
                  <School /> Syllabus
                </SectionTitle>
                <Grid container spacing={1}>
                  {['Local Syllabus', 'Cambridge Syllabus', 'Edxcel Syllabus'].map((syllabus) => (
                    <Grid item xs={12} sm={4} key={syllabus}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={syllabus}
                            checked={profileData.selectedSyllabi?.includes(syllabus) || false}
                            onChange={(e) => {
                              const { name, checked } = e.target;
                              setProfileData((prevState) => ({
                                ...prevState,
                                selectedSyllabi: checked
                                  ? [...(prevState.selectedSyllabi || []), name]
                                  : (prevState.selectedSyllabi || []).filter((syl) => syl !== name),
                              }));
                            }}
                            sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }}
                          />
                        }
                        label={syllabus}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </FormCard>
            <FormCard sx={{ mb: 3 }}>
              <CardContent>
                <SectionTitle>
                  <School /> Subjects
                </SectionTitle>
                <Grid container spacing={1}>
                  {['Art', 'Business', 'ICT', 'Mathematics', 'Physics', 'Science', 'Music', 'English', 'Chemistry', 'History', 'Other Languages'].map((subject) => (
                    <Grid item xs={12} sm={4} key={subject}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={subject}
                            checked={profileData.selectedSubjects?.includes(subject) || false}
                            onChange={(e) => {
                              const { name, checked } = e.target;
                              setProfileData((prevState) => ({
                                ...prevState,
                                selectedSubjects: checked
                                  ? [...(prevState.selectedSubjects || []), name]
                                  : (prevState.selectedSubjects || []).filter((sub) => sub !== name),
                              }));
                            }}
                            sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }}
                          />
                        }
                        label={subject}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </FormCard>
            <FormCard>
              <CardContent>
                <SectionTitle>
                  <School /> Grades
                </SectionTitle>
                <Grid container spacing={1}>
                  {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'O/L', 'A/L'].map((grade) => (
                    <Grid item xs={6} sm={3} key={grade}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name={grade}
                            checked={profileData.selectedGrades?.includes(grade) || false}
                            onChange={(e) => {
                              const { name, checked } = e.target;
                              setProfileData((prevState) => ({
                                ...prevState,
                                selectedGrades: checked
                                  ? [...(prevState.selectedGrades || []), name]
                                  : (prevState.selectedGrades || []).filter((grd) => grd !== name),
                              }));
                            }}
                            sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }}
                          />
                        }
                        label={grade}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </FormCard>
          </>
        );
      default:
        return null;
    }
  };

  // Render form based on active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <>
            <ProfileSection>
              <SectionTitle>
                <Person /> Basic Information
              </SectionTitle>
              <Grid container spacing={3}>
                {/* Profile Photo */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 2 }}>
                    <ProfileAvatar
                      src={profileData.photo || 'https://via.placeholder.com/200'}
                      alt="Profile Photo"
                    />
                    <Box>
                      <UploadButton
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                      >
                        Upload Photo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </UploadButton>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Professional photo helps build trust with clients
                      </Typography>
                    </Box>
                  </Box>
                  {errors.photo && (
                    <Typography color="error" variant="caption">
                      {errors.photo}
                    </Typography>
                  )}
                </Grid>

                {/* Name, Email, NIC */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileData.name || ''}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Person sx={{ color: '#40E0D0', mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email || ''}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="NIC"
                    name="nic"
                    value={profileData.nic || ''}
                    onChange={handleChange}
                    error={!!errors.nic}
                    helperText={errors.nic}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Badge sx={{ color: '#40E0D0', mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Location</InputLabel>
                    <Select
                      name="location"
                      value={profileData.location || ''}
                      onChange={handleChange}
                      error={!!errors.location}
                      startAdornment={<LocationOn sx={{ color: '#40E0D0', mr: 1 }} />}
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

                {/* Gender & Availability */}
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" error={!!errors.gender} fullWidth>
                    <FormLabel component="legend">Gender *</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={profileData.gender || ''}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="male" control={<Radio sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }} />} label="Male" />
                      <FormControlLabel value="female" control={<Radio sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }} />} label="Female" />
                      <FormControlLabel value="other" control={<Radio sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }} />} label="Other" />
                    </RadioGroup>
                    {errors.gender && (
                      <Typography color="error" variant="caption">
                        {errors.gender}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" error={!!errors.availability} fullWidth>
                    <FormLabel component="legend">Availability *</FormLabel>
                    <RadioGroup
                      row
                      name="availability"
                      value={profileData.availability || ''}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="yes" control={<Radio sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }} />} label="Available for new clients" />
                      <FormControlLabel value="no" control={<Radio sx={{ color: '#40E0D0', '&.Mui-checked': { color: '#40E0D0' } }} />} label="Currently unavailable" />
                    </RadioGroup>
                    {errors.availability && (
                      <Typography color="error" variant="caption">
                        {errors.availability}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </ProfileSection>
          </>
        );
      case 1: // Professional Details
        return (
          <>
            <ProfileSection>
              <SectionTitle>
                <Description /> Professional Details
              </SectionTitle>
              <Grid container spacing={3}>
                {/* About Me */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About Me"
                    name="about"
                    value={profileData.about || ''}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    placeholder="Tell clients about your experience, qualifications, and why they should choose you..."
                    error={!!errors.about}
                    helperText={errors.about}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* Pay Rate */}
                <Grid item xs={12}>
                  <SectionTitle>
                    <Money /> Pay Rate (RS)
                  </SectionTitle>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Min Hourly Rate (RS)"
                    name="payRate[0]"
                    type="number"
                    value={profileData.payRate?.[0] || 500}
                    onChange={(e) => {
                      const newPayRate = [...(profileData.payRate || [500, 2000])];
                      newPayRate[0] = e.target.value;
                      setProfileData({ ...profileData, payRate: newPayRate });
                    }}
                    error={!!errors.payRate}
                    helperText={errors.payRate}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Money sx={{ color: '#40E0D0', mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Hourly Rate (RS)"
                    name="payRate[1]"
                    type="number"
                    value={profileData.payRate?.[1] || 2000}
                    onChange={(e) => {
                      const newPayRate = [...(profileData.payRate || [500, 2000])];
                      newPayRate[1] = e.target.value;
                      setProfileData({ ...profileData, payRate: newPayRate });
                    }}
                    error={!!errors.payRate}
                    helperText={errors.payRate}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <Money sx={{ color: '#40E0D0', mr: 1 }} />,
                    }}
                  />
                </Grid>

                {/* Languages */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Languages Spoken</InputLabel>
                    <Select
                      multiple
                      value={profileData.selectedLanguages || []}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          selectedLanguages: e.target.value,
                        })
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <StyledChip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                      error={!!errors.selectedLanguages}
                      startAdornment={<Language sx={{ color: '#40E0D0', mr: 1 }} />}
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

                {/* Services Offered */}
                {serviceType !== 'Education' && (
                  <Grid item xs={12}>
                    <SectionTitle>
                      <CheckCircle /> Services Offered
                    </SectionTitle>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1,
                      mt: 1
                    }}>
                      {getServicesOffered().map((service) => (
                        <StyledChip
                          key={service}
                          label={service}
                          clickable
                          onClick={() => {
                            const isSelected = profileData.selectedServices?.includes(service) || false;
                            setProfileData((prevState) => ({
                              ...prevState,
                              selectedServices: isSelected
                                ? (prevState.selectedServices || []).filter((s) => s !== service)
                                : [...(prevState.selectedServices || []), service],
                            }));
                          }}
                          color={profileData.selectedServices?.includes(service) ? "primary" : "default"}
                          variant={profileData.selectedServices?.includes(service) ? "filled" : "outlined"}
                        />
                      ))}
                    </Box>
                    {errors.selectedServices && (
                      <Typography color="error" variant="caption">
                        {errors.selectedServices}
                      </Typography>
                    )}
                  </Grid>
                )}

                {/* Service-Specific Fields */}
                <Grid item xs={12}>
                  {renderServiceSpecificFields()}
                </Grid>
              </Grid>
            </ProfileSection>
          </>
        );
      case 2: // Verification Documents
        return (
          <>
            <ProfileSection>
              <SectionTitle>
                <Security /> Verification Documents
              </SectionTitle>
              <Typography variant="body2" color="text.secondary" paragraph>
                Document verification helps build trust with clients and ensures the safety of our platform.
              </Typography>

              <Grid container spacing={3}>
                {/* Police Clearance */}
                <Grid item xs={12} md={6}>
                  <FormCard>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Police Clearance Certificate
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Required for all service providers to ensure client safety
                      </Typography>
                      {policeClearanceFileName && (
                        <Box sx={{ mb: 2 }}>
                          <StyledChip
                            label={`Uploaded: ${policeClearanceFileName}`}
                            onDelete={() => {
                              setProfileData({ ...profileData, policeClearance: null });
                              setPoliceClearanceFileName('');
                            }}
                            sx={{ backgroundColor: '#40E0D0', color: 'white' }}
                          />
                        </Box>
                      )}
                      <UploadButton
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                        fullWidth
                      >
                        {policeClearanceFileName ? 'Change Document' : 'Upload Document'}
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.png"
                          onChange={handlePoliceClearanceChange}
                        />
                      </UploadButton>
                      {errors.policeClearance && (
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                          {errors.policeClearance}
                        </Typography>
                      )}
                    </CardContent>
                  </FormCard>
                </Grid>

                {/* Birth Certificate */}
                <Grid item xs={12} md={6}>
                  <FormCard>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Birth Certificate
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Used to verify your identity and age
                      </Typography>
                      {birthCertificateFileName && (
                        <Box sx={{ mb: 2 }}>
                          <StyledChip
                            label={`Uploaded: ${birthCertificateFileName}`}
                            onDelete={() => {
                              setProfileData({ ...profileData, birthCertificate: null });
                              setBirthCertificateFileName('');
                            }}
                            sx={{ backgroundColor: '#40E0D0', color: 'white' }}
                          />
                        </Box>
                      )}
                      <UploadButton
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                        fullWidth
                      >
                        {birthCertificateFileName ? 'Change Document' : 'Upload Document'}
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.png"
                          onChange={handleBirthCertificateChange}
                        />
                      </UploadButton>
                      {errors.birthCertificate && (
                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                          {errors.birthCertificate}
                        </Typography>
                      )}
                    </CardContent>
                  </FormCard>
                </Grid>
              </Grid>
            </ProfileSection>
          </>
        );
      case 3: // Review Profile
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold' }}>
                Preview Your Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is how your profile will appear to potential clients.
              </Typography>
            </Box>
            <ProfilePreviewCard data={profileData} serviceType={serviceType} />
          </>
        );
      default:
        return null;
    }
  };

  if (!profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Tab view layout
  const renderTabView = () => (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        backgroundColor: '#fafafa',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2, color: '#40E0D0' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#001F3F', fontWeight: 'bold' }}>
          Manage Your {serviceType} Profile
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <StyledTabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <StyledTab label="Edit Profile" />
          <StyledTab label="Preview Profile" />
        </StyledTabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 ? (
          <>
            <Box sx={{ width: '100%', mb: 4 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          color: '#40E0D0',
                          '&.Mui-completed': {
                            color: '#40E0D0',
                          },
                          '&.Mui-active': {
                            color: '#40E0D0',
                          },
                        }
                      }}
                      onClick={() => handleStepChange(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={() => handleStepChange(activeStep - 1)}
                sx={{
                  borderColor: '#40E0D0',
                  color: '#40E0D0',
                  '&:hover': {
                    borderColor: '#38CAB8',
                  },
                }}
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <GradientButton
                    variant="contained"
                    onClick={handleSaveProfile}
                    disabled={loading}
                    startIcon={<Save />}
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </GradientButton>
                ) : (
                  <GradientButton
                    variant="contained"
                    onClick={() => handleStepChange(activeStep + 1)}
                  >
                    Next
                  </GradientButton>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold' }}>
                Profile Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is how your profile will appear to potential clients.
              </Typography>
            </Box>
            <ProfilePreviewCard data={profileData} serviceType={serviceType} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <GradientButton
                variant="contained"
                onClick={() => setActiveTab(0)}
                startIcon={<Edit />}
                sx={{ mr: 2 }}
              >
                Edit Profile
              </GradientButton>
              <GradientButton
                variant="contained"
                onClick={handleSaveProfile}
                disabled={loading}
                startIcon={<Save />}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </GradientButton>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );

  return renderTabView();
};

// Profile View Component (to be used in /viewspprofile)
export const ServiceProviderProfileView = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Fetch profile data from localStorage or directly from backend
    const fetchProfileData = async () => {
      try {
        const savedData = localStorage.getItem('serviceProviderProfile');
        if (savedData) {
          setProfileData(JSON.parse(savedData));
        } else {
          // If no data in localStorage, you could fetch from API
          // const response = await axios.get(`${API_BASE_URL}/get-profile/${id}`);
          // setProfileData(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditProfile = () => {
    navigate('/editspprofile', { 
      state: { 
        serviceType: profileData?.serviceType,
        id: profileData?._id 
      } 
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>No profile data found</Typography>
        <Button 
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{
            backgroundColor: '#40E0D0',
            color: 'white',
            '&:hover': {
              backgroundColor: '#38CAB8',
            },
          }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2, color: '#40E0D0' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#001F3F', fontWeight: 'bold' }}>
          Your {profileData.serviceType} Profile
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <StyledTabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth">
          <StyledTab label="Profile View" />
          <StyledTab label="Statistics" />
          <StyledTab label="Reviews" />
        </StyledTabs>
      </Box>

      {activeTab === 0 && (
        <>
          <ProfilePreviewCard data={profileData} serviceType={profileData.serviceType} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <GradientButton
              variant="contained"
              onClick={handleEditProfile}
              startIcon={<Edit />}
            >
              Edit Profile
            </GradientButton>
          </Box>
        </>
      )}

      {activeTab === 1 && (
        <ProfileSection>
          <SectionTitle>Your Performance Statistics</SectionTitle>
          <Typography variant="body1" paragraph>
            You don't have any statistics yet. Complete jobs to see your performance metrics here.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" gutterBottom>Jobs Completed</Typography>
                <Typography variant="h3" sx={{ color: '#40E0D0', fontWeight: 'bold' }}>0</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" gutterBottom>Average Rating</Typography>
                <Typography variant="h3" sx={{ color: '#40E0D0', fontWeight: 'bold' }}>--</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" gutterBottom>Response Rate</Typography>
                <Typography variant="h3" sx={{ color: '#40E0D0', fontWeight: 'bold' }}>--</Typography>
              </Paper>
            </Grid>
          </Grid>
        </ProfileSection>
      )}

      {activeTab === 2 && (
        <ProfileSection>
          <SectionTitle>Client Reviews</SectionTitle>
          <Typography variant="body1" paragraph>
            You don't have any reviews yet. Complete jobs to collect reviews from clients.
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">No reviews yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Your reviews will appear here once clients rate your services
            </Typography>
          </Box>
        </ProfileSection>
      )}
    </Container>
  );
};

export default EditServiceProviderProfile;
