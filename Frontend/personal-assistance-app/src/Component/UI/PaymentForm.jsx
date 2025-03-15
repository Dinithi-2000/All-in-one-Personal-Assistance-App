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
    <div className=" w-full px-4 pl-2 justify-items-center">
      <form onSubmit={paymenntSubmit}>
        <h2 className="text-lg font-semibold mb-4 text-violet-950">
          Payment Details
        </h2>
        {selectedType === "visa" || selectedType === "mastercard" ? (
          <>
            <div className="mb-6">
              <VisaCard
                className="min-h-[200px] w-full"
                type={selectedType}
                cardName={cardCredentials.cardHolderName}
                cardNumber={cardCredentials.cardNumber}
                validDate={cardCredentials.expiryDate}
              />
            </div>

            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  name="cardHolderName"
                  value={cardCredentials.cardHolderName}
                  onChange={handleInputChange}
                  placeholder="Cardholder Name"
                  className="w-full py-2 px-4 border rounded"
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
                  className="w-full py-2 px-4 border rounded "
                />
                {error.cardNumber && (
                  <p className="text-red-500 text-sm">{error.cardNumber}</p>
                )}
              </div>
              <div className="flex">
                <div className="w-1/2">
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardCredentials.expiryDate}
                    onChange={handleInputChange}
                    placeholder="Expiry Date"
                    className="w-20 py-2 px-4 border rounded "
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
                    className="w-1/2 py-2 px-4 border rounded "
                  />
                  {error.cvv && (
                    <p className="text-red-500 text-sm">{error.cvv}</p>
                  )}
                </div>
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
              className="w-full py-2 px-4 border rounded mt-2"
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
                className="w-full py-2 px-4 border rounded "
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
                className="w-full py-2 px-4 border rounded "
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
                className="w-full py-2 px-4 border rounded "
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
          <label htmlFor="saveCard" className="text-violet-950">
            Save card details for future payments
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 py-2 px-4 w-full bg-violet-950 text-white py-2 px-4 rounded-lg hover:bg-cyan-300"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
