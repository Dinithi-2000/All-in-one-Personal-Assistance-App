import React from "react";
import "./../../Styles/Paymentcard.css";

export default function VisaCard({ type, cardName, cardNumber, validDate }) {
  return (
    <div className="container">
      <header>
        <span className="logo">
          <img
            src={type === "visa" ? "/Images/visa.png" : "/Images/master.png"}
            alt={type}
          />
          <h5>{type}</h5>
        </span>
        <img src="/Images/chip1.png" alt=" chip" className="chip" />
      </header>

      <div className="card-details">
        <div className="name-number">
          <h6>Card Number</h6>
          <h5 className="number">{cardNumber}</h5>
          <h5 className="name">{cardName}</h5>
        </div>
        <div className="valid-date">
          <h6>Valid Thru</h6>
          <h5>{validDate}</h5>
        </div>
      </div>
    </div>
  );
}
