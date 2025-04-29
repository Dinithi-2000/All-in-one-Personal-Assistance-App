import React from 'react';
import { Button, Typography, Avatar } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const PhotoUploader = ({ photo, setPhoto, error }) => {
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {photo && (
        <Avatar
          src={photo}
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
        Upload Profile Photo
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handlePhotoChange}
        />
      </Button>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default PhotoUploader;
