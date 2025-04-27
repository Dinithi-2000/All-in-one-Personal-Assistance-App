import React, { useState } from "react";

export default function AddExpenses({ onCancel }) {
  const [expensDetails, setExpensDetaails] = useState({
    expenseDate: "",
    expense: "",
    amount: "",
  });

  const inputHandle = () => {};
  return (
    <div className="ml-[200px]">
      <h2 text-xl font-semibold mb-4>
        {" "}
        Payment Details
      </h2>
      <form>
        <div className="mb-4 ">
          <label className="block text-blue-900 mb-2">Expense Date</label>
          <input
            type="date"
            className=" p-2 border rounded"
            value={expensDetails.expenseDate}
            onChange={inputHandle}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-900 mb-2">Expense</label>
          <input
            type="text"
            value={expensDetails.expense}
            onChange={inputHandle}
          />
        </div>
        <div className="mb-4">
          <label className="block text-blue-900 mb-2">Amount</label>
          <input
            type="number"
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
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}
