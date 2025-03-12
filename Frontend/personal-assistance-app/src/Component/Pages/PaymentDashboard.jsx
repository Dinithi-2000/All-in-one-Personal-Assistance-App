import React from "react";
import "./../../Styles/paymentStyle.css"


import { CardStack } from "../UI/card-stack";
import VisaCard from "../UI/VisaCard";
import SideNavBar from "../UI/SideNavBar";


export default function PaymentDashboard() {
  const cards = [
    {
      id: 1,
      content: (
       
        <VisaCard 
        type="visa"
        cardName="Dini Gamage"
        cardNumber="xxxx xxxx xxxx xxxx"
        validDate="MM/DD"/>
      ),
    },
    {
      id: 2,
      content: (
        <VisaCard
          type="master"
          cardName="Sonali Gamage"
          cardNumber="XXXX XXXX XXXX XXXX"
          validDate="MM/DD"
        />
      ),
    },
  ];
  return (
    <div className="dashboard-container">
      <SideNavBar/>
      <div className="main-content">
        <div className="card-stack-container">
          <CardStack items={cards}/>
        </div>
      </div>
    </div>
  );
}
