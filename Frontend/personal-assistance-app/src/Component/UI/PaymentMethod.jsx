import React, { useState } from "react";
import PaymentForm from "./PaymentForm";
import PaymentStack from "./PaymentStack";

export default function PaymentMethod() {
  const [selectedType, setSelectedType] = useState(null);
  const [saveCard, setSaveCard] = useState({
    name: "Dinithi Gamage",
    type: "visa",
    cardNumber: "4411 2225 5658 4896",
    valideDate: "05/26",
  });

  const paymentmethods = [
    { id: "visa", label: "Visa" },
    { id: "mastercard", label: "Master Card" },
    { id: "payhere", label: "PayHere" },
    { id: "onlineTransfer", label: "Online Transfer" },
  ];

  // Handle payment type selection
  const handleSelectedPayment = (method) => {
    setSelectedType(method);
  };

  // Reset selection to show payment options again
  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen w-screen flex justify-center justify-items-center items-center ">
      <div className="-pl-8">
        <div className="w-10/12 bg-stone-50 rounded-xl -mx-px shadow-lg overflow-hidden pl-8 pr-8 pb-8 pt-8">
          {/* Show Payment Form when a method is selected */}
          {selectedType ? (
            <div className="flex flex-col w-full space-x-3 items-center">
              <button
                onClick={handleBack}
                className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                ←
              </button>
              <PaymentForm selectedType={selectedType} />
            </div>
          ) : (
            /* Show Payment Selection */
            <div className="w-full items-center">
              <h2 className="text-lg font-semibold mb-5">Your Saved Option:</h2>
              {saveCard && (
                <button
                  key={saveCard.type}
                  onClick={() => handleSelectedPayment(saveCard.type)}
                  className="px-18 py-1 w-full rounded-lg text-center bg-gray-200"
                >
                  <p>**** **** **** {saveCard.cardNumber.slice(-4)}</p>
                </button>
              )}
              <h2 className="text-lg font-semibold mb-5">
                Choose Payment Type:
              </h2>
              <div className="flex flex-col space-y-4">
                {paymentmethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectedPayment(method.id)}
                    className="px-4 py-2 rounded-lg w-full text-center bg-gray-200 hover:bg-blue-600 hover:text-white"
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
