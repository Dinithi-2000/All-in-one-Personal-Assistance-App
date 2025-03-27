import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Person,
  MonetizationOn,
  Edit,
  Dashboard,
  Assignment,
  Group,
  Support,
  Description,
  Notifications,
  Settings,
  AccountCircle,
  Search
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Constants for consistent styling
const COLORS = {
  primary: '#001F3F',
  secondary: '#40E0D0',
  accent: '#FF7F50',
  warning: '#FFD700'
};

// Helper function to convert hex to rgb (moved outside component)
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
};

const DashboardMetrics = ({ metrics }) => (
  <Grid container spacing={3}>
    {metrics.map((metric, index) => (
      <Grid item xs={12} md={4} key={index}>
        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,31,63,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.primary }}>
            {metric.title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 2, color: metric.color }}>
            {metric.value}
          </Typography>
          <Typography variant="body2" sx={{ color: '#888' }}>
            {metric.subtext}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

const ProfileSection = ({ profileData, navigate }) => (
  <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,31,63,0.1)' }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.primary }}>
      Profile Overview
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <Avatar 
        src={profileData.profilePhoto} 
        alt={`${profileData.name}'s profile`}
        sx={{ width: 60, height: 60, mr: 2 }}
      />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.primary }}>
          {profileData.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          {profileData.serviceType} | 📍 {profileData.location}
        </Typography>
      </Box>
    </Box>
    <Button
      variant="contained"
      startIcon={<Edit />}
      sx={{ 
        mt: 2, 
        backgroundColor: COLORS.secondary, 
        color: 'white',
        '&:hover': { backgroundColor: '#38CAB8' } 
      }}
      onClick={() => navigate('/editspprofile')}
    >
      Edit Profile
    </Button>
  </Paper>
);

const ReportsSection = ({ 
  searchTerm, 
  setSearchTerm, 
  generateReport, 
  filteredBookings, 
  reportData 
}) => (
  <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,31,63,0.1)' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.primary }}>
        Reports
      </Typography>
      <Button
        variant="contained"
        startIcon={<Description />}
        sx={{ 
          backgroundColor: COLORS.secondary, 
          color: 'white',
          '&:hover': { backgroundColor: '#38CAB8' } 
        }}
        onClick={generateReport}
      >
        Download Full Report
      </Button>
    </Box>

    <TextField
      fullWidth
      variant="outlined"
      label="Search bookings"
      placeholder="Search by client, date, or status"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
      }}
      sx={{ mb: 3 }}
    />

    <RecentBookings bookings={filteredBookings} />
    <MonthlyEarnings earnings={reportData.monthlyEarnings} />
    <ClientDemographics demographics={reportData.clientDemographics} />
  </Paper>
);

