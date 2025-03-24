import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AgreementDetails({ selectProvider, selectCategory }) {
  const [bookDetail, setBookDetail] = useState({});
  const [showPaymentOption, setShowPaymentOption] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getBookingDetail = () => {
      axios
        .get(
          `http://localhost:8070/home/payment/bookingDetails/${selectProvider.ProviderID}/67db7f7145aae4033ea34d42`,
        )
        .then((res) => {
          console.log(res);
          setBookDetail(res.data);
        })
        .catch((error) => {
          alert(error.message);
        });
    };
    getBookingDetail();
  }, [selectProvider, selectCategory]);

  return (
    <div style={{ color: "#9fa8da" }}>
      <h4 style={{ paddingBottom: "10px", color: "#000080" }}>
        Agreement Details
      </h4>
      <p className="whitespace-nowrap">
        <strong>Service Category :</strong>
        {selectCategory.Type}
      </p>
      <p className="whitespace-nowrap">
        <strong>Service Provider :</strong>
        {selectProvider.FirstName} {selectProvider.LastName}
      </p>
      <p className="whitespace-nowrap">
        <strong>Booking ID :</strong>
        {bookDetail.BookingID}
      </p>
      <p className="whitespace-nowrap">
        <strong>Service Duration :</strong>
        {bookDetail.AgreementDuration}
      </p>
      <p className="whitespace-nowrap">
        <strong>Service Charge : LKR.</strong>
        {bookDetail.MonthlyPayment}
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() =>
          navigate("/payment/PaymentOption", {
            state: {
              bookingid: bookDetail.BookingID,
              amount: bookDetail.MonthlyPayment,
            },
          })
        }
      >
        checkOut
      </button>
    </div>
  );
}
