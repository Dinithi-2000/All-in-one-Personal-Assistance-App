import axios from "axios";
import React, { useState } from "react";

export default function UpdateExpenses({ onCancel, expense }) {
  const [expensDetails, setExpensDetaails] = useState({
    id: expense.id,
    expenseDate: expense.Date,
    expense: expense.Expense,
    amount: expense.Amount,
  });

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setExpensDetaails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8070/adminDashBoard/Financial/updateExpense",
        {
          id: expensDetails.id,
          date: expensDetails.expenseDate,
          expence: expensDetails.expense,
          amount: expensDetails.amount,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="ml-[200px]">
      <h2 text-xl font-semibold mb-4>
        {" "}
        Payment Details
      </h2>
      <form onSubmit={updateSubmit}>
        <div className="mb-4 ">
          <label className="block text-blue-900 mb-2">Expense Date</label>
          <input
            type="date"
            className=" p-2 border rounded text-blue-900"
            name="expenseDate"
            value={expensDetails.expenseDate}
            onChange={inputHandle}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-900 mb-2">Expense</label>
          <input
            type="text"
            className=" p-2 border rounded text-blue-900"
            name="expense"
            value={expensDetails.expense}
            onChange={inputHandle}
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-900 mb-2">Amount</label>
          <input
            type="number"
            className=" p-2 border rounded text-blue-900"
            name="amount"
            value={expensDetails.amount}
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
            Update Expense
          </button>
        </div>
      </form>
    </div>
  );
}
