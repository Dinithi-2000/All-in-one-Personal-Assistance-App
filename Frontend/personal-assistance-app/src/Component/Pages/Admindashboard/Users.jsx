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
  Box,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
  Avatar,
  TextField
} from '@mui/material';
import {
  Delete,
  Search,
  Refresh,
  Download,
  Cancel,
  Person
} from '@mui/icons-material';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = 'http://localhost:8070';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/get-all-users`);
      
      // Check if response is an array
      const userData = Array.isArray(response.data) ? response.data : [];
      
      const normalizedUsers = userData.map(user => ({
        ...user,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        // Ensure phone number is available from either mobile or phone field
        phone: user.mobile || user.phone || null
      }));
      
      setUsers(normalizedUsers);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      showSnackbar('Failed to fetch users', 'error');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Send delete request to backend
      await axios.delete(`${API_BASE_URL}/admin/delete-user/${userToDelete._id}`);
      
      // Update UI by removing the deleted user
      setUsers(users.filter(user => user._id !== userToDelete._id));
      showSnackbar('User deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar('Failed to delete user', 'error');
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

  const filteredUsers = users.filter(user => {
    const searchString = searchTerm.toLowerCase();
    return (user.name?.toLowerCase().includes(searchString) ||
           user.email?.toLowerCase().includes(searchString) ||
           user.mobile?.toLowerCase().includes(searchString) ||
           user.nic?.toLowerCase().includes(searchString));
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('Users Report', 14, yPosition);
    
    // Date and Total Users
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, yPosition + 10);
    doc.text(`Total Users: ${filteredUsers.length}`, 14, yPosition + 20);
    yPosition += 30;

    // Horizontal line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 102, 204);
    doc.line(14, yPosition, 196, yPosition);
    yPosition += 10;

    // Prepare table data from filteredUsers
    const tableData = filteredUsers.map(user => [
      user.name,
      user.email,
      user.mobile || user.phone || 'N/A',
      user.nic || 'N/A'
    ]);

    // Define columns
    const tableColumns = [
      'Name',
      'Email',
      'Phone Number',
      'NIC'
    ];

    // Generate table
    autoTable(doc, {
      startY: yPosition,
      head: [tableColumns],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { left: 14, right: 14 },
      styles: {
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: 200
      }
    });

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }

    doc.save('users-report.pdf');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a237e 0%, #121212 100%)',
      color: 'white',
      p: { xs: 2, md: 4 }
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'white',
            mb: 4,
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          User Management
        </Typography>
        
        {/* Search and actions bar */}
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%'
        }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={9} md={10} lg={10}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users..."
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
            <Grid item xs="auto" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: 'auto', 
              justifyContent: 'flex-end',
              flexShrink: 0
            }}>
              <Tooltip title="Download PDF">
                <IconButton onClick={generatePDF} sx={{ 
                  color: 'white', 
                  mr: 1,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}>
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchUsers} sx={{ 
                  color: 'white',
                  mr: 1,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              
              {/* Total Users Badge */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                py: 0.75,
                px: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(0, 91, 187, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <Person sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 0.75, fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {users.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Users table */}
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
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(0, 91, 187, 0.3)' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Profile</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone Number</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>NIC</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow 
                        key={user._id} 
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(255, 255, 255, 0.05)' 
                          },
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <TableCell>
                          <Avatar 
                            src={user.profile_pic} 
                            alt={user.name}
                            sx={{ 
                              width: 40, 
                              height: 40,
                              border: '2px solid rgba(255, 255, 255, 0.2)'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{user.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{user.mobile || user.phone || 'N/A'}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{user.nic || 'N/A'}</TableCell>
                        <TableCell>
                          <Tooltip title="Delete">
                            <IconButton 
                              onClick={() => handleDeleteClick(user)} 
                              sx={{ 
                                color: '#ff5252',
                                '&:hover': { 
                                  backgroundColor: 'rgba(255, 82, 82, 0.1)' 
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ color: 'white', py: 4 }}>
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredUsers.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'white'
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2) !important'
                  }
                }}
              />
            </Box>
          </>
        )}

        {/* Delete confirmation dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: '#1a1a1a',
              color: 'white',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography sx={{ color: 'white' }}>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)} 
              startIcon={<Cancel />}
              sx={{ 
                color: 'white',
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained"
              color="error"
              startIcon={<Delete />}
              sx={{ borderRadius: 2 }}
            >
              Delete
            </Button>
          </DialogActions>
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
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Users;