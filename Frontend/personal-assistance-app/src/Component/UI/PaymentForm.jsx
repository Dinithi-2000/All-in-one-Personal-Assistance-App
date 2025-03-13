import React, { useState } from "react";
import VisaCard from "./VisaCard";
import usePaymentFormValidation from "../Hooks/CustomHook/usePaymentFormValidation";

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

  //form validaion custom hook
  const { error, formValidation, clearForm } = usePaymentFormValidation();

  //card number format
  const cardNumberFormat = (cardNumber) => {
    //remove space
    const nonSpaceValue = cardNumber.replace(/\D/g, "");
    // add space
    return nonSpaceValue.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  //handling function
  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setCardCredentials({
      ...cardCredentials,
      [name]: value,
    });
    clearForm(name);
  };

  /* const paymenntSubmit = (event) => {
    event.preventDefault();

    //check validation
    const checkValidation = formValidation({
      cardCredentials: cardCredentials,
      paymentType: selectedType,
    });
    if (Object.keys(checkValidation).length > 0) {
      console.log("Form submitted error:", checkValidation);
      return;
    }
    console.log("Form submitted successfully:", cardCredentials);
  };
*/
  const paymenntSubmit = (event) => {
    event.preventDefault();

    // Check validation
    const validationErrors = formValidation({
      cardCredentials: cardCredentials,
      paymentType: selectedType,
    });

    // If there are validation errors, stop submission
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation errors:", validationErrors); // Optional: Log errors for debugging
      return;
    }

    // If no validation errors, proceed with form submission
    console.log("Form submitted successfully:", cardCredentials);
    // Add your form submission logic here (e.g., API call)
  };
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
              <div>
                <input
                  type="text"
                  name="cardHolderName"
                  value={cardCredentials.cardHolderName}
                  onChange={handleInputChange}
                  placeholder="Cardholder Name"
                  className="w-full p-2 border rounded mt-2"
                />
                {error.cardHolderName && (
                  <p className="text-red-500 text-sm">{error.cardHolderName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardNumberFormat(cardCredentials.cardNumber)}
                  onChange={handleInputChange}
                  placeholder="Card Number"
                  className="w-full p-2 border rounded mt-2"
                />
                {error.cardNumber && (
                  <p className="text-red-500 text-sm">{error.cardNumber}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardCredentials.expiryDate}
                  onChange={handleInputChange}
                  placeholder="Expiry Date"
                  className="w-full p-2 border rounded mt-2"
                />
                {error.expiryDate && (
                  <p className="text-red-500 text-sm">{error.expiryDate}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="cvv"
                  value={cardCredentials.cvv}
                  onChange={handleInputChange}
                  placeholder="CVV"
                  className="w-full p-2 border rounded mt-2"
                />
                {error.cvv && (
                  <p className="text-red-500 text-sm">{error.cvv}</p>
                )}
              </div>
            </div>
          </>
        ) : selectedType === "payhere" ? (
          <div>
            <input
              type="email"
              name="payhereEmail"
              value={cardCredentials.payhereEmail}
              onChange={handleInputChange}
              placeholder="PayHere Email"
              className="w-full p-2 border rounded mt-2"
            />
            {error.payhereEmail && (
              <p className="text-red-500 text-sm">{error.payhereEmail}</p>
            )}
          </div>
        ) : selectedType === "onlineTransfer" ? (
          <div className="space-y-3">
            <div>
              <input
                type="text"
                name="bankName"
                value={cardCredentials.bankName}
                onChange={handleInputChange}
                placeholder="Bank Name"
                className="w-full p-2 border rounded mt-2"
              />
              {error.bankName && (
                <p className="text-red-500 text-sm">{error.bankName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="branch"
                value={cardCredentials.branch}
                onChange={handleInputChange}
                placeholder="Branch"
                className="w-full p-2 border rounded mt-2"
              />
              {error.branch && (
                <p className="text-red-500 text-sm">{error.branch}</p>
              )}
            </div>

            <div>
              <input
                type="file"
                name="transactionPdf"
                onChange={() => {}}
                className="w-full p-2 border rounded mt-2"
                accept=".pdf"
              />
              {error.transactionPdf && (
                <p className="text-red-500 text-sm">{error.transactionPdf}</p>
              )}
            </div>
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
