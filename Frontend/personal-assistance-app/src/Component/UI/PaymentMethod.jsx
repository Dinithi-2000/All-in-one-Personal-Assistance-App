import React, { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import PaymentStack from "./PaymentStack";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function PaymentMethod() {
  const [selectedType, setSelectedType] = useState(null);
  const [saveCard, setSaveCard] = useState([]);
  const location = useLocation();
  const { bookingid, amount } = location.state || {};

  useEffect(() => {
    const getSavedMethod = () => {
      axios
        .get("http://localhost:8070/home/payment/savedPayment/getOption")
        .then((res) => {
          console.log(res);
          setSaveCard(res.data);
        })
        .catch((error) => {
          alert(error.message);
        });
    };
    getSavedMethod();
  }, []);

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
    <div className="min-h-screen w-screen flex ">
      <div className="pl-8">
        <div className="w-10/12 bg-stone-50 rounded-xl  shadow-[0px_4px_10px_rgba(1,1,1,0.5)] overflow-hidden pl-8 pr-8 pb-8 pt-8">
          {/* Show Payment Form when a method is selected */}
          {selectedType ? (
            <div className="flex flex-col w-full space-x-3 items-center">
              <button
                onClick={handleBack}
                className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                ←
              </button>
              <PaymentForm
                selectedType={selectedType}
                saveDetails={saveCard}
                bookingid={bookingid}
                amount={amount}
              />
            </div>
          ) : (
            /* Show Payment Selection */
            <div className="w-full items-center">
              <h2 className="text-lg text-[#000080] font-semibold mb-2 whitespace-nowrap">
                Your Saved Option:
              </h2>
              {saveCard &&
                saveCard.length > 0 &&
                saveCard.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleSelectedPayment(card.paymentMethod)}
                    className="px-18 py-1 w-full text-[#000080] rounded-lg text-center bg-gray-200 mb-4"
                  >
                    <p>**** **** **** {card.cardNumber.slice(-4)}</p>
                  </button>
                ))}

              <h2 className="text-lg text-[#000080] font-semibold mb-4 whitespace-nowrap pr-10">
                Choose Payment Type:
              </h2>
              <div className="flex flex-col space-y-4">
                {paymentmethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectedPayment(method.id)}
                    className="px-4 py-2 rounded-lg w-full text-center text-[#000080] bg-gray-200 hover:bg-blue-600 hover:text-white"
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
