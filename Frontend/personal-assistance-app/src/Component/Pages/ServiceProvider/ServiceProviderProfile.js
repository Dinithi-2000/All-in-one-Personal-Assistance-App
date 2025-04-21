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
} from '@mui/material';
import { deleteServiceProvider } from './api';

import { updateServiceProvider } from './api';

import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3803/api'; // Backend base URL

const ServiceProviderProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('serviceProviderProfile');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && typeof parsedData === 'object') {
          console.log('Retrieved Profile Data:', parsedData);
          setProfileData(parsedData);
        } else {
          console.error('Invalid profile data in localStorage');
          localStorage.removeItem('serviceProviderProfile'); // Clear invalid data
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
        localStorage.removeItem('serviceProviderProfile'); // Clear invalid data
      }
    }
  }, []);
  if (!profileData) {
    return <div>Loading...</div>; // Show loading state if profileData is not available
  }

  const handleEdit = () => {
    // Pass the `id` and `serviceType` when navigating to the edit page
    navigate('/editspprofile', { 
      state: { 
        serviceType: profileData.serviceType, 
        id: profileData._id // Ensure this is the correct ID field
      } 
    });
  };
  
  /*const handleDelete = async () => {
    try {
      await deleteServiceProvider(profileData._id); // Use the _id
      localStorage.removeItem('serviceProviderProfile');
      navigate('/deleteaccount');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    }
  };*/
  // In ServiceProviderProfile.js
const handleDelete = () => {
  navigate('/deleteaccount', { state: { profileData } });
};

  
  
  return (
    <Container maxWidth="md" 
    sx={{ py: 4 ,
       backgroundColor: '#FAF9F6', // Soft off-white background
      minHeight: '100vh',
      }}
      >
      <Paper elevation={3} 
      sx={{ p: 4,
         borderRadius: 3 ,
          backgroundColor: 'white',
          }}>
            {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#001F3F', fontWeight: 'bold' }}>
            {profileData.serviceType || 'Service Provider Profile'}
          </Typography>
          <Box>
          <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}
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
          <Button variant="contained" startIcon={<Delete />} color="error" onClick={handleDelete}
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
        </Box>

        <Grid container spacing={4}>
          {/* Profile Photo and Basic Info */}
          <Grid item xs={12} md={4}>
          <Avatar
              src={profileData.photo}
              alt="Profile Photo"
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 'bold' }} //gutterBottom
            >
              {profileData.name || 'No Name Provided'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#001F3F' }} //color="textSecondary"
            >
              📍 {profileData.location || 'No Location Provided'} | {profileData.serviceType || 'No Service Type Provided'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
             {/* About Me Section */}
             <Box sx={{ mb: 4 }}>
              <Typography variant="h6"  sx={{color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                About Me
              </Typography>
              <Typography variant="body1" sx={{ color: '#001F3F' }}>
                {profileData.about || 'No information provided.'}
              </Typography>
            </Box>

            {/* Pay Rate Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{color: '#001F3F', fontWeight: 'bold', mb: 2  }}>
                Hourly Rate Range
              </Typography>
              <Chip label={`Rs. ${profileData.payRate[0]} - Rs. ${profileData.payRate[1]}`} 
              sx={{ backgroundColor: '#40E0D0', color: 'white' }}
              />
            </Box>

            {/* Languages Spoken */}
            {profileData.selectedLanguages?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Languages Spoken
                </Typography>
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
                <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Services Offered
                </Typography>
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
                <Typography variant="h6" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2}}>
                  Pet Types
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.selectedPetTypes.map((pet) => (
                  <Chip key={pet} label={pet} sx={{backgroundColor: '#40E0D0', color: 'white'  }} />
                ))}
              </Box>
              </Box>
            )}

            {/* Syllabus (Education Category) */}
            {profileData.serviceType === 'Education' && profileData.selectedSyllabi?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Syllabus
                </Typography>
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
                <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Subjects
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.selectedSubjects.map((subject) => (
                  <Chip key={subject} label={subject} sx={{backgroundColor: '#FF7F50', color: 'white'}} />
                ))}
              </Box>
              </Box>
            )}

            {/* Grades */}
            {profileData.selectedGrades?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{color: '#001F3F', fontWeight: 'bold', mb: 2}}>
                  Grades
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.selectedGrades.map((grade) => (
                  <Chip key={grade} label={grade} sx={{backgroundColor: '#40E0D0', color: 'white'}} />
                ))}
              </Box>
              </Box>
            )}

            {/* Age Groups */}
            {profileData.selectedAgeGroups?.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 'bold', mb: 2 }}>
                  Age Groups
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.selectedAgeGroups.map((age) => (
                  <Chip key={age} label={age} sx={{ backgroundColor: '#FF7F50', color: 'white'  }} />
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