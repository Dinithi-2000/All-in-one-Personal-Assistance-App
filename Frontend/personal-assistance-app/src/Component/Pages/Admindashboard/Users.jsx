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
  Delete,
  Cancel,
  Search,
  Refresh,
  Download
} from '@mui/icons-material';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8070';

// Retrieve token from localStorage (adjust based on your token storage)
const getToken = () => localStorage.getItem('token');

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/get-all-users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid API response: expected an array of users');
      }
      const normalizedUsers = response.data.map(user => ({
        ...user,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
        email: user.email || '',
        phone: user.mobile || '',
        nic: user.nic || '',
        status: user.status || 'active',
        _id: user._id || '',
        profile_pic: user.profile_pic || '',
      }));
      setUsers(normalizedUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err.response ? err.response.data : err.message);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      Swal.fire({
        title: 'Deleting User...',
        text: 'Please wait while we delete the user',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await axios.delete(`${API_BASE_URL}/delete-user/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        setUsers(users.filter(u => u._id !== userToDelete._id));
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#40E0D0',
        });
      } else {
        throw new Error(response.data.message || 'Unexpected response');
      }
    } catch (err) {
      console.error('Delete error:', err.response ? err.response.data : err.message);
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to delete user',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF7F50',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
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
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.phone || '').toLowerCase().includes(searchLower) ||
      (user.nic || '').toLowerCase().includes(searchLower) ||
      (searchLower === 'active' && user.status === 'active') ||
      (searchLower === 'inactive' && user.status === 'inactive');
    
    const matchesStatusFilter = statusFilter === 'all' || 
      (statusFilter === 'active' && user.status === 'active') ||
      (statusFilter === 'inactive' && user.status === 'inactive');
    
    return matchesSearch && matchesStatusFilter;
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text('Users Report', 14, yPosition);
      yPosition += 10;

      if (searchTerm || statusFilter !== 'all') {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        let filterText = '';
        if (searchTerm) filterText += `Search: "${searchTerm}" (Name, Email, Phone, NIC)`;
        if (statusFilter !== 'all') {
          if (filterText) filterText += ', ';
          filterText += `Status: ${statusFilter === 'active' ? 'Active' : 'Inactive'}`;
        }
        const splitText = doc.splitTextToSize(filterText, 170);
        doc.text(splitText, 14, yPosition);
        yPosition += splitText.length * 5;
      }

      const date = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated on: ${date}`, 14, yPosition);
      yPosition += 10;

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 102, 204);
      doc.line(14, yPosition, 196, yPosition);
      yPosition += 10;

      if (filteredUsers.length === 0) {
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text('No users match your search criteria', 14, yPosition);
        doc.save('users-report.pdf');
        showSnackbar('PDF generated with no results (based on current search)', 'info');
        return;
      }

      const tableData = filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.nic,
      ]);

      const tableColumns = [
        'Name',
        'Email',
        'Phone Number',
        'NIC',
      ];

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
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Name
          1: { cellWidth: 50 }, // Email
          2: { cellWidth: 40 }, // Phone
          3: { cellWidth: 40 }, // NIC
        }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
      }

      doc.save('users-report.pdf');
      showSnackbar('PDF report generated successfully (based on current search)', 'success');
    } catch (err) {
      showSnackbar('Failed to generate PDF report', 'error');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#e2e8f0',
      p: 4,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <Box sx={{ maxWidth: '90rem', mx: 'auto', py: 6 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#f8fafc',
            mb: 6,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            background: 'linear-gradient(90deg, #60a5fa, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.025em',
            fontSize: '2.25rem',
            lineHeight: '2.5rem',
            position: 'relative',
            zIndex: 1,
            display: 'block',
          }}
        >
          Users Management
        </Typography>

        <Paper sx={{
          p: 3,
          mb: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          zIndex: 0,
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: '#94a3b8', mr: 1 }} />
                  ),
                  sx: {
                    color: '#e2e8f0',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '0.75rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#94a3b8',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    color: '#e2e8f0',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '0.75rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#94a3b8',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Download PDF (based on current search)">
                <IconButton sx={{
                  color: '#60a5fa',
                  background: 'rgba(255, 255, 255, 0.05)',
                  mr: 1,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)',
                    transition: 'all 0.3s ease',
                  }
                }} onClick={generatePDF}>
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton sx={{
                  color: '#60a5fa',
                  background: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.05)',
                    transition: 'all 0.3s ease',
                  }
                }} onClick={fetchUsers}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress sx={{ color: '#60a5fa' }} />
          </Box>
        ) : error ? (
          <Typography sx={{ color: '#f87171', textAlign: 'center', mt: 4 }}>{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead sx={{
                  background: 'rgba(255, 255, 255, 0.03)',
                }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '8%' }}>Profile</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '15%' }}>Name</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '20%' }}>Email</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '15%' }}>Phone Number</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '15%' }}>NIC</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '12%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.08)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                          },
                        }}
                      >
                        <TableCell sx={{ width: '8%' }}>
                          <Avatar
                            src={user.profile_pic}
                            alt={user.name}
                            sx={{
                              width: 40,
                              height: 40,
                              border: '2px solid rgba(255, 255, 255, 0.1)',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '15%' }}>{user.name}</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '20%' }}>{user.email}</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '15%' }}>{user.phone}</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '15%' }}>{user.nic}</TableCell>
                        <TableCell sx={{ width: '12%' }}>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteClick(user)}
                              sx={{
                                color: '#ef4444',
                                '&:hover': {
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  transform: 'scale(1.1)',
                                  transition: 'all 0.3s ease',
                                },
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
                      <TableCell colSpan={6} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredUsers.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#94a3b8',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.5rem',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                  '& .Mui-selected': {
                    background: '#3b82f6',
                    color: '#ffffff',
                    '&:hover': {
                      background: '#2563eb',
                    },
                  },
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
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(8px)',
              color: '#e2e8f0',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#e2e8f0' }}>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              startIcon={<Cancel />}
              sx={{
                color: '#94a3b8',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              startIcon={<Delete />}
              sx={{
                color: '#ef4444',
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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
              background: snackbarSeverity === 'success'
                ? 'rgba(34, 197, 94, 0.9)'
                : 'rgba(239, 68, 68, 0.9)',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
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