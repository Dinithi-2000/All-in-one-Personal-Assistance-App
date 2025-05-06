import axios from "axios";
import React, { useState } from "react";

export default function AddRevenue({ onCancel }) {
  const [revenueDetails, setRevenueDetaails] = useState({
    revenueDate: "",
    revenue: "",
    amount: "",
  });

  const inputHandle = (event) => {
    const { value, name } = event.target;
    setRevenueDetaails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const RevenueSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8070/adminDashBoard/Financial/addRevenue",
        {
          date: revenueDetails.revenueDate,
          expense: revenueDetails.revenue,
          amount: revenueDetails.amount,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ml-[200px]">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">
        Payment Details
      </h2>
      <form onSubmit={RevenueSubmit}>
        <div className="mb-4 ">
          <label className="block text-blue-900 mb-2">Revenue Date</label>
          <input
            type="date"
            className=" p-2 border rounded text-blue-900"
            name="revenueDate"
            value={revenueDetails.revenueDate}
            onChange={inputHandle}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-900 mb-2 ">Description</label>
          <input
            className=" p-2 border rounded text-blue-900"
            type="text"
            name="revenue"
            value={revenueDetails.revenue}
            onChange={inputHandle}
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-900 mb-2">Amount</label>
          <input
            className=" p-2 border rounded text-blue-900"
            type="number"
            name="amount"
            value={revenueDetails.amount}
            onChange={inputHandle}
          />
        </div>
        <div className="mb-4 ">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-[20px]"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-60"
            type="submit"
          >
            Add Revenue
          </button>
        </div>
      </form>
    </div>
  );
}
