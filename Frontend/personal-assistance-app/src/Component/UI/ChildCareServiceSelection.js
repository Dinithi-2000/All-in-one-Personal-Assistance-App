import React, { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Slider,
  Card,
  Divider,
  Box,
  styled,
  Chip
} from '@mui/material';
import { LocalOffer } from '@mui/icons-material';

const ageGroups = ['Newborn', 'Toddler', 'Pre-school', 'Primary School', 'Teenager (12+ years)'];
const services = ['Day Care', 'After School Care', 'Nannies', 'Baby Sitters', 'In-Home Care', 'Childminders'];
const languages = ['Sinhala', 'English', 'Tamil'];

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#40E0D0',
  color: 'white',
  margin: '4px',
  borderRadius: '20px',
  padding: '8px 20px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#38CAB8',
    transform: 'translateY(-2px)'
  },
  '&.selected': {
    backgroundColor: '#FF7F50',
    boxShadow: theme.shadows[2],
    '&:hover': {
      backgroundColor: '#FF6347',
      transform: 'translateY(-2px)'
    }
  }
}));

const ChildCareService = () => {

  const navigate = useNavigate();

  // Access the passed state
  const location = useLocation();
  const { location: selectedLocation, serviceType } = location.state || {};

  // Existing state
  const [payRate, setPayRate] = useState([500, 2000]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  // Use the values in your component
  console.log('Selected Location:', selectedLocation);
  console.log('Service Type:', serviceType)

  const toggleSelection = (item, state, setState) => {
    setState(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleNext = () => {
    if (selectedAgeGroups.length === 0) {
      alert("Please select at least one age group.");
      return;
    }

    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    if (selectedLanguages.length === 0) {
      alert("Please select at least one language.");
      return;
    }
    navigate('/createaccount', {
      state: {
        serviceData: {
          serviceType: 'ChildCare',
          location: selectedLocation,
          payRate,
          selectedAgeGroups,
          selectedServices,
          selectedLanguages
        }
      }
    });
  };

  return (
    <Container sx={{ 
      backgroundColor: '#FAF9F6',
      minHeight: '100vh',
      py: 4,
      px: { xs: 2, sm: 4 }
    }}>
      <Typography variant="h4" sx={{ 
        color: '#001F3F', 
        mb: 4,
        fontWeight: 700,
        textAlign: 'center',
        letterSpacing: 1
      }}>
        👶 Child Care Services 🧸
      </Typography>

      {/* Add location display */}
      <Typography variant="h6" align="center" gutterBottom>
        Serving: {selectedLocation || 'All Areas'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
          <Card sx={{ 
            p: 3,
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,31,63,0.1)'
          }}>
            {/* Pay Rate Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                color: '#001F3F',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LocalOffer fontSize="small" />
                Hourly Pay Rate Range
              </Typography>
              
              <Slider
                value={payRate}
                onChange={(e, newValue) => setPayRate(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `Rs. ${value}`}
                min={500}
                max={2000}
                step={100}
                sx={{
                  color: '#40E0D0',
                  height: 8,
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#FF7F50',
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,31,63,0.2)'
                  }
                }}
              />
              
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1
              }}>
                <Chip label={`Min: Rs. ${payRate[0]}`} sx={{ bgcolor: '#E6F7F5' }} />
                <Chip label={`Max: Rs. ${payRate[1]}`} sx={{ bgcolor: '#E6F7F5' }} />
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: '#E0E0E0' }} />

            {/* Age Groups Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                color: '#001F3F',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                🧒 Child Age Group
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {ageGroups.map(age => (
                  <StyledButton
                    key={age}
                    variant="contained"
                    className={selectedAgeGroups.includes(age) ? 'selected' : ''}
                    onClick={() => toggleSelection(age, selectedAgeGroups, setSelectedAgeGroups)}
                  >
                    {age}
                  </StyledButton>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: '#E0E0E0' }} />

            {/* Services Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                color: '#001F3F',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                🏫 Services Offered
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {services.map(service => (
                  <StyledButton
                    key={service}
                    variant="contained"
                    className={selectedServices.includes(service) ? 'selected' : ''}
                    onClick={() => toggleSelection(service, selectedServices, setSelectedServices)}
                  >
                    {service}
                  </StyledButton>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: '#E0E0E0' }} />

            {/* Languages Section */}
            <Box>
              <Typography variant="h6" sx={{ 
                color: '#001F3F',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                🌍 Languages Spoken
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {languages.map(lang => (
                  <StyledButton
                    key={lang}
                    variant="contained"
                    className={selectedLanguages.includes(lang) ? 'selected' : ''}
                    onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                  >
                    {lang}
                  </StyledButton>
                ))}
              </Box>
            </Box>

            {/* Next Button Section */}
                        <Box sx={{ 
                                      mt: 4, 
                                      display: 'flex', 
                                      justifyContent: 'flex-end',
                                      paddingTop: '20px'
                                    }}>
                                      <StyledButton
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{
                                          px: 6,
                                          py: 1.5,
                                          fontSize: '1.1rem',
                                          fontWeight: 600,
                                          '&:hover': {
                                            transform: 'translateY(-2px)'
                                          }
                                        }}
                                      >
                                        Next
                                      </StyledButton>
                                    </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChildCareService;