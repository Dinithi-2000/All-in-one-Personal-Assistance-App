import { useState } from 'react';
import AppRoutes from './Routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to handle login
  const handleLogin = (username) => {
    setIsAuthenticated(true);
    // Hardcoded admin check
    setIsAdmin(username === "SerenniAdmin");
  };

  return (
    <div className="App">
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        isAdmin={isAdmin}
        handleLogin={handleLogin}
      />
    </div>
  );
}

export default App;