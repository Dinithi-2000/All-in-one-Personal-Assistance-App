import logo from './logo.svg';
import './App.css';
import PaymentDashboard from './Component/Pages/PaymentDashboard';
import PaymentMethod from './Component/UI/PaymentMethod';
import ServiceCatergoty from './Component/UI/ServiceCatergoty';
import MonthlyPayment from './Component/UI/MonthlyPayment';

function App() {
  return (
    <div className="App">


      {/*<PaymentDashboard />*/}
      {/*<PaymentMethod />*/}
      <MonthlyPayment />
    </div>
  );
}

export default App;