const RecentBookings = ({ bookings }) => (
  <>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
      Recent Bookings
    </Typography>
    <Paper sx={{ mb: 3 }}>
      <List>
        {bookings.map((booking) => (
          <ListItem key={booking.id} divider>
            <ListItemText
              primary={booking.client}
              secondary={`${booking.date} • ${booking.duration}`}
            />
            <Chip
              label={booking.status}
              color={booking.status === 'Completed' ? 'success' : 'primary'}
              variant="outlined"
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  </>
);

const MonthlyEarnings = ({ earnings }) => (
  <>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
      Monthly Earnings
    </Typography>
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        {earnings.map((month) => (
          <Grid item xs={6} sm={4} md={2} key={month.month}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2">{month.month}</Typography>
              <Typography variant="body2" color="primary">
                Rs. {month.earnings.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </>
);

const ClientDemographics = ({ demographics }) => (
  <>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
      Client Demographics
    </Typography>
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {demographics.map((demo) => (
          <Grid item xs={6} sm={3} key={demo.category}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">{demo.category}</Typography>
              <Typography variant="h6">{demo.percentage}%</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </>
);

const SidebarNavigation = ({ activeSection, setActiveSection, navigate }) => (
  <Paper sx={{ p: 2, borderRadius: 3, backgroundColor: '#FFFFFF', boxShadow: '0 8px 32px rgba(0,31,63,0.1)' }}>
    <List>
      {[
        { icon: <Dashboard />, text: 'Dashboard', section: 'dashboard' },
        { icon: <Assignment />, text: 'Bookings' },
        { icon: <Group />, text: 'Clients' },
        { icon: <Support />, text: 'Payments' },
        { icon: <Description />, text: 'Reports', section: 'reports' },
        { icon: <Settings />, text: 'Reviews & Ratings' },
        { icon: <Notifications />, text: 'Notifications' }
      ].map((item, index) => (
        <ListItem 
          button 
          key={index}
          onClick={() => item.section && setActiveSection(item.section)}
          selected={activeSection === item.section}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock data
  const profileData = {
    name: 'John Doe',
    serviceType: 'Elder Care',
    location: 'Colombo',
    earnings: 15000,
    bookings: 5,
    rating: 4.5,
    profilePhoto: 'https://via.placeholder.com/150',
  };

  const reportData = {
    monthlyEarnings: [
      { month: 'Jan', earnings: 12000 },
      { month: 'Feb', earnings: 15000 },
      { month: 'Mar', earnings: 18000 },
      { month: 'Apr', earnings: 14000 },
      { month: 'May', earnings: 16000 },
      { month: 'Jun', earnings: 19000 },
    ],
    clientDemographics: [
      { category: 'Age 60-70', percentage: 45 },
      { category: 'Age 71-80', percentage: 30 },
      { category: 'Age 81-90', percentage: 20 },
      { category: 'Age 90+', percentage: 5 },
    ],
    recentBookings: [
      { id: 1, client: 'Alice Smith', date: '2023-06-15', duration: '4 hours', status: 'Completed' },
      { id: 2, client: 'Bob Johnson', date: '2023-06-18', duration: '2 hours', status: 'Completed' },
      { id: 3, client: 'Carol Williams', date: '2023-06-20', duration: '3 hours', status: 'Upcoming' },
    ],
  };

  const filteredBookings = useMemo(() => {
    return reportData.recentBookings.filter(booking =>
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.date.includes(searchTerm) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, reportData.recentBookings]);

  const metrics = [
    { title: 'Revenue', value: `Rs. ${profileData.earnings}`, subtext: 'Total Earnings', color: COLORS.secondary },
    { title: 'New Clients', value: '13', subtext: 'This Month', color: COLORS.accent },
    { title: 'Average Order', value: 'Rs. 789.17', subtext: 'This Month', color: COLORS.warning }
  ];

  const generateReport = () => {
    try {
      console.log('Generating report...'); // Debug log
      
      const doc = new jsPDF();
      
      // Report title
      doc.setFontSize(18);
      doc.setTextColor(COLORS.primary);
      doc.text('Service Provider Performance Report', 105, 20, { align: 'center' });

      // Service provider info
      doc.setFontSize(12);
      doc.text(`Generated for: ${profileData.name}`, 14, 30);
      doc.text(`Service Type: ${profileData.serviceType}`, 14, 37);
      doc.text(`Location: ${profileData.location}`, 14, 44);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 51);

      // Line separator
      doc.setDrawColor(64, 224, 208);
      doc.setLineWidth(0.5);
      doc.line(14, 56, 196, 56);

      // Performance summary
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary);
      doc.text('Performance Summary', 14, 66);

      doc.autoTable({
        startY: 70,
        head: [['Metric', 'Value']],
        body: [
          ['Total Earnings', `Rs. ${profileData.earnings.toLocaleString()}`],
          ['Completed Bookings', profileData.bookings],
          ['Average Rating', profileData.rating],
          ['New Clients This Month', '13'],
          ['Average Order Value', 'Rs. 789.17'],
        ],
        theme: 'grid',
        headStyles: { fillColor: hexToRgb(COLORS.primary), textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      // Check for page break before adding new section
      if (doc.autoTable.previous.finalY + 50 > doc.internal.pageSize.height) {
        doc.addPage();
      }

      // Monthly earnings
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary);
      doc.text('Monthly Earnings', 14, doc.autoTable.previous.finalY + 20);

      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 25,
        head: [['Month', 'Earnings (Rs.)']],
        body: reportData.monthlyEarnings.map(item => [item.month, item.earnings.toLocaleString()]),
        theme: 'grid',
        headStyles: { fillColor: hexToRgb(COLORS.primary), textColor: 255 },
      });

      // Check for page break
      if (doc.autoTable.previous.finalY + 50 > doc.internal.pageSize.height) {
        doc.addPage();
      }

      // Client demographics
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary);
      doc.text('Client Demographics', 14, doc.autoTable.previous.finalY + 20);

      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 25,
        head: [['Age Group', 'Percentage']],
        body: reportData.clientDemographics.map(item => [item.category, `${item.percentage}%`]),
        theme: 'grid',
        headStyles: { fillColor: hexToRgb(COLORS.primary), textColor: 255 },
      });

      // Check for page break
      if (doc.autoTable.previous.finalY + 50 > doc.internal.pageSize.height) {
        doc.addPage();
      }

      // Recent bookings
      doc.setFontSize(14);
      doc.setTextColor(COLORS.primary);
      doc.text('Recent Bookings', 14, doc.autoTable.previous.finalY + 20);

      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 25,
        head: [['Client', 'Date', 'Duration', 'Status']],
        body: reportData.recentBookings.map(item => [item.client, item.date, item.duration, item.status]),
        theme: 'grid',
        headStyles: { fillColor: hexToRgb(COLORS.primary), textColor: 255 },
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('© 2023 ElderCare Services. All rights reserved.', 105, 285, { align: 'center' });

      // Save the PDF
      doc.save(`ServiceProviderReport_${profileData.name.replace(' ', '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
      console.log('Report generated successfully'); // Debug log
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please check console for details.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Dashboard Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.primary }}>
          Service Provider Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            variant="outlined"
            label="Search"
            placeholder="Search..."
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
          <IconButton 
            color="primary" 
            onClick={() => navigate('/profile')}
            aria-label="User profile"
          >
            <Badge color="error">
              <AccountCircle sx={{ fontSize: 32 }} />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <SidebarNavigation 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            navigate={navigate}
          />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {activeSection === 'dashboard' ? (
            <>
              <DashboardMetrics metrics={metrics} />
              <Box sx={{ mt: 3 }}>
                <ProfileSection profileData={profileData} navigate={navigate} />
              </Box>
            </>
          ) : (
            <ReportsSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              generateReport={generateReport}
              filteredBookings={filteredBookings}
              reportData={reportData}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServiceProviderDashboard;