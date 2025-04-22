import React, { useState,useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import { deleteServiceProvider } from './api';
import { 
  Container,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled
} from '@mui/material';

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider'; // Backend base URL

const DeleteAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileData: initialProfileData } = location.state || {}; // Rename to avoid conflict
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [profileData, setProfileData] = useState(initialProfileData || null); // Use initialProfileData

  // Fetch profile data from localStorage if not passed via location.state
  useEffect(() => {
    if (!profileData) {
      const savedData = localStorage.getItem('serviceProviderProfile');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setProfileData(parsedData);
        } catch (error) {
          console.error('Error parsing profile data:', error);
        }
      }
    }
  }, [profileData]);



  const RedButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#FF0000',
    color: 'white',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: '#CC0000',
      boxShadow: theme.shadows[3]
    },
  }));

  const TurquoiseButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#40E0D0',
    color: 'white',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: '#38CAB8',
      boxShadow: theme.shadows[3]
    },
  }));

  const handleConfirmationOpen = () => {
    if (confirmed && password.length > 0) {
      setOpenConfirmation(true);
    }
  };

  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
  };

  const handleDeleteAccount = async () => {
    if (!profileData || !profileData._id) {
      console.error('Profile data or ID is missing');
      return;
    }

    try {
      await deleteServiceProvider(profileData._id); 
      localStorage.removeItem('serviceProviderProfile');
      navigate('/spdashboard');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    }
  };


  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FAF9F6' // Soft off-white background
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          borderRadius: 3,
          backgroundColor: 'white'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center"
          gutterBottom 
          sx={{ 
            color: '#001F3F', // Deep navy
            fontWeight: 600,
            mb: 3
          }}
        >
          Delete Account
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 4,
            p: 2,
            border: '1px solid #FFD0D0',
            borderRadius: 2,
            backgroundColor: '#FFF5F5'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#FF0000',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Are you sure you want to delete your account?
          </Typography>
          
          <Typography 
            variant="body1"
            sx={{ 
              color: '#001F3F',
              lineHeight: 1.6 
            }}
          >
            This action is permanent and cannot be undone. All your data will be permanently erased.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter your password to confirm"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                sx: {
                  color: '#001F3F',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FF0000'
                  }
                }
              }}
              InputLabelProps={{
                sx: { color: '#001F3F' }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for leaving (optional)"
              variant="outlined"
              multiline
              rows={4}
              placeholder="Help us improve our service..."
              InputProps={{
                sx: {
                  color: '#001F3F',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#40E0D0'
                  }
                }
              }}
              InputLabelProps={{
                sx: { color: '#001F3F' }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  sx={{
                    color: '#FF0000',
                    '&.Mui-checked': {
                      color: '#FF0000',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#001F3F', fontWeight: 'medium' }}>
                  I understand this action is permanent and cannot be undone
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <TurquoiseButton variant="contained" onClick={() => navigate('/')}>
                  Cancel
                </TurquoiseButton>
              </Grid>
              <Grid item>
                <RedButton 
                  variant="contained" 
                  disabled={!confirmed || password.length === 0}
                  onClick={handleConfirmationOpen}
                >
                  Delete Account
                </RedButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Final confirmation dialog */}
      <Dialog
        open={openConfirmation}
        onClose={handleConfirmationClose}
      >
        <DialogTitle sx={{ color: '#FF0000', fontWeight: 'bold' }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your account and all associated data will be permanently deleted. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} sx={{ color: '#40E0D0' }}>
            Cancel
          </Button>
          <Button sx={{ color: '#FF0000', fontWeight: 'bold' }}
          onClick={handleDeleteAccount} // Handle account deletion
          >
            Yes, Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeleteAccount;