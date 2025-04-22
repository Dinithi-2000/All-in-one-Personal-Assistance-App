import { useNavigate } from 'react-router-dom';

function HomePageApp() {
  const navigate = useNavigate();
  
  const styles = {
    app: {
      textAlign: 'center',
    },
    appHeader: {
      backgroundColor: '#FAF9F6', // Soft off-white
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: '#2F4F4F', // Dark green
      fontSize: '2.5rem',
      marginBottom: '2rem',
      padding: '0 20px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '20px',
      marginTop: '40px',
    },
    button: {
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '25px',
      fontSize: '1.2rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '300px',
    },
    serviceButton: {
      backgroundColor: '#40E0D0', // Turquoise blue
      color: 'white',
    },
    accountButton: {
      backgroundColor: '#FF7F50', // Coral
      color: 'white',
    }
  };

  const handleButtonHover = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    if (e.target.id === 'serviceButton') {
      e.target.style.backgroundColor = '#38CAB8';
    } else {
      e.target.style.backgroundColor = '#FF6B3B';
    }
  };

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
    if (e.target.id === 'serviceButton') {
      e.target.style.backgroundColor = '#40E0D0';
    } else {
      e.target.style.backgroundColor = '#FF7F50';
    }
  };
  
  return (
    <div style={styles.app}>
      <header style={styles.appHeader}>
        <h1 style={styles.title}>All In One Personal Assistance Application</h1>
        <div style={styles.buttonContainer}>
          <button 
            id="serviceButton"
            style={{...styles.button, ...styles.serviceButton}}
            onClick={() => navigate('/spdashboard')}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Service Dashboard
          </button>
          <button 
            id="accountButton"
            style={{...styles.button, ...styles.accountButton}}
            onClick={() => navigate('/serviceselection')}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Create Account
          </button>
        </div>
      </header>
    </div>
  );
}

export default HomePageApp;