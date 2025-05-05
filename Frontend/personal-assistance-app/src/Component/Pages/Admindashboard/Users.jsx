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
  Box,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
  Avatar,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Delete,
  Cancel,
  Search,
  Refresh,
  Download,
  FilterList,
  Person,
  LocationOn,
  Email,
  Phone,
  Info,
  StarOutline,
  PermIdentity,
  Language,
  VerifiedUser,
  Block,
  Visibility
} from '@mui/icons-material';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = 'http://localhost:8070';

// Styled components (Material UI styled API alternative)
const StyledGridContainer = (props) => (
  <Grid 
    container 
    spacing={3} 
    {...props} 
    sx={{ 
      mb: 4,
      ...props.sx
    }} 
  />
);

const StyledCard = (props) => (
  <Card 
    {...props} 
    sx={{ 
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      },
      height: '100%',
      ...props.sx
    }} 
  />
);

const StyledCardContent = (props) => (
  <CardContent 
    {...props} 
    sx={{ 
      p: 3,
      ...props.sx
    }} 
  />
);

const StyledTableContainer = (props) => (
  <TableContainer 
    component={Paper} 
    {...props} 
    sx={{ 
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      mb: 3,
      ...props.sx
    }} 
  />
);

const StyledTextField = (props) => (
  <TextField
    variant="outlined"
    fullWidth
    {...props}
    InputProps={{
      ...props.InputProps,
      sx: {
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.3)'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.5)'
        },
        ...props.InputProps?.sx
      }
    }}
    sx={{
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)'
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: 'white'
      },
      ...props.sx
    }}
  />
);

const StyledIconButton = (props) => (
  <IconButton
    {...props}
    sx={{
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      p: 1,
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      ...props.sx
    }}
  />
);

const ServiceProviderCard = ({ provider, onDelete, onViewDetails }) => {
  return (
    <StyledCard>
      <Box sx={{ 
        height: 80, 
        background: 'linear-gradient(45deg, #1a237e 30%, #4a148c 90%)',
        position: 'relative'
      }}>
        <Avatar 
          src={provider.profile_pic} 
          alt={provider.name}
          sx={{ 
            width: 80, 
            height: 80, 
            border: '3px solid white',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: -40
          }}
        />
      </Box>
      <StyledCardContent sx={{ pt: 6, pb: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
          {provider.name}
        </Typography>
        
        <Chip 
          label={provider.serviceType || 'No Service Type'} 
          size="small"
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            color: 'white',
            mb: 2
          }}
        />
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
            <Email fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {provider.email}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
            <LocationOn fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {provider.address || 'No Location'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PermIdentity fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {provider.nic || 'No NIC'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: 0.5,
          mb: 2 
        }}>
          {provider.selectedLanguages?.map(lang => (
            <Chip
              key={lang}
              label={lang}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.7rem'
              }}
            />
          ))}
          {(!provider.selectedLanguages || provider.selectedLanguages.length === 0) && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              No languages specified
            </Typography>
          )}
        </Box>
        
        <Divider sx={{ 
          mb: 2, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)' 
        }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip title="View Details">
            <StyledIconButton 
              onClick={() => onViewDetails(provider)}
              size="small"
              sx={{ backgroundColor: 'rgba(25, 118, 210, 0.2)' }}
            >
              <Visibility fontSize="small" />
            </StyledIconButton>
          </Tooltip>
          
          <Tooltip title="Delete">
            <StyledIconButton 
              onClick={() => onDelete(provider)}
              size="small"
              sx={{ backgroundColor: 'rgba(211, 47, 47, 0.2)' }}
            >
              <Delete fontSize="small" />
            </StyledIconButton>
          </Tooltip>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

const Users = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid'); // 'grid' or 'table'
  const rowsPerPage = 9; // Adjusted for grid view

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/get-all-users`);
      const normalizedProviders = response.data.map(provider => ({
        ...provider,
        name: `${provider.firstName} ${provider.lastName}`|| '',
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

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setDetailsDialogOpen(true);
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

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #121212 0%, #000000 100%)',
      color: 'white',
      p: { xs: 2, md: 4 },
      position: 'relative'
    }}>
      {/* Decorative background elements */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        overflow: 'hidden',
        zIndex: 0
      }}>
        <Box sx={{ 
          position: 'absolute', 
          width: '500px', 
          height: '500px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0) 70%)',
          top: '-250px',
          right: '-250px'
        }} />
        <Box sx={{ 
          position: 'absolute', 
          width: '600px', 
          height: '600px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0) 70%)',
          bottom: '-300px',
          left: '-300px'
        }} />
      </Box>

      <Box sx={{ 
        maxWidth: 'xl', 
        mx: 'auto', 
        position: 'relative', 
        zIndex: 1
      }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'white',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Person sx={{ mr: 2, fontSize: 40 }} />
          Service Providers Management
        </Typography>

        {/* Search and Filter Controls */}
        <StyledGridContainer>
          <Grid item xs={12} md={4}>
            <StyledTextField
              placeholder="Search by name, email, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Filter by Service Type</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Service Types</MenuItem>
                {serviceTypes.map(type => (
                  <MenuItem key={type} value={type.toLowerCase()}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={generatePDF}
              sx={{
                backgroundColor: 'rgba(25, 118, 210, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 1)',
                },
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
              }}
            >
              {isMobile ? '' : 'Download Report'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchServiceProviders}
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 1)',
                },
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
              }}
            >
              {isMobile ? '' : 'Refresh'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={view === 'grid' ? <FilterList /> : <FilterList />}
              onClick={() => setView(view === 'grid' ? 'table' : 'grid')}
              sx={{
                backgroundColor: 'rgba(156, 39, 176, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(156, 39, 176, 1)',
                },
                borderRadius: 2,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
              }}
            >
              {isMobile ? '' : view === 'grid' ? 'Table View' : 'Grid View'}
            </Button>
          </Grid>
        </StyledGridContainer>

        {/* Stats Cards */}
        <StyledGridContainer>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ backgroundColor: 'rgba(25, 118, 210, 0.1)' }}>
              <StyledCardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {serviceProviders.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Total Providers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(25, 118, 210, 0.2)' }}>
                    <Person />
                  </Avatar>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
              <StyledCardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {serviceProviders.filter(sp => sp.availability === 'yes').length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Available Providers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)' }}>
                    <VerifiedUser />
                  </Avatar>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
              <StyledCardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {serviceTypes.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Service Categories
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.2)' }}>
                    <Badge />
                  </Avatar>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ backgroundColor: 'rgba(156, 39, 176, 0.1)' }}>
              <StyledCardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {serviceProviders.filter(sp => sp.availability === 'no').length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Unavailable Providers
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(156, 39, 176, 0.2)' }}>
                    <Block />
                  </Avatar>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        </StyledGridContainer>

        {/* Content */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px' 
          }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : error ? (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center', 
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: 2,
            border: '1px solid rgba(255, 0, 0, 0.3)'
          }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={fetchServiceProviders}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          <>
            {/* Grid or Table View */}
            {view === 'grid' ? (
              <StyledGridContainer>
                {paginatedProviders.length > 0 ? (
                  paginatedProviders.map((provider) => (
                    <Grid item xs={12} sm={6} md={4} key={provider._id}>
                      <ServiceProviderCard
                        provider={provider}
                        onDelete={handleDeleteClick}
                        onViewDetails={handleViewDetails}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      border: '1px dashed rgba(255, 255, 255, 0.2)'
                    }}>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                        No service providers found matching your search criteria.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSearchTerm('');
                          setFilter('all');
                        }}
                        sx={{ 
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          '&:hover': {
                            borderColor: 'white'
                          }
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Box>
                  </Grid>
                )}
              </StyledGridContainer>
            ) : (
              <StyledTableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Profile</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Service Type</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>NIC</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Languages</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
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
                            },
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <TableCell>
                            <Avatar 
                              src={provider.profile_pic} 
                              alt={provider.name}
                              sx={{ 
                                width: 40, 
                                height: 40,
                                border: '2px solid rgba(255, 255, 255, 0.2)'
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>{provider.name}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{provider.email}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{provider.address}</TableCell>
                          <TableCell>
                            <Chip 
                              label={provider.serviceType || 'N/A'} 
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                color: 'white' 
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>{provider.nic || 'N/A'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {provider.selectedLanguages?.map(lang => (
                                <Chip
                                  key={lang}
                                  label={lang}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                              {(!provider.selectedLanguages || provider.selectedLanguages.length === 0) && (
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  None
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex' }}>
                              <Tooltip title="View Details">
                                <StyledIconButton 
                                  onClick={() => handleViewDetails(provider)}
                                  size="small"
                                  sx={{ mr: 1, backgroundColor: 'rgba(25, 118, 210, 0.2)' }}
                                >
                                  <Visibility fontSize="small" />
                                </StyledIconButton>
                              </Tooltip>
                              
                              <Tooltip title="Delete">
                                <StyledIconButton 
                                  onClick={() => handleDeleteClick(provider)}
                                  size="small"
                                  sx={{ backgroundColor: 'rgba(211, 47, 47, 0.2)' }}
                                >
                                  <Delete fontSize="small" />
                                </StyledIconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ color: 'white', py: 4 }}>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                            No service providers found matching your search criteria.
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSearchTerm('');
                              setFilter('all');
                            }}
                            sx={{ 
                              color: 'white',
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              '&:hover': {
                                borderColor: 'white'
                              }
                            }}
                          >
                            Clear Filters
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}

            {/* Pagination */}
            {filteredProviders.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 3, 
                mb: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                p: 1
              }}>
                <Pagination
                  count={Math.ceil(filteredProviders.length / rowsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        fontWeight: 'bold'
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#1a1a1a',
              color: 'white',
              borderRadius: 2,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03))'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Delete sx={{ color: '#f44336', mr: 1 }} />
              Confirm Delete
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={providerToDelete?.profile_pic} 
                alt={providerToDelete?.name}
                sx={{ mr: 2, width: 50, height: 50 }}
              />
              <Box>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {providerToDelete?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {providerToDelete?.email}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ color: 'white', mt: 2 }}>
              Are you sure you want to delete this service provider? This action cannot be undone and will remove all associated data.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)} 
              startIcon={<Cancel />}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              startIcon={<Delete />}
              variant="contained"
              color="error"
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 1)'
                }
              }}
            >
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>

        {/* Provider Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              backgroundColor: '#1a1a1a',
              color: 'white',
              borderRadius: 2,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03))'
            }
          }}
        >
          {selectedProvider && (
            <>
              <DialogTitle sx={{ 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                pb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Info sx={{ color: '#2196f3', mr: 1 }} />
                  Provider Details
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                {/* Profile Header */}
                <Box sx={{ 
                  height: 120, 
                  background: 'linear-gradient(45deg, #1a237e 30%, #4a148c 90%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2,
                  pb: 6
                }}>
                  <Avatar 
                    src={selectedProvider.profile_pic} 
                    alt={selectedProvider.name}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      border: '4px solid white',
                      position: 'absolute',
                      left: 24,
                      bottom: -50,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Box sx={{ ml: 16 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {selectedProvider.name}
                    </Typography>
                    <Chip 
                      label={selectedProvider.serviceType || 'No Service Type'} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                        color: 'white',
                        mt: 0.5
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ p: 3, pt: 6 }}>
                  {/* Contact Info Section */}
                  <StyledGridContainer>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 'bold',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <ContactInfo sx={{ mr: 1 }} /> Contact Information
                      </Typography>
                      
                      <Box sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                        borderRadius: 2,
                        p: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Email sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Email
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                              {selectedProvider.email}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Phone sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Phone
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                              {selectedProvider.mobileNumber || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Location
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                              {selectedProvider.address || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 'bold',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <PermIdentity sx={{ mr: 1 }} /> Personal Information
                      </Typography>
                      
                      <Box sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                        borderRadius: 2,
                        p: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PermIdentity sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              NIC
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                              {selectedProvider.nic || 'Not provided'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Language sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Languages
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {selectedProvider.selectedLanguages?.map(lang => (
                                <Chip
                                  key={lang}
                                  label={lang}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              ))}
                              {(!selectedProvider.selectedLanguages || selectedProvider.selectedLanguages.length === 0) && (
                                <Typography variant="body2" sx={{ color: 'white' }}>
                                  None specified
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Availability
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                              {selectedProvider.availability === 'yes' ? 'Available' : 'Not Available'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </StyledGridContainer>
                  
                  {/* Service Details Section */}
                  <Typography variant="subtitle1" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 'bold',
                    mb: 2,
                    mt: 3,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Badge sx={{ mr: 1 }} /> Service Details
                  </Typography>
                  
                  <Box sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 2,
                    p: 2,
                    mb: 3
                  }}>
                    <StyledGridContainer>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Service Type
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                          {selectedProvider.serviceType || 'Not specified'}
                        </Typography>
                        
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Pay Rate (Rs/hr)
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white' }}>
                          {selectedProvider.payRate ? `${selectedProvider.payRate[0]} - ${selectedProvider.payRate[1]}` : 'Not specified'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Services Offered
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {selectedProvider.selectedServices?.map(service => (
                            <Chip
                              key={service}
                              label={service}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                          {(!selectedProvider.selectedServices || selectedProvider.selectedServices.length === 0) && (
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              None specified
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </StyledGridContainer>
                  </Box>
                  
                  {/* Specific Service Type Info */}
                  {selectedProvider.serviceType === 'PetCare' && selectedProvider.selectedPetTypes && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                        Pet Types:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedProvider.selectedPetTypes.map(pet => (
                          <Chip
                            key={pet}
                            label={pet}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {selectedProvider.serviceType === 'ChildCare' && selectedProvider.selectedAgeGroups && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                        Age Groups:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedProvider.selectedAgeGroups.map(age => (
                          <Chip
                            key={age}
                            label={age}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {selectedProvider.serviceType === 'Education' && (
                    <>
                      {selectedProvider.selectedSyllabi && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Syllabi:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selectedProvider.selectedSyllabi.map(syllabus => (
                              <Chip
                                key={syllabus}
                                label={syllabus}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: 'white'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {selectedProvider.selectedSubjects && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Subjects:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selectedProvider.selectedSubjects.map(subject => (
                              <Chip
                                key={subject}
                                label={subject}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: 'white'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {selectedProvider.selectedGrades && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            Grades:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selectedProvider.selectedGrades.map(grade => (
                              <Chip
                                key={grade}
                                label={grade}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: 'white'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                  
                  {/* About Section */}
                  <Typography variant="subtitle1" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Info sx={{ mr: 1 }} /> About
                  </Typography>
                  
                  <Box sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: 2,
                    p: 2
                  }}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {selectedProvider.about || 'No additional information provided.'}
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
                <Button 
                  onClick={() => handleDeleteClick(selectedProvider)} 
                  startIcon={<Delete />}
                  color="error"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.1)'
                    }
                  }}
                >
                  Delete Provider
                </Button>
                <Button 
                  onClick={() => setDetailsDialogOpen(false)} 
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            sx={{ 
              width: '100%',
              backgroundColor: snackbarSeverity === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(211, 47, 47, 0.9)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Users;
