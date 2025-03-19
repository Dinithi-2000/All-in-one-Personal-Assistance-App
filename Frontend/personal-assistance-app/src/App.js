import logo from './logo.svg';
import './App.css';
import PaymentDashboard from './Component/Pages/PaymentDashboard';
import PaymentMethod from './Component/UI/PaymentMethod';
import ServiceCatergoty from './Component/UI/ServiceCatergoty';
import MonthlyPayment from './Component/UI/MonthlyPayment';
import PaymentHistory from './Component/UI/PaymentHistory';

function App() {
  return (
    <div className="App">


      {/*<PaymentDashboard />*/}
      {/*<PaymentMethod />*/}
      {/*<MonthlyPayment />*/}
      <PaymentHistory />
    </div>
  );
}

export default App;
