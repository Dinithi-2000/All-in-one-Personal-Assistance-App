import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  //state manage for date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    const getHistory = () => {
      axios
        .get("http://localhost:8070/home/payment/paymentHistory")
        .then((res) => {
          console.log(res);
          setPayments(res.data.payment);
          alert(res.data.message || "Payments retrieved successfully.");
          setFilteredPayments(res.data.payment);
        })
        .catch((error) => {
          alert(error.message);
        });
    };
    getHistory();
  }, []);

  const generatePDF = (payment) => {
    const doc = new jsPDF();

    //title
    doc.setFontSize(20);
    doc.text("SereniLux ", 105, 20, { align: "center" });

    doc.setFontSize(18);
    doc.text("Payment Slip", 105, 28, { align: "center" });

    //details
    doc.setFontSize(12);
    doc.text(`Recipt ID: ${payment.paymentID}`, 14, 45);
    doc.text(
      `Date: ${new Date(payment.PaymentDate).toLocaleDateString()}`,
      14,
      53,
    );
    doc.text(`Booking Id :${payment.bookingDetails?.bookingID}`, 14, 61);
    doc.text(
      `Service Provider :${payment.bookingDetails?.providerName}`,
      14,
      69,
    );
    doc.text(
      `Agreement Duration :${payment.bookingDetails?.agreemetnDuration}`,
      14,
      76,
    );
    doc.text(`PaymentMethod :${payment.paymentMethodName}`, 14, 84);
    doc.text(`Service :${payment.bookingDetails?.Booking_Service}`, 14, 92);
    doc.text(`Status :${payment.Status}`, 14, 100);

    doc.line(14, 120, 196, 120);

    doc.setFontSize(10);
    doc.text("Thank you for your payment!", 105, 128, { align: "center" });

    doc.save(`payment_recipt_${payment.paymentID}.pdf`);
  };

  //handling Function
  const handleDates = () => {
    if (!startDate && !endDate) {
      setFilteredPayments(payments);
      return;
    }
    const paymentFiller = payments.filter((pay) => {
      const paymentDate = new Date(pay.PaymentDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      //if user not select start date
      if (startDate && endDate) {
        return paymentDate >= start && paymentDate <= end;
      }
      if (!startDate) {
        return paymentDate >= start;
      }
      if (!endDate) {
        return paymentDate <= end;
      }
      return true;
    });
    setFilteredPayments(paymentFiller);
  };

  const handleRequest = async (paymentID) => {
    if (
      window.confirm(
        "Are you sure you want to request a refund for this payment?",
      )
    ) {
      //add sweet alertbox to get reason
      const { value: reason } = await Swal.fire({
        title: "Refund Request",
        input: "textarea",
        inputLabel: "Reason for refund",
        inputPlaceholder: "Please explain why you are requesting a refund...",
        inputAttributes: {
          "aria-label": "Type your refund reason here",
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to provide a reason!";
          }
        },
      });

      if (reason) {
        const response = await axios.post(
          "http://localhost:8070/home/Refund/requestRefund",
          {
            userId: "67db7f7145aae4033ea34d42",
            paymentId: paymentID,
            reason: reason,
          },
        );

        alert(response.data.message || "Refund request submitted successfully");
      }
    }
  };
  return (
    <div className="container m-7 mx-auto p-4 mt-[0] text-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Payment History</h2>
      <div
        className="flex gap-4 mb-6 items-end justify-center justify-items-center
"
      >
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-white"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-white"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleDates}
          >
            Search
          </button>
        </div>
      </div>
      <div className="overflow-auto" style={{ maxHeight: "500px" }}>
        <table className="table  table-hover table-striped-row backdrop-opacity-10">
          <thead className="sticky top-0 ">
            <tr>
              <th scope="col" className="text-indigo">
                #
              </th>
              <th scope="col">Payment Details</th>
              <th scope="col">Booking Details</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((pay, index) => (
                <tr key={pay.paymentID}>
                  <th scope="row" className="text-left px-4 py-2">
                    {index + 1}
                  </th>
                  <td className="text-left px-4 py-2 min-w-[250px]">
                    <p className="whitespace-nowrap">
                      Payment Date:
                      {new Date(pay.PaymentDate).toLocaleDateString()}
                    </p>
                    <p>Service Amount: {pay.Amount}</p>
                    <p>Payment Method: {pay.paymentMethodName || "N/A"}</p>
                  </td>
                  <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                    <p>BookingId: {pay.bookingDetails?.bookingID || "N/A"}</p>
                    <p>
                      Agreement Duration:{" "}
                      {pay.bookingDetails?.agreemetnDuration || "N/A"}
                    </p>
                    <p>Provider: {pay.bookingDetails?.providerName || "N/A"}</p>
                  </td>
                  <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                    {pay.Status}
                  </td>
                  <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleRequest(pay.paymentID)}
                      disabled={
                        pay.Status === "REFUNDED" ||
                        pay.Status === "COMPLETED" ||
                        pay.Status === "CANCELLED"
                      }
                    >
                      {pay.Status === "REFUNDED"
                        ? "Refund Requested"
                        : "Refund Request"}
                    </button>
                    <br />
                    <br />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => generatePDF(pay)}
                    >
                      Slip
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
