import React, { useEffect, useState } from "react";

export default function AgreementDetails({ selectProvider, serviceCategory }) {
  const [AgreementInfo, setAgreementInfo] = useState([
    {
      bookID: "B0001",
      Service: "Baby Sitting",
      Provider: "Kasun",
      Duration: "6month",
      ServiceCharge: "LKR 37000",
    },
    {
      bookID: "B0003",
      Service: "Baby Sitting",
      Provider: "Amali",
      Duration: "3month",
      ServiceCharge: "LKR 20000",
    },
  ]);

  const [matchDetail, SetMatchDetails] = useState(null);
  useEffect(() => {
    if (selectProvider) {
      const matched = AgreementInfo.find(
        (detail) => detail.Provider === selectProvider.name,
      );
      SetMatchDetails(matched || null);
    }
  }, [selectProvider, AgreementInfo]);
  if (!matchDetail) {
    return <div>No agreement details found for the selected provider.</div>;
  }
  return (
    <div style={{ color: "#9fa8da" }}>
      <h4 style={{ paddingBottom: "10px", color: "#000080" }}>
        Agreement Details
      </h4>
      <p>
        <strong>Service Category :</strong>
        {matchDetail.Service}
      </p>
      <p>
        <strong>Service Provider :</strong>
        {matchDetail.Provider}
      </p>
      <p>
        <strong>Booking ID :</strong>
        {matchDetail.bookID}
      </p>
      <p>
        <strong>Service Duration :</strong>
        {matchDetail.Duration}
      </p>
      <p>
        <strong>Service Charge :</strong>
        {matchDetail.ServiceCharge}
      </p>
      <button type="button" className="btn btn-primary">
        checkOut
      </button>
    </div>
  );
}
