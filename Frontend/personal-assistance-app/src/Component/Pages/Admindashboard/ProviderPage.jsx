import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Avatar,
  Box,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import {
  Edit,
  Delete,
  Save,
  Cancel,
  Search,
  FilterList,
  Refresh,
  Download
} from '@mui/icons-material';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import jspdf-autotable correctly

const API_BASE_URL = 'http://localhost:8070/home/serviceProvider';

const ProviderPage = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/service-providers`);
      const normalizedProviders = response.data.map(provider => ({
        ...provider,
        name: provider.name || '',
        email: provider.email || '',
        serviceType: provider.serviceType || '',
        location: provider.location || '',
        payRate: provider.payRate || [500, 2000],
        selectedLanguages: provider.selectedLanguages || [],
        availability: provider.availability || 'no',
      }));
      setServiceProviders(normalizedProviders);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      showSnackbar('Failed to fetch service providers', 'error');
    }
  };

  const handleDeleteClick = (provider) => {
    setProviderToDelete(provider);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/delete-service-provider/${providerToDelete._id}`);
      setServiceProviders(serviceProviders.filter(sp => sp._id !== providerToDelete._id));
      showSnackbar('Service provider deleted successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to delete service provider', 'error');
    }
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (provider) => {
    setEditingProvider({ ...provider });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-service-provider/${editingProvider._id}`,
        editingProvider
      );
      
      const updatedProvider = response.data.data;
      const normalizedProvider = {
        ...updatedProvider,
        name: updatedProvider.name || '',
        email: updatedProvider.email || '',
        serviceType: updatedProvider.serviceType || '',
        location: updatedProvider.location || '',
        payRate: updatedProvider.payRate || [500, 2000],
        selectedLanguages: updatedProvider.selectedLanguages || [],
        availability: updatedProvider.availability || 'no',
      };
      
      setServiceProviders(serviceProviders.map(sp => 
        sp._id === editingProvider._id ? normalizedProvider : sp
      ));
      
      showSnackbar('Service provider updated successfully', 'success');
      setEditDialogOpen(false);
    } catch (err) {
      showSnackbar('Failed to update service provider', 'error');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProvider({ ...editingProvider, [name]: value });
  };

  const handleCheckboxChange = (field, value) => {
    const currentValues = editingProvider[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    setEditingProvider({ ...editingProvider, [field]: newValues });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesSearch = 
      (provider.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.serviceType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || provider.serviceType.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const paginatedProviders = filteredProviders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const serviceTypes = [...new Set(serviceProviders.map(sp => sp.serviceType))].filter(type => type !== '');

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // No need to manually apply autoTable; it's automatically available with the correct import

    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204); // Blue color for title
    doc.text('Service Providers Report', 14, yPosition);
    
    // Date on the right side of the header
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100); // Gray color for date
    doc.text(`Generated on: ${date}`, 140, yPosition);
    yPosition += 10;

    // Add a horizontal line below the header
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 102, 204);
    doc.line(14, yPosition, 196, yPosition);
    yPosition += 10;

    // Group providers by service type
    const groupedProviders = serviceProviders.reduce((acc, provider) => {
      const type = provider.serviceType || 'Unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push(provider);
      return acc;
    }, {});

    // Sort service types alphabetically
    const sortedServiceTypes = Object.keys(groupedProviders).sort();

    sortedServiceTypes.forEach((serviceType, index) => {
      // Service Type Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text(`Category: ${serviceType}`, 14, yPosition);
      yPosition += 8;

      // Reset font for table
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      // Prepare table data
      const tableData = groupedProviders[serviceType].map((provider, providerIndex) => [
        provider.name,
        provider.email,
        provider.location,
        `${provider.payRate[0]} - ${provider.payRate[1]}`,
        provider.selectedLanguages.join(', ') || 'None',
        provider.availability === 'yes' ? 'Available' : 'Not Available'
      ]);

      // Define table columns
      const tableColumns = [
        'Name',
        'Email',
        'Location',
        'Rate (Rs/hr)',
        'Languages',
        'Availability'
      ];

      // Generate table using jspdf-autotable
      autoTable(doc, {
        startY: yPosition,
        head: [tableColumns],
        body: tableData,
        theme: 'striped', // Alternating row colors
        headStyles: {
          fillColor: [0, 102, 204], // Blue header background
          textColor: 255, // White text
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: 50
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240] // Light gray for alternate rows
        },
        margin: { left: 14, right: 14 },
        styles: {
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: 200
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Name
          1: { cellWidth: 40 }, // Email
          2: { cellWidth: 30 }, // Location
          3: { cellWidth: 25 }, // Rate
          4: { cellWidth: 30 }, // Languages
          5: { cellWidth: 25 }  // Availability
        }
      });

      // Update yPosition after the table
      yPosition = doc.lastAutoTable.finalY + 15;
    });

    // Add page numbers as footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }

    // Download the PDF
    doc.save('service-providers-report.pdf');
  };

  console.log('searchTerm:', searchTerm);
  console.log('filter:', filter);
  console.log('serviceProviders:', serviceProviders);
  console.log('serviceTypes:', serviceTypes);
  console.log('filteredProviders:', filteredProviders);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1a1a1a, #000000)',
      color: 'white',
      p: 4
    }}>
      <Box sx={{ maxWidth: '7xl', mx: 'auto', px: 4, py: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'white',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'inline-block',
          }}
        >
          Service Providers Management
        </Typography>
        
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: 'white', mr: 1 }} />
                  ),
                  sx: {
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'white' }}>Filter by Service</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white'
                    }
                  }}
                >
                  <MenuItem value="all">All Services</MenuItem>
                  {serviceTypes.map(type => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Download PDF">
                <IconButton onClick={generatePDF} sx={{ color: 'white', mr: 1 }}>
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchServiceProviders} sx={{ color: 'white' }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Profile</TableCell>
                    <TableCell sx={{ color: 'white' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white' }}>Service Type</TableCell>
                    <TableCell sx={{ color: 'white' }}>Location</TableCell>
                    <TableCell sx={{ color: 'white' }}>Rate (Rs/hr)</TableCell>
                    <TableCell sx={{ color: 'white' }}>Languages</TableCell>
                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProviders.length > 0 ? (
                    paginatedProviders.map((provider) => (
                      <TableRow 
                        key={provider._id} 
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.05)' 
                          } 
                        }}
                      >
                        <TableCell>
                          <Avatar src={provider.photo} alt={provider.name} />
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{provider.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{provider.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={provider.serviceType} 
                            color="primary" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{provider.location}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {provider.payRate[0]} - {provider.payRate[1]}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {provider.selectedLanguages?.map(lang => (
                              <Chip
                                key={lang}
                                label={lang}
                                size="small"
                                sx={{
                                  color: 'white',
                                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={provider.availability === 'yes' ? 'Available' : 'Not Available'} 
                            color={provider.availability === 'yes' ? 'success' : 'error'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton 
                              onClick={() => handleEditClick(provider)} 
                              sx={{ color: 'white' }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              onClick={() => handleDeleteClick(provider)} 
                              sx={{ color: 'white' }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ color: 'white' }}>
                        No service providers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredProviders.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white'
                  }
                }}
              />
            </Box>
          </>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#1a1a1a',
              color: 'white'
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'white' }}>
              Are you sure you want to delete {providerToDelete?.name}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialogOpen(false)} 
              startIcon={<Cancel />}
              sx={{ color: 'white' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error"
              startIcon={<Delete />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {editingProvider && (
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: {
                backgroundColor: '#1a1a1a',
                color: 'white'
              }
            }}
          >
            <DialogTitle sx={{ color: 'white' }}>Edit Service Provider</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={editingProvider.name || ''}
                    onChange={handleEditChange}
                    margin="normal"
                    InputProps={{
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{
                      sx: { color: 'white' }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={editingProvider.email || ''}
                    onChange={handleEditChange}
                    margin="normal"
                    InputProps={{
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{
                      sx: { color: 'white' }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="NIC"
                    name="nic"
                    value={editingProvider.nic || ''}
                    onChange={handleEditChange}
                    margin="normal"
                    InputProps={{
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{
                      sx: { color: 'white' }
                    }}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: 'white' }}>Location</InputLabel>
                    <Select
                      name="location"
                      value={editingProvider.location || ''}
                      onChange={handleEditChange}
                      sx={{
                        color: 'white',
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }}
                    >
                      {[
                        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 
                        'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 
                        'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 
                        'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 
                        'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 
                        'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'
                      ].map(loc => (
                        <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: 'white' }}>Service Type</InputLabel>
                    <Select
                      name="serviceType"
                      value={editingProvider.serviceType || ''}
                      onChange={handleEditChange}
                      sx={{
                        color: 'white',
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }}
                    >
                      <MenuItem value="HouseCleaning">House Cleaning</MenuItem>
                      <MenuItem value="KitchenHelpers">Kitchen Helpers</MenuItem>
                      <MenuItem value="ChildCare">Child Care</MenuItem>
                      <MenuItem value="ElderCare">Elder Care</MenuItem>
                      <MenuItem value="PetCare">Pet Care</MenuItem>
                      <MenuItem value="Education">Education</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Min Rate (Rs)"
                      name="payRate[0]"
                      type="number"
                      value={editingProvider.payRate[0] || 500}
                      onChange={(e) => {
                        const newPayRate = [...editingProvider.payRate];
                        newPayRate[0] = e.target.value;
                        setEditingProvider({ ...editingProvider, payRate: newPayRate });
                      }}
                      margin="normal"
                      InputProps={{
                        sx: { color: 'white' }
                      }}
                      InputLabelProps={{
                        sx: { color: 'white' }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Max Rate (Rs)"
                      name="payRate[1]"
                      type="number"
                      value={editingProvider.payRate[1] || 2000}
                      onChange={(e) => {
                        const newPayRate = [...editingProvider.payRate];
                        newPayRate[1] = e.target.value;
                        setEditingProvider({ ...editingProvider, payRate: newPayRate });
                      }}
                      margin="normal"
                      InputProps={{
                        sx: { color: 'white' }
                      }}
                      InputLabelProps={{
                        sx: { color: 'white' }
                      }}
                    />
                  </Box>

                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: 'white' }}>Availability</InputLabel>
                    <Select
                      name="availability"
                      value={editingProvider.availability || ''}
                      onChange={handleEditChange}
                      sx={{
                        color: 'white',
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }}
                    >
                      <MenuItem value="yes">Available</MenuItem>
                      <MenuItem value="no">Not Available</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                    Languages Spoken
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Sinhala', 'English', 'Tamil'].map(lang => (
                      <FormControlLabel
                        key={lang}
                        control={
                          <Checkbox
                            checked={editingProvider.selectedLanguages?.includes(lang) || false}
                            onChange={() => handleCheckboxChange('selectedLanguages', lang)}
                            sx={{ color: 'white' }}
                          />
                        }
                        label={<Typography sx={{ color: 'white' }}>{lang}</Typography>}
                      />
                    ))}
                  </Box>
                </Grid>

                {editingProvider.serviceType === 'PetCare' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                      Pet Types
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {['Dogs', 'Cats', 'Birds', 'Fish'].map(pet => (
                        <FormControlLabel
                          key={pet}
                          control={
                            <Checkbox
                              checked={editingProvider.selectedPetTypes?.includes(pet) || false}
                              onChange={() => handleCheckboxChange('selectedPetTypes', pet)}
                              sx={{ color: 'white' }}
                            />
                          }
                          label={<Typography sx={{ color: 'white' }}>{pet}</Typography>}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {editingProvider.serviceType === 'ChildCare' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                      Age Groups
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {['Newborn', 'Toddler', 'Pre-school', 'Primary School', 'Teenager (12+ years)'].map(age => (
                        <FormControlLabel
                          key={age}
                          control={
                            <Checkbox
                              checked={editingProvider.selectedAgeGroups?.includes(age) || false}
                              onChange={() => handleCheckboxChange('selectedAgeGroups', age)}
                              sx={{ color: 'white' }}
                            />
                          }
                          label={<Typography sx={{ color: 'white' }}>{age}</Typography>}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {editingProvider.serviceType === 'Education' && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                        Syllabus
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {['Local Syllabus', 'Cambridge Syllabus', 'Edxcel Syllabus'].map(syllabus => (
                          <FormControlLabel
                            key={syllabus}
                            control={
                              <Checkbox
                                checked={editingProvider.selectedSyllabi?.includes(syllabus) || false}
                                onChange={() => handleCheckboxChange('selectedSyllabi', syllabus)}
                                sx={{ color: 'white' }}
                              />
                            }
                            label={<Typography sx={{ color: 'white' }}>{syllabus}</Typography>}
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                        Subjects
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {['Art', 'Business', 'ICT', 'Mathematics', 'Physics', 'Science', 'Music', 'English', 'Chemistry', 'History', 'Other Languages'].map(subject => (
                          <FormControlLabel
                            key={subject}
                            control={
                              <Checkbox
                                checked={editingProvider.selectedSubjects?.includes(subject) || false}
                                onChange={() => handleCheckboxChange('selectedSubjects', subject)}
                                sx={{ color: 'white' }}
                              />
                            }
                            label={<Typography sx={{ color: 'white' }}>{subject}</Typography>}
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                        Grades
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'O/L', 'A/L'].map(grade => (
                          <FormControlLabel
                            key={grade}
                            control={
                              <Checkbox
                                checked={editingProvider.selectedGrades?.includes(grade) || false}
                                onChange={() => handleCheckboxChange('selectedGrades', grade)}
                                sx={{ color: 'white' }}
                              />
                            }
                            label={<Typography sx={{ color: 'white' }}>{grade}</Typography>}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </>
                )}

                {editingProvider.serviceType !== 'Education' && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
                      Services Offered
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(() => {
                        switch(editingProvider.serviceType) {
                          case 'HouseCleaning':
                            return ['Bathroom Cleaning', 'Carpet Cleaning', 'Kitchen Cleaning', 'Laundry', 'Windows Cleaning'];
                          case 'KitchenHelpers':
                            return ['Birthday', 'Family Reunion', 'Friends Gathering', 'Alms Giving', 'Foodie Adventure', 'Other'];
                          case 'ElderCare':
                            return ['Personal Care', 'Transportation', 'Specialized Care', 'Household Tasks', 'Hospice Care', 'Nursing and Health Care'];
                          case 'PetCare':
                            return ['Walking', 'Day Care', 'Overnight Sitting', 'Training', 'Grooming', 'Transportation'];
                          case 'ChildCare':
                            return ['Day Care', 'After School Care', 'Nannies', 'Baby Sitters', 'In-Home Care', 'Childminders'];
                          default:
                            return [];
                        }
                      })().map(service => (
                        <FormControlLabel
                          key={service}
                          control={
                            <Checkbox
                              checked={editingProvider.selectedServices?.includes(service) || false}
                              onChange={() => handleCheckboxChange('selectedServices', service)}
                              sx={{ color: 'white' }}
                            />
                          }
                          label={<Typography sx={{ color: 'white' }}>{service}</Typography>}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About"
                    name="about"
                    value={editingProvider.about || ''}
                    onChange={handleEditChange}
                    multiline
                    rows={4}
                    margin="normal"
                    InputProps={{
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{
                      sx: { color: 'white' }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setEditDialogOpen(false)} 
                startIcon={<Cancel />}
                sx={{ color: 'white' }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditSave} 
                color="primary"
                startIcon={<Save />}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProviderPage;
