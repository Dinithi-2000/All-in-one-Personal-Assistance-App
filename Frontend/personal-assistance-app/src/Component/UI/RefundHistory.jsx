import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

export default function RefundHistory() {
  const [refunds, setRefunds] = useState([]);
  //state manage for date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRefund, setFilteredRefund] = useState([]);

  useEffect(() => {
    const getRefund = () => {
      axios
        .get("http://localhost:8070/home/Refund/retrieveRefund")
        .then((res) => {
          console.log(res);
          setRefunds(res.data.refund);
          setFilteredRefund(res.data.refund);
        })
        .catch((error) => {
          alert(error.message);
        });
    };
    getRefund();
  }, []);
  //handling Function
  const handleDates = () => {
    if (!startDate && !endDate) {
      setFilteredRefund(refunds);
      return;
    }
    const refundFiller = refunds.filter((refund) => {
      const paymentDate = new Date(refund.requestAt);
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
    setFilteredRefund(refundFiller);
  };

  const handleRequest = () => {};

  return (
    <div className="container m-6 mx-auto p-4 mt-[0] text-center">
      <h2 className="text-2xl font-bold mb-4 text-white">Refund History</h2>

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
              <th scope="col">Refund Details</th>
              <th scope="col">Refund Reason</th>
              <th scope="col">Refund Status</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {filteredRefund.length > 0 ? (
              filteredRefund.map((pay, index) => (
                <tr key={pay.refundId}>
                  <th scope="row" className="text-left px-4 py-2">
                    {index + 1}
                  </th>
                  <td className="text-left px-4 py-2 min-w-[250px]">
                    <p className="whitespace-nowrap">
                      Refund ID: {pay.refundId}
                    </p>
                    <p className="whitespace-nowrap">
                      Refund Date:
                      {new Date(pay.requestAt).toLocaleDateString()}
                    </p>
                    <p className="whitespace-nowrap">
                      <p>Refund Amount: {pay.amount}</p>
                    </p>
                  </td>
                  <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                    {pay.reason}
                  </td>
                  <td className="text-center px-4 py-2 min-w-[250px] whitespace-nowrap">
                    {pay.status}
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
