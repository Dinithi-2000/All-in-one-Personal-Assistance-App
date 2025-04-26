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
} from '@mui/material';
import { Edit, Delete, Description, PictureAsPdf } from '@mui/icons-material';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider'; // Backend base URL

const ServiceProviderProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem('serviceProviderProfile');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Raw Data from localStorage:', parsedData); // Debug: Log raw data
        if (parsedData && typeof parsedData === 'object') {
          const data = parsedData.data || parsedData;
          console.log('Extracted Data (parsedData.data || parsedData):', data); // Debug: Log extracted data
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
          };
          console.log('Normalized Profile Data:', normalizedData); // Debug: Log normalized data
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

  // Debug: Log when profileData changes
  useEffect(() => {
    if (profileData) {
      console.log('profileData Updated:', profileData);
    }
  }, [profileData]);

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
    doc.setTextColor(0, 31, 63); // #001F3F
    doc.text(profileData.serviceType || 'Service Provider Profile', 20, 20);

    // Profile Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
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
    doc.setTextColor(0, 31, 63);
    doc.text('About Me', 20, yPosition);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
    const aboutText = doc.splitTextToSize(profileData.about || 'No information provided.', 170);
    doc.text(aboutText, 20, yPosition);
    yPosition += aboutText.length * 7 + 10;

    // Hourly Rate Range
    doc.setFontSize(14);
    doc.setTextColor(0, 31, 63);
    doc.text('Hourly Rate Range', 20, yPosition);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
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
      doc.setTextColor(0, 31, 63);
      doc.text('Languages Spoken', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      doc.text(profileData.selectedLanguages.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Services Offered
    if (profileData.serviceType !== 'Education' && profileData.selectedServices?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 31, 63);
      doc.text('Services Offered', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      doc.text(profileData.selectedServices.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Pet Types
    if (profileData.selectedPetTypes?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 31, 63);
      doc.text('Pet Types', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      doc.text(profileData.selectedPetTypes.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Syllabus (Education Category)
    if (profileData.serviceType === 'Education' && profileData.selectedSyllabi?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 31, 63);
      doc.text('Syllabus', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      doc.text(profileData.selectedSyllabi.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Subjects
    if (profileData.selectedSubjects?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 31, 63);
      doc.text('Subjects', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      doc.text(profileData.selectedSubjects.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Grades
    if (profileData.selectedGrades?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 31, 63);
      doc.text('Grades', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      doc.text(profileData.selectedGrades.join(', '), 20, yPosition);
      yPosition += 15;
    }

    // Age Groups
    if (profileData.selectedAgeGroups?.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 31, 63);
      doc.text('Age Groups', 20, yPosition);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
      doc.text(profileData.selectedAgeGroups.join(', '), 20, yPosition);
    }

    // Save the PDF
    doc.save(`${profileData.name || 'service-provider'}_profile.pdf`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  // Debug: Log profileData just before rendering specific fields
  console.log('Rendering Name:', profileData.name);
  console.log('Rendering Location:', profileData.location);

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        backgroundColor: '#FAF9F6', // Soft off-white background
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
       
        {/* Header Section
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#001F3F', fontWeight: 'bold' }}>
            {profileData.serviceType || 'Service Provider Profile'}
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{
                backgroundColor: '#40E0D0', // Turquoise blue
                color: 'white',
                mr: 2,
                '&:hover': {
                  backgroundColor: '#38CAB8',
                },
              }}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={handleGeneratePDF}
              sx={{
                backgroundColor: '#1976D2', // Blue for PDF
                color: 'white',
                mr: 2,
                '&:hover': {
                  backgroundColor: '#1565C0',
                },
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<Delete />}
              color="error"
              onClick={handleDelete}
              sx={{
                backgroundColor: '#FF7F50', // Coral
                color: 'white',
                '&:hover': {
                  backgroundColor: '#FF6347',
                },
              }}
            >
              Delete Profile
            </Button>
          </Box>
        </Box> */}

        {/* Header Section */}
<Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', // Add this to vertically center align items
  mb: 4,
  flexWrap: 'wrap' // Allow wrapping if needed
}}>
  <Typography variant="h4" sx={{ 
    color: '#001F3F', 
    fontWeight: 'bold',
    flex: 1, // Allow title to take available space
    minWidth: '300px' // Prevent title from squeezing buttons
  }}>
    {profileData.serviceType || 'Service Provider Profile'}
  </Typography>
   
  <Box sx={{
    display: 'flex',
    gap: 2, // Use gap instead of mr for consistent spacing
    flexWrap: 'wrap', // Allow buttons to wrap if needed
    justifyContent: 'flex-end'
  }}>
    {/* Spacer between header and content */}
   <Box sx={{ height: 24 }} /> {/* Added spacer */}
        {/* Spacer between header and content */}
        {/* <Box sx={{ height: 24 }} /> Added spacer */}
       
    <Button
      variant="contained"
      startIcon={<Edit />}
      onClick={handleEdit}
      sx={{
        backgroundColor: '#40E0D0',
        color: 'white',
        '&:hover': { backgroundColor: '#38CAB8' },
        whiteSpace: 'nowrap' // Prevent button text from wrapping
      }}
    >
      Edit Profile
    </Button>
    <Button
      variant="contained"
      startIcon={<PictureAsPdf />}
      onClick={handleGeneratePDF}
      sx={{
        backgroundColor: '#1976D2',
        color: 'white',
        '&:hover': { backgroundColor: '#1565C0' },
        whiteSpace: 'nowrap'
      }}
    >
      Download PDF
    </Button>
    <Button
      variant="contained"
      startIcon={<Delete />}
      color="error"
      onClick={handleDelete}
      sx={{
        backgroundColor: '#FF7F50',
        color: 'white',
        '&:hover': { backgroundColor: '#FF6347' },
        whiteSpace: 'nowrap'
      }}
    >
      Delete Profile
    </Button>
  </Box>
</Box>

        <Grid container spacing={4}>
          {/* Profile Photo and Basic Info */}
          <Grid item xs={12} md={4} key={profileData._id}>
            <Avatar
              src={profileData.photo}
              alt="Profile Photo"
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            {/* Replace Typography with plain div to rule out MUI issues */}
            <div
              style={{
                border: '2px solid green',
                padding: '5px',
                color: '#001F3F',
                fontWeight: 'bold',
                fontSize: '1.5rem', // Approximate h5 size
                display: 'block',
              }}
            >
              {profileData.name || 'No Name Provided'}
            </div>
            <div
              style={{
                border: '2px solid green',
                padding: '5px',
                color: '#001F3F',
                fontSize: '1.1rem', // Approximate subtitle1 size
                display: 'block',
              }}
            >
              📍 {profileData.location || 'No Location Provided'} | {profileData.serviceType || 'No Service Type Provided'}
            </div>
            <Typography
              variant="body1"
              sx={{ color: '#001F3F', mt: 1, border: '1px solid red' }}
            >
              <strong>NIC:</strong> {profileData.nic || 'Not Provided'}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#001F3F', mt: 1, border: '1px solid red' }}
            >
              <strong>Availability:</strong> {profileData.availability || 'Not Provided'}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#001F3F', mt: 1, border: '1px solid red' }}
            >
              <strong>Gender:</strong> {profileData.gender || 'Not Provided'}
            </Typography>
            {profileData.birthCertificate && (
              <Box sx={{ mt: 1 }}>
                <Link href={profileData.birthCertificate} target="_blank" sx={{ color: '#40E0D0' }}>
                  <Description sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  View Birth Certificate
                </Link>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* About Me Section */}
            
            <Box sx={{ mb: 4 }}>
            <strong>About Me</strong>
              {/* <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                
              </Typography> */}
              <Typography variant="body1" sx={{ color: '#001F3F' }}>
                {profileData.about || 'No information provided.'}
              </Typography>
            </Box>

            {/* Pay Rate Section */}
            <Box sx={{ mb: 4 }}>
              <strong>Hourly Rate Range</strong>
              {/* <Typography variant="h6" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                Hourly Rate Range
              </Typography> */}
             <br /> 
              <Chip
                label={
                  profileData.payRate && profileData.payRate.length === 2
                    ? `Rs. ${profileData.payRate[0]} - Rs. ${profileData.payRate[1]}`
                    : 'Pay Rate Not Specified'
                }
                sx={{ backgroundColor: '#40E0D0', color: 'white' }}
              />
            </Box>

            {/* Languages Spoken */}
            {profileData.selectedLanguages?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <strong>Languages Spoken</strong>
                {/* <Typography variant="h6" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Languages Spoken
                </Typography> */}
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.selectedLanguages.map((lang) => (
                    <Chip key={lang} label={lang} sx={{ backgroundColor: '#40E0D0', color: 'white' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Services Offered (Conditional Rendering for Non-Education Categories) */}
            {profileData.serviceType !== 'Education' && profileData.selectedServices?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <strong>Services Offered</strong>
                {/* <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Services Offered
                </Typography> */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.selectedServices.map((service) => (
                    <Chip key={service} label={service} sx={{ backgroundColor: '#FF7F50', color: 'white' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Pet Types */}
            {profileData.selectedPetTypes?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <strong>Pet Types</strong>
                {/* <Typography variant="h6" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Pet Types
                </Typography> */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.selectedPetTypes.map((pet) => (
                    <Chip key={pet} label={pet} sx={{ backgroundColor: '#40E0D0', color: 'white' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Syllabus (Education Category) */}
            {profileData.serviceType === 'Education' && profileData.selectedSyllabi?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <strong>Syllabus</strong>
                {/* <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Syllabus
                </Typography> */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.selectedSyllabi.map((syllabus) => (
                    <Chip key={syllabus} label={syllabus} sx={{ backgroundColor: '#40E0D0', color: 'white' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Subjects */}
            {profileData.selectedSubjects?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <strong>Subjects</strong>
                {/* <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Subjects
                </Typography> */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.selectedSubjects.map((subject) => (
                    <Chip key={subject} label={subject} sx={{ backgroundColor: '#FF7F50', color: 'white' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Grades */}
            {profileData.selectedGrades?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <strong> Grades</strong>
                {/* <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Grades
                </Typography> */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.selectedGrades.map((grade) => (
                    <Chip key={grade} label={grade} sx={{ backgroundColor: '#40E0D0', color: 'white' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Age Groups */}
            {profileData.selectedAgeGroups?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <strong>Age Groups</strong>
                {/* <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Age Groups
                </Typography> */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.selectedAgeGroups.map((age) => (
                    <Chip key={age} label={age} sx={{ backgroundColor: '#FF7F50', color: 'white' }} />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ServiceProviderProfile;
