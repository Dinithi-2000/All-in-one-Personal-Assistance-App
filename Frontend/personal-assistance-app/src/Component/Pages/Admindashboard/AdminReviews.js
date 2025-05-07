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
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8070';

const getToken = () => localStorage.getItem('authToken');

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid API response: expected an array of reviews');
      }
      const normalizedReviews = response.data.map(review => ({
        ...review,
        customerName: review.customerID?.name || 'Unknown Customer',
        providerName: review.providerID?.name || 'Unknown Provider',
        reviewText: review.review || '',
        starRate: review.starRate || 0,
        createdAt: review.createdAt || '',
        _id: review._id || '',
      }));
      setReviews(normalizedReviews);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      Swal.fire({
        title: 'Deleting Review...',
        text: 'Please wait while we delete the review',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await axios.delete(`${API_BASE_URL}/api/admin/review/delete/${reviewToDelete._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.status === 200) {
        setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Review has been deleted successfully',
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
        text: err.response?.data?.message || 'Failed to delete review',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF7F50',
      });
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
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

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (review.customerName || '').toLowerCase().includes(searchLower) ||
      (review.providerName || '').toLowerCase().includes(searchLower) ||
      (review.reviewText || '').toLowerCase().includes(searchLower);
    
    const matchesRatingFilter = ratingFilter === 'all' || 
      review.starRate.toString() === ratingFilter;
    
    return matchesSearch && matchesRatingFilter;
  });

  const paginatedReviews = filteredReviews.slice(
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
      doc.text('Reviews Report', 14, yPosition);
      yPosition += 10;

      if (searchTerm || ratingFilter !== 'all') {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        let filterText = '';
        if (searchTerm) filterText += `Search: "${searchTerm}" (Customer, Provider, Review)`;
        if (ratingFilter !== 'all') {
          if (filterText) filterText += ', ';
          filterText += `Rating: ${ratingFilter} Star${ratingFilter === '1' ? '' : 's'}`;
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

      if (filteredReviews.length === 0) {
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text('No reviews match your search criteria', 14, yPosition);
        doc.save('reviews-report.pdf');
        showSnackbar('PDF generated with no results (based on current search)', 'info');
        return;
      }

      const tableData = filteredReviews.map(review => [
        review.customerName,
        review.providerName,
        review.starRate,
        review.reviewText,
        new Date(review.createdAt).toLocaleDateString(),
      ]);

      const tableColumns = [
        'Customer',
        'Provider',
        'Rating',
        'Review',
        'Date',
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
          0: { cellWidth: 30 }, // Customer
          1: { cellWidth: 30 }, // Provider
          2: { cellWidth: 20 }, // Rating
          3: { cellWidth: 70 }, // Review
          4: { cellWidth: 30 }, // Date
        }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
      }

      doc.save('reviews-report.pdf');
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
          Reviews Management
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
                placeholder="Search reviews..."
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
                <InputLabel sx={{ color: '#94a3b8' }}>Filter by Rating</InputLabel>
                <Select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
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
                  <MenuItem value="all">All Ratings</MenuItem>
                  <MenuItem value="5">5 Stars</MenuItem>
                  <MenuItem value="4">4 Stars</MenuItem>
                  <MenuItem value="3">3 Stars</MenuItem>
                  <MenuItem value="2">2 Stars</MenuItem>
                  <MenuItem value="1">1 Star</MenuItem>
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
                }} onClick={fetchReviews}>
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
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '15%' }}>Customer</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '15%' }}>Provider</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '10%' }}>Rating</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '40%' }}>Review</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '10%' }}>Date</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 3, width: '10%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReviews.length > 0 ? (
                    paginatedReviews.map((review) => (
                      <TableRow
                        key={review._id}
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
                        <TableCell sx={{ color: '#e2e8f0', width: '15%' }}>{review.customerName}</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '15%' }}>{review.providerName}</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '10%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                sx={{
                                  color: i < review.starRate ? '#facc15' : '#94a3b8',
                                  fontSize: 16,
                                  mr: 0.5
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '40%' }}>{review.reviewText}</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', width: '10%' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ width: '10%' }}>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteClick(review)}
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
                        No reviews found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredReviews.length / rowsPerPage)}
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
              Are you sure you want to delete the review by {reviewToDelete?.customerName} for {reviewToDelete?.providerName}? This action cannot be undone.
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

export default AdminReviews;