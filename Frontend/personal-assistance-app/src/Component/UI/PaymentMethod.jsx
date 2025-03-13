import React, { useState } from "react";
import PaymentForm from "./PaymentForm";

export default function PaymentMethod() {
  const [selectedType, setSelectedType] = useState(null);
  const [saveCard, setSaveCard] = useState({
    name: "Dinithi Gamage",
    type: "visa",
    cardNumber: "4411 2225 5658 4896",
    valideDate: "05/26",
  });

  const paymentmethods = [
    { id: "visa", label: "Visa", image: "/Images/visa.png" },
    { id: "mastercard", label: "Master Card", image: "/Images/master.png" },
    { id: "payhere", label: "PayHere", image: "/Images/payhere.png" },
    {
      id: "onlineTransfer",
      label: "Online Transfer",
      image: "/Images/onlineTransfer.png",
    },
  ];
  //handling function
  const handleSelectedPayment = (method) => {
    setSelectedType(method);
  };
  return (
    <div className="bg-gray-100 p-6 flex justify-center max-w-8xl w-full">
      <div className="max-w-max w-full bg-white p-1 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
        {/* Left Side: Payment Methods */}
        <div className="w-full md:w-1/3 p-4 border-r border-gray-300">
          <h2 className="text-lg font-semibold mb-5">Your Saved Option:</h2>
          {saveCard && (
            <div className="flex flex-col space-y-4">
              <button
                key={saveCard}
                onClick={() => handleSelectedPayment(saveCard.type)}
                className={`px-4 py-2 rounded-lg text-center ${
                  selectedType === saveCard.type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p>**** **** **** {saveCard.cardNumber.slice(-4)}</p>
              </button>
            </div>
          )}

          <h2 className="text-lg font-semibold mb-5">Choose Payment Type:</h2>
          <div className="flex flex-col space-y-4">
            {paymentmethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleSelectedPayment(method.id)}
                className={`px-4 py-2 rounded-lg text-center ${
                  selectedType === method.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className={`w-full md:w-2/3 p-4 ${selectedType ? "block" : "hidden"}`}
        >
          <PaymentForm selectedType={selectedType} />
        </div>
      </div>
    </div>
  );
}
