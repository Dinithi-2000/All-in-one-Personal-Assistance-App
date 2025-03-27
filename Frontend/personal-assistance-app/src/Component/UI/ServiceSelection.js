import { Container, Box, Typography, Button, Select, MenuItem, Link, Paper } from '@mui/material';
import { LocationOn, Assignment } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceSelection = () => {
  const navigate = useNavigate();
  const [selectedServiceType, setSelectedServiceType] = useState('ElderCare');
  const [selectedLocation, setSelectedLocation] = useState('Colombo');

  const handleGetStarted = () => {
    // Map service types to their corresponding routes
    const serviceRoutes = {
      HouseCleaning: '/housecselection',
      KitchenHelpers: '/kitchensselection',
      ChildCare: '/childcaresselection',
      ElderCare: '/eldercselection',
      PetCare: '/petcaresselection',
      Education: '/educationsselection'
    };

    // Navigate to the selected service's route
    navigate(serviceRoutes[selectedServiceType], {
      state: {
        location: selectedLocation,
        serviceType: selectedServiceType
      }
    });
  };

  return (
    <Box sx={{ 
      backgroundColor: '#FAF9F6', 
      minHeight: '100vh', 
      py: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      
      <Container maxWidth="md">
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            color: '#000080', 
            mb: 6, 
            fontWeight: 700,
            textAlign: 'center',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Own Your Hustle, Shape Your Success
        </Typography>

        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 4,
          backgroundColor: 'white'
        }}>
          {/* Location Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#000080', 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LocationOn color="primary" /> Select Your Area
            </Typography>
            <Select
              fullWidth
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              variant="outlined"
              //defaultValue="Colombo"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#40E0D0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#40E0D0 !important',
                }
              }}
            >
              {/* Sri Lankan Districts */}
              <MenuItem value="Colombo">Colombo</MenuItem>
              <MenuItem value="Gampaha">Gampaha</MenuItem>
              <MenuItem value="Kalutara">Kalutara</MenuItem>
              <MenuItem value="Kandy">Kandy</MenuItem>
              <MenuItem value="Matale">Matale</MenuItem>
              <MenuItem value="Nuwara Eliya">Nuwara Eliya</MenuItem>
              <MenuItem value="Galle">Galle</MenuItem>
              <MenuItem value="Matara">Matara</MenuItem>
              <MenuItem value="Hambantota">Hambantota</MenuItem>
              <MenuItem value="Jaffna">Jaffna</MenuItem>
              <MenuItem value="Kilinochchi">Kilinochchi</MenuItem>
              <MenuItem value="Mannar">Mannar</MenuItem>
              <MenuItem value="Vavuniya">Vavuniya</MenuItem>
              <MenuItem value="Mullaitivu">Mullaitivu</MenuItem>
              <MenuItem value="Batticaloa">Batticaloa</MenuItem>
              <MenuItem value="Ampara">Ampara</MenuItem>
              <MenuItem value="Trincomalee">Trincomalee</MenuItem>
              <MenuItem value="Kurunegala">Kurunegala</MenuItem>
              <MenuItem value="Puttalam">Puttalam</MenuItem>
              <MenuItem value="Anuradhapura">Anuradhapura</MenuItem>
              <MenuItem value="Polonnaruwa">Polonnaruwa</MenuItem>
              <MenuItem value="Badulla">Badulla</MenuItem>
              <MenuItem value="Monaragala">Monaragala</MenuItem>
              <MenuItem value="Ratnapura">Ratnapura</MenuItem>
              <MenuItem value="Kegalle">Kegalle</MenuItem>
            </Select>
          </Box>

          {/* Service Type Selection */}
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#000080', 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Assignment color="primary" /> Choose Service Type
            </Typography>
            <Select
              fullWidth
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              variant="outlined"
              //defaultValue="Elder Care"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#40E0D0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#40E0D0 !important',
                }
              }}
            >
              <MenuItem value="HouseCleaning">House Cleaning</MenuItem>
              <MenuItem value="KitchenHelpers">Kitchen Helpers & Chefs</MenuItem>
              <MenuItem value="ChildCare">Child Care & Baby Sittings</MenuItem>
              <MenuItem value="ElderCare">Elder Care</MenuItem>
              <MenuItem value="PetCare">Pet Care Services</MenuItem>            
              <MenuItem value="Education">Education & Tutoring</MenuItem>
             
              </Select>
          </Box>
                    <Button
            fullWidth
            variant="contained"
            onClick={handleGetStarted}
            sx={{
              bgcolor: '#FF7F50',
              py: 2,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#FF6347',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            Get Started
          </Button>

          <Typography 
            variant="body2" 
            sx={{ 
              mt: 3, 
              color: '#000080', 
              textAlign: 'center' 
            }}
          >
            Already have an account?{' '}
            <Link 
              href="#" 
              sx={{ 
                color: '#40E0D0', 
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Paper>

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 4, 
            color: '#00008080', 
            textAlign: 'center' 
          }}
        >
          Copyright © 2025 qmj02
        </Typography>
      </Container>
    </Box>
  );
};

export default ServiceSelection;
                          