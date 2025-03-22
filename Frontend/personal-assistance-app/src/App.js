import logo from './logo.svg';
import './App.css';
import PaymentDashboard from './Component/Pages/PaymentDashboard';

import AppRoutes from './Routes/AppRoutes';
import { useState } from 'react';
import NavBar from './Component/UI/NavBar';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <div className="App">

      {/*<AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />*/}
      <NavBar />
    </div>
  );
}

export default App;
