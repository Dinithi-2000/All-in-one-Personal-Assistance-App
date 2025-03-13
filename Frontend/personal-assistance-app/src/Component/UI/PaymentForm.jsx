import React, { useState } from "react";
import VisaCard from "./VisaCard";

export default function PaymentForm({ selectedType }) {
  const [cardCredentials, setCardCredentials] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    payhereEmail: "",
    bankName: "",
    branch: "",
    transactionPdf: "",
  });
  const [saveCard, setSaveCard] = useState(false);

  //handling function
  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setCardCredentials({
      ...cardCredentials,
      [name]: value,
    });
  };

  const paymenntSubmit = (event) => {};

  return (
    <div className="w-full md:w-2/3 p-4">
      <form onSubmit={paymenntSubmit}>
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        {selectedType === "visa" || selectedType === "mastercard" ? (
          <>
            <VisaCard
              type={selectedType}
              cardName={cardCredentials.cardHolderName}
              cardNumber={cardCredentials.cardNumber}
              validDate={cardCredentials.expiryDate}
            />

            <div className="space-y-3">
              <input
                type="text"
                name="cardHolderName"
                value={cardCredentials.cardHolderName}
                onChange={handleInputChange}
                placeholder="Cardholder Name"
                className="w-full p-2 border rounded mt-2"
              />
              <input
                type="text"
                name="cardNumber"
                value={cardCredentials.cardNumber}
                onChange={handleInputChange}
                placeholder="Card Number"
                className="w-full p-2 border rounded mt-2"
              />
              <input
                type="text"
                name="expiryDate"
                value={cardCredentials.expiryDate}
                onChange={handleInputChange}
                placeholder="Expiry Date"
                className="w-full p-2 border rounded mt-2"
              />
              <input
                type="text"
                name="cvv"
                value={cardCredentials.cvv}
                onChange={handleInputChange}
                placeholder="CVV"
                className="w-full p-2 border rounded mt-2"
              />
            </div>
          </>
        ) : selectedType === "payhere" ? (
          <input
            type="email"
            name="payhereEmail"
            value={cardCredentials.payhereEmail}
            onChange={handleInputChange}
            placeholder="PayHere Email"
            className="w-full p-2 border rounded mt-2"
          />
        ) : selectedType === "onlineTransfer" ? (
          <div className="space-y-3">
            <input
              type="text"
              name="bankName"
              value={cardCredentials.bankName}
              onChange={handleInputChange}
              placeholder="Bank Name"
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="text"
              name="branch"
              value={cardCredentials.branch}
              onChange={handleInputChange}
              placeholder="Branch"
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="file"
              name="transactionPdf"
              onChange={() => {}}
              className="w-full p-2 border rounded mt-2"
            />
          </div>
        ) : null}

        <div className="mt-4">
          <input
            type="checkbox"
            id="saveCard"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="saveCard">
            Save card details for future payments
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
