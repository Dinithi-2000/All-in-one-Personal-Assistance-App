import logo from './logo.svg';
import './App.css';
import PaymentDashboard from './Component/Pages/PaymentDashboard';

import AppRoutes from './Routes/AppRoutes';
import { useState } from 'react';
import NavBar from './Component/UI/NavBar';
import { BrowserRouter } from 'react-router-dom';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <BrowserRouter>
      <div className="App">
        <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </div>
    </BrowserRouter>
  );
}

export default App;
