import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  Avatar,
  Link,
  Divider,
  Card,
  CardContent,
  Rating,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Description,
  PictureAsPdf,
  Language,
  Bookmark,
  Share,
  Verified,
  AccessTime,
  LocationOn,
  School,
  Pets,
  ChildCare,
  Assignment
} from '@mui/icons-material';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider';

// Custom theme colors
const theme = {
  primary: '#4F46E5', // Indigo
  secondary: '#10B981', // Emerald
  accent: '#F59E0B', // Amber
  error: '#EF4444', // Red
  background: '#F9FAFB', // Light gray background
  paper: '#FFFFFF', // White
  text: {
    primary: '#111827', // Very dark gray
    secondary: '#4B5563', // Medium gray
    light: '#9CA3AF', // Light gray
  }
};

const ServiceProviderProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('provider'); // 'provider' or 'client'

  useEffect(() => {
    const savedData = localStorage.getItem('serviceProviderProfile');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && typeof parsedData === 'object') {
          const data = parsedData.data || parsedData;
          // Normalize the data to ensure all fields are present
          const normalizedData = {
            _id: data._id || '',
            serviceType: data.serviceType || 'Service Provider Profile',
            name: data.name || data.fullName || 'No Name Provided',
            location: data.location || data.city || 'No Location Provided',
            photo: data.photo || '',
            nic: data.nic || 'Not Provided',
            availability: data.availability || 'Not Provided',
            gender: data.gender || 'Not Provided',
            birthCertificate: data.birthCertificate || '',
            about: data.about || 'No information provided.',
            payRate: data.payRate || [0, 0],
            selectedLanguages: data.selectedLanguages || [],
            selectedServices: data.selectedServices || [],
            selectedPetTypes: data.selectedPetTypes || [],
            selectedSyllabi: data.selectedSyllabi || [],
            selectedSubjects: data.selectedSubjects || [],
            selectedGrades: data.selectedGrades || [],
            selectedAgeGroups: data.selectedAgeGroups || [],
            // Simulated data for the improved UI
            rating: 4.8,
            reviewCount: 24,
            completedJobs: 47,
            yearsExperience: 3,
            joinDate: 'Jan 2022',
            verificationStatus: 'Verified',
            responseRate: '98%',
            responseTime: 'Within 1 hour',
          };
          setProfileData(normalizedData);
        } else {
          console.error('Invalid profile data in localStorage');
          localStorage.removeItem('serviceProviderProfile');
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
        localStorage.removeItem('serviceProviderProfile');
      }
    } else {
      console.log('No serviceProviderProfile data found in localStorage');
    }
    setLoading(false);
  }, []);

  const handleEdit = () => {
    if (!profileData) return;
    navigate('/editspprofile', {
      state: {
        serviceType: profileData.serviceType,
        id: profileData._id,
      },
    });
  };

  const handleDelete = () => {
    if (!profileData) return;
    navigate('/deleteaccount', { state: { profileData } });
  };

  const handleGeneratePDF = () => {
    if (!profileData) {
      alert('Profile data is not available. Please try again later.');
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text(profileData.serviceType || 'Service Provider Profile', 20, 20);

    // Profile Details
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39); // Text primary
    let yPosition = 40;

    // Basic Info
    doc.text(`Name: ${profileData.name || 'No Name Provided'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Location: ${profileData.location || 'No Location Provided'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Service Type: ${profileData.serviceType || 'No Service Type Provided'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`NIC: ${profileData.nic || 'Not Provided'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Availability: ${profileData.availability || 'Not Provided'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Gender: ${profileData.gender || 'Not Provided'}`, 20, yPosition);
    yPosition += 15;

    // About Me
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('About Me', 20, yPosition);
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    yPosition += 10;
    const aboutText = doc.splitTextToSize(profileData.about || 'No information provided.', 170);
    doc.text(aboutText, 20, yPosition);
    yPosition += aboutText.length * 7 + 10;

    // Hourly Rate Range
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Hourly Rate Range', 20, yPosition);
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    yPosition += 10;
    doc.text(
      profileData.payRate && profileData.payRate.length === 2
        ? `Rs. ${profileData.payRate[0]} - Rs. ${profileData.payRate[1]}`
        : 'Pay Rate Not Specified',
      20,
      yPosition
    );
    yPosition += 15;

    // Languages Spoken
    if (profileData.selectedLanguages?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Languages Spoken', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      yPosition += 10;
      doc.text(profileData.selectedLanguages.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Services Offered
    if (profileData.serviceType !== 'Education' && profileData.selectedServices?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Services Offered', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      yPosition += 10;
      doc.text(profileData.selectedServices.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Pet Types
    if (profileData.selectedPetTypes?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Pet Types', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      yPosition += 10;
      doc.text(profileData.selectedPetTypes.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Syllabus (Education Category)
    if (profileData.serviceType === 'Education' && profileData.selectedSyllabi?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Syllabus', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      yPosition += 10;
      doc.text(profileData.selectedSyllabi.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Subjects
    if (profileData.selectedSubjects?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Subjects', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      yPosition += 10;
      doc.text(profileData.selectedSubjects.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Grades
    if (profileData.selectedGrades?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Grades', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      yPosition += 10;
      doc.text(profileData.selectedGrades.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Age Groups
    if (profileData.selectedAgeGroups?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text('Age Groups', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      yPosition += 10;
      doc.text(profileData.selectedAgeGroups.join(', '), 20, yPosition);
    }

    // Save the PDF
    doc.save(`${profileData.name || 'service-provider'}_profile.pdf`);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'provider' ? 'client' : 'provider');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.background
      }}>
        <Typography variant="h6" sx={{ color: theme.primary }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.background
      }}>
        <Typography variant="h6" sx={{ color: theme.text.primary }}>
          No profile data available.
        </Typography>
      </Container>
    );
  }

  // Client view of the profile
  if (viewMode === 'client') {
    return (
      <Container maxWidth="lg" sx={{ py: 4, backgroundColor: theme.background, minHeight: '100vh' }}>
        {/* View mode toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={toggleViewMode}
            sx={{ 
              borderColor: theme.primary, 
              color: theme.primary,
              '&:hover': { borderColor: theme.primary, backgroundColor: `${theme.primary}10` }
            }}
          >
            Switch to Provider View
          </Button>
        </Box>
        
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
          {/* Cover image */}
          <Box sx={{ 
            height: '200px', 
            backgroundColor: theme.primary, 
            position: 'relative',
            backgroundImage: 'linear-gradient(to right, #4F46E5, #6366F1)'
          }} />
          
          <Box sx={{ px: 4, py: 4, position: 'relative' }}>
            {/* Profile image */}
            <Avatar
              src={profileData.photo}
              alt={profileData.name}
              sx={{
                width: 150,
                height: 150,
                border: `4px solid ${theme.paper}`,
                position: 'absolute',
                top: -75,
                left: 40,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
            
            {/* Profile header with actions */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={7} sx={{ mt: { xs: 10, md: 0 }, ml: { md: 20 } }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 1 }}>
                  {profileData.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ color: theme.text.light, fontSize: 20, mr: 0.5 }} />
                  <Typography variant="body1" sx={{ color: theme.text.secondary, mr: 2 }}>
                    {profileData.location}
                  </Typography>
                  {profileData.verificationStatus === 'Verified' && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Verified sx={{ color: theme.secondary, fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: theme.secondary }}>
                        Verified
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={profileData.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, color: theme.text.secondary }}>
                    {profileData.rating} ({profileData.reviewCount} reviews)
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: theme.text.primary, mb: 2 }}>
                  {profileData.serviceType}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Save profile">
                    <IconButton sx={{ color: theme.text.light }}>
                      <Bookmark />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share profile">
                    <IconButton sx={{ color: theme.text.light }}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: theme.primary,
                      '&:hover': { backgroundColor: '#4338CA' }, // Darker shade
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    Contact
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {/* Stats cards */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={6} md={3}>
                <Card elevation={0} sx={{ backgroundColor: `${theme.primary}10`, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.primary }}>
                      {profileData.completedJobs}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      Jobs Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card elevation={0} sx={{ backgroundColor: `${theme.secondary}10`, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.secondary }}>
                      {profileData.yearsExperience}+ yrs
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      Experience
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card elevation={0} sx={{ backgroundColor: `${theme.accent}10`, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.accent }}>
                      {profileData.responseRate}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      Response Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card elevation={0} sx={{ backgroundColor: `${theme.text.primary}10`, borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.text.primary }}>
                      Since {profileData.joinDate}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                      Member
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          {/* Tabs for different sections */}
          <Box sx={{ borderTop: `1px solid ${theme.text.light}20` }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ 
                '& .MuiTab-root': { 
                  fontWeight: 'medium',
                  color: theme.text.secondary,
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 2
                },
                '& .Mui-selected': { 
                  color: theme.primary, 
                  fontWeight: 'bold' 
                },
                '& .MuiTabs-indicator': { 
                  backgroundColor: theme.primary,
                  height: 3
                }
              }}
            >
              <Tab label="About" />
              <Tab label="Services" />
              <Tab label="Reviews" />
              <Tab label="Availability" />
            </Tabs>
          </Box>
          
          {/* Tab content */}
          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                  About Me
                </Typography>
                <Typography variant="body1" sx={{ color: theme.text.primary, mb: 4, lineHeight: 1.7 }}>
                  {profileData.about}
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                      Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', color: theme.text.secondary, width: '40%' }}>
                        Gender
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.text.primary }}>
                        {profileData.gender}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', color: theme.text.secondary, width: '40%' }}>
                        Availability
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.text.primary }}>
                        {profileData.availability}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', color: theme.text.secondary, width: '40%' }}>
                        Hourly Rate
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 'bold' }}>
                        {profileData.payRate && profileData.payRate.length === 2
                          ? `Rs. ${profileData.payRate[0]} - Rs. ${profileData.payRate[1]}`
                          : 'Not Specified'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', color: theme.text.secondary, width: '40%' }}>
                        Response Time
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.text.primary }}>
                        {profileData.responseTime}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    {profileData.selectedLanguages?.length > 0 && (
                      <>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                          Languages
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                          {profileData.selectedLanguages.map(lang => (
                            <Chip 
                              key={lang}
                              icon={<Language />}
                              label={lang} 
                              sx={{ 
                                backgroundColor: `${theme.primary}10`,
                                color: theme.primary,
                                borderRadius: 2,
                                py: 0.5
                              }} 
                            />
                          ))}
                        </Box>
                      </>
                    )}
                    
                    {profileData.birthCertificate && (
                      <>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                          Documents
                        </Typography>
                        <Link 
                          href={profileData.birthCertificate} 
                          target="_blank" 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            color: theme.primary,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          <Description sx={{ mr: 1 }} />
                          Birth Certificate
                        </Link>
                      </>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
            
            {activeTab === 1 && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 3 }}>
                  Services Offered
                </Typography>
                
                {/* Service Type specific content */}
                {profileData.serviceType === 'Education' ? (
                  <Grid container spacing={3}>
                    {/* Education specific details */}
                    {profileData.selectedSyllabi?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20`, height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <School sx={{ color: theme.primary, mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.text.primary }}>
                                Syllabus
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {profileData.selectedSyllabi.map(syllabus => (
                                <Chip 
                                  key={syllabus}
                                  label={syllabus} 
                                  sx={{ 
                                    backgroundColor: `${theme.primary}10`,
                                    color: theme.primary,
                                    borderRadius: 2
                                  }} 
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    
                    {profileData.selectedSubjects?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20`, height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Assignment sx={{ color: theme.accent, mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.text.primary }}>
                                Subjects
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {profileData.selectedSubjects.map(subject => (
                                <Chip 
                                  key={subject}
                                  label={subject} 
                                  sx={{ 
                                    backgroundColor: `${theme.accent}10`,
                                    color: theme.accent,
                                    borderRadius: 2
                                  }} 
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    
                    {profileData.selectedGrades?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20`, height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <School sx={{ color: theme.secondary, mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.text.primary }}>
                                Grades
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {profileData.selectedGrades.map(grade => (
                                <Chip 
                                  key={grade}
                                  label={grade} 
                                  sx={{ 
                                    backgroundColor: `${theme.secondary}10`,
                                    color: theme.secondary,
                                    borderRadius: 2
                                  }} 
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    
                    {profileData.selectedAgeGroups?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20`, height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <ChildCare sx={{ color: theme.primary, mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.text.primary }}>
                                Age Groups
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {profileData.selectedAgeGroups.map(age => (
                                <Chip 
                                  key={age}
                                  label={age} 
                                  sx={{ 
                                    backgroundColor: `${theme.primary}10`,
                                    color: theme.primary,
                                    borderRadius: 2
                                  }} 
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <Grid container spacing={3}>
                    {/* Non-education services */}
                    {profileData.selectedServices?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20`, height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Assignment sx={{ color: theme.primary, mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.text.primary }}>
                                Services
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {profileData.selectedServices.map(service => (
                                <Chip 
                                  key={service}
                                  label={service} 
                                  sx={{ 
                                    backgroundColor: `${theme.primary}10`,
                                    color: theme.primary,
                                    borderRadius: 2
                                  }} 
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    
                    {profileData.selectedPetTypes?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20`, height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Pets sx={{ color: theme.accent, mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.text.primary }}>
                                Pet Types
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {profileData.selectedPetTypes.map(pet => (
                                <Chip 
                                  key={pet}
                                  label={pet} 
                                  sx={{ 
                                    backgroundColor: `${theme.accent}10`,
                                    color: theme.accent,
                                    borderRadius: 2
                                  }} 
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                )}
              </>
            )}
            
            {activeTab === 2 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: theme.text.secondary, mb: 2 }}>
                  Reviews will appear here
                </Typography>
                <Typography variant="body1" sx={{ color: theme.text.light }}>
                  This service provider has {profileData.reviewCount} reviews with an average rating of {profileData.rating}
                </Typography>
              </Box>
            )}
            
            {activeTab === 3 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: theme.text.secondary, mb: 2 }}>
                  Availability: {profileData.availability}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.text.light }}>
                  Contact this service provider to schedule an appointment
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    );
  }
  
  // Provider view of the profile (edit mode)
  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: theme.background, minHeight: '100vh' }}>
      {/* View mode toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={toggleViewMode}
          sx={{ 
            borderColor: theme.primary, 
            color: theme.primary,
            '&:hover': { borderColor: theme.primary, backgroundColor: `${theme.primary}10` }
          }}
        >
          Preview Client View
        </Button>
      </Box>
      
      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header with buttons */}
        <Box sx={{ 
          p: 4, 
          backgroundColor: theme.primary, 
          backgroundImage: 'linear-gradient(to right, #4F46E5, #6366F1)',
          color: 'white'
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Your Service Provider Profile
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
                Manage and update your profile information
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{
                  backgroundColor: 'white',
                  color: theme.primary,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={handleGeneratePDF}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                }}
              >
                Download PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<Delete />}
                onClick={handleDelete}
                sx={{
                  backgroundColor: theme.error,
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#DC2626' }, // Darker red
                  display: { xs: 'none', md: 'flex' } // Hide on mobile
                }}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Grid container>
          {/* Sidebar with photo and basic info */}
          <Grid item xs={12} md={4} sx={{ 
            borderRight: { md: `1px solid ${theme.text.light}20` },
            p: 4
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={profileData.photo}
                alt={profileData.name}
                sx={{ 
                  width: 180, 
                  height: 180, 
                  mb: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
              
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 1, textAlign: 'center' }}>
                {profileData.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn sx={{ color: theme.text.light, fontSize: 20, mr: 0.5 }} />
                <Typography variant="body1" sx={{ color: theme.text.secondary }}>
                  {profileData.location}
                </Typography>
              </Box>
              
              <Box sx={{ 
                width: '100%', 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: `${theme.primary}05`,
                mb: 3
              }}>
                <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 'medium', mb: 1 }}>
                  Service Type
                </Typography>
                <Chip 
                  label={profileData.serviceType} 
                  sx={{ 
                    backgroundColor: theme.primary,
                    color: 'white',
                    borderRadius: 1
                  }} 
                />
              </Box>
              
              <Divider sx={{ width: '100%', mb: 3 }} />
              
              <Box sx={{ width: '100%' }}>
                <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 'medium', mb: 1 }}>
                  Basic Information
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    NIC
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.text.primary, fontWeight: 'medium' }}>
                    {profileData.nic}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    Availability
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.text.primary, fontWeight: 'medium' }}>
                    {profileData.availability}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                    Gender
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.text.primary, fontWeight: 'medium' }}>
                    {profileData.gender}
                  </Typography>
                </Box>
              </Box>
              
              {profileData.birthCertificate && (
                <Box sx={{ width: '100%', mt: 3 }}>
                  <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 'medium', mb: 1 }}>
                    Documents
                  </Typography>
                  <Link 
                    href={profileData.birthCertificate} 
                    target="_blank" 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      color: theme.primary,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <Description sx={{ mr: 1 }} />
                    Birth Certificate
                  </Link>
                </Box>
              )}
              
              {/* Only show delete button on mobile */}
              <Box sx={{ width: '100%', mt: 3, display: { xs: 'block', md: 'none' } }}>
                <Button
                  variant="contained"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  fullWidth
                  sx={{
                    backgroundColor: theme.error,
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#DC2626' }, // Darker red
                  }}
                >
                  Delete Profile
                </Button>
              </Box>
            </Box>
          </Grid>
          
          {/* Main content area */}
          <Grid item xs={12} md={8} sx={{ p: 4 }}>
            {/* About section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                About Me
              </Typography>
              <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                <CardContent>
                  <Typography variant="body1" sx={{ color: theme.text.primary, lineHeight: 1.7 }}>
                    {profileData.about}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            {/* Pay Rate section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                Hourly Rate Range
              </Typography>
              <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.primary }}>
                    {profileData.payRate && profileData.payRate.length === 2
                      ? `Rs. ${profileData.payRate[0]} - Rs. ${profileData.payRate[1]}`
                      : 'Pay Rate Not Specified'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            {/* Languages */}
            {profileData.selectedLanguages?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                  Languages Spoken
                </Typography>
                <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profileData.selectedLanguages.map(lang => (
                        <Chip 
                          key={lang}
                          icon={<Language />}
                          label={lang} 
                          sx={{ 
                            backgroundColor: `${theme.primary}10`,
                            color: theme.primary,
                            borderRadius: 2,
                            py: 0.5
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Services section - conditional based on service type */}
            {profileData.serviceType !== 'Education' && profileData.selectedServices?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                  Services Offered
                </Typography>
                <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profileData.selectedServices.map(service => (
                        <Chip 
                          key={service}
                          label={service} 
                          sx={{ 
                            backgroundColor: `${theme.accent}10`,
                            color: theme.accent,
                            borderRadius: 2
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Pet Types */}
            {profileData.selectedPetTypes?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                  Pet Types
                </Typography>
                <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profileData.selectedPetTypes.map(pet => (
                        <Chip 
                          key={pet}
                          label={pet} 
                          sx={{ 
                            backgroundColor: `${theme.secondary}10`,
                            color: theme.secondary,
                            borderRadius: 2
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Education specific sections */}
            {profileData.serviceType === 'Education' && (
              <>
                {/* Syllabus */}
                {profileData.selectedSyllabi?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                      Syllabus
                    </Typography>
                    <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profileData.selectedSyllabi.map(syllabus => (
                            <Chip 
                              key={syllabus}
                              label={syllabus} 
                              sx={{ 
                                backgroundColor: `${theme.primary}10`,
                                color: theme.primary,
                                borderRadius: 2
                              }} 
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                )}
                
                {/* Subjects */}
                {profileData.selectedSubjects?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                      Subjects
                    </Typography>
                    <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profileData.selectedSubjects.map(subject => (
                            <Chip 
                              key={subject}
                              label={subject} 
                              sx={{ 
                                backgroundColor: `${theme.accent}10`,
                                color: theme.accent,
                                borderRadius: 2
                              }} 
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                )}
                
                {/* Grades */}
                {profileData.selectedGrades?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                      Grades
                    </Typography>
                    <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profileData.selectedGrades.map(grade => (
                            <Chip 
                              key={grade}
                              label={grade} 
                              sx={{ 
                                backgroundColor: `${theme.secondary}10`,
                                color: theme.secondary,
                                borderRadius: 2
                              }} 
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                )}
                
                {/* Age Groups */}
                {profileData.selectedAgeGroups?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.text.primary, mb: 2 }}>
                      Age Groups
                    </Typography>
                    <Card elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.text.light}20` }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profileData.selectedAgeGroups.map(age => (
                            <Chip 
                              key={age}
                              label={age} 
                              sx={{ 
                                backgroundColor: `${theme.primary}10`,
                                color: theme.primary,
                                borderRadius: 2
                              }} 
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ServiceProviderProfile;
