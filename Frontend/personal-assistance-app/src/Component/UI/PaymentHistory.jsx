import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      date: "2023-10-01",
      amount: 100,
      description: "Service Charge",
      status: "Complete",
    },
    {
      id: 2,
      date: "2023-10-05",
      amount: 200,
      description: "Service Charge",
      status: "Complete",
    },
    {
      id: 3,
      date: "2023-10-10",
      amount: 150,
      description: "Service Charge",
      status: "Complete",
    },
    {
      id: 4,
      date: "2023-10-15",
      amount: 300,
      description: "Service Charge",
      status: "Complete",
    },
  ]);

  //state manage for date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(payments);

  //handling Function
  const handleDates = () => {
    const paymentFiller = payments.filter((pay) => {
      const paymentDate = new Date(pay.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      //if user not select start date
      if (!startDate && !endDate) {
        return true;
      }
      if (!startDate) {
        return paymentDate >= start;
      }
      if (!endDate) {
        return paymentDate <= end;
      }
      return paymentDate >= start && paymentDate <= end;
    });
    setFilteredPayments(paymentFiller);
  };
  return (
    <div className="container m-6 mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
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
            className="block text-sm font-medium text-gray-700"
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
      {/*
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 ">{payment.id}</td>
              <td className="px-4 py-2 ">{payment.date}</td>
              <td className="px-4 py-2 ">${payment.amount}</td>
              <td className="px-4 py-2 ">{payment.description}</td>
            </tr>
          ))}
        </tbody>
      </table>*/}
      <table class="table  table-hover table-striped-row">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Payment Details</th>
            <th scope="col">Payment Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          {filteredPayments.map((pay) => (
            <tr>
              <th scope="row">1</th>
              <td>
                <p>{pay.date}</p>
                <p>{pay.amount}</p>
                <p>{pay.description}</p>
              </td>
              <td>{pay.status}</td>
              <td></td>
            </tr>
          ))}
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td colspan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
