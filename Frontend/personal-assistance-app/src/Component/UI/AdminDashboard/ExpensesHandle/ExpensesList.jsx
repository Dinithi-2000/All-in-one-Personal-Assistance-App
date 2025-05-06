import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateExpenses from "./updateExpenses";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [selectExpense, setSelectExpense] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const getExpenses = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/getExpences")
        .then((res) => {
          setExpenses(res.data.expenses);
        });
    };
    getExpenses();
  }, []);

  const updateClick = (expense) => {
    setSelectExpense(expense);
    setShowUpdateForm(true);
  };

  const updateDelete = async (expense) => {
    await axios.delete(
      `http://localhost:8070/adminDashBoard/Financial/deleteExpneces/${expense.id}`,
    );
  };

  const onCancel = () => {
    setShowUpdateForm(false);
    setSelectExpense(null);
  };

  return (
    <div className="overflow-auto w-[500px]" style={{ maxHeight: "500px" }}>
      {showUpdateForm ? (
        <UpdateExpenses onCancel={onCancel} expense={selectExpense} />
      ) : (
        <table className="w-full table  table-hover table-striped-row backdrop-opacity-50">
          <thead className="sticky top-0">
            <tr className="border-b border-gray-200">
              <th className="text-left px-2 py-2">Date</th>
              <th className="text-left  py-2">Expense</th>
              <th className="text-left px-4 py-2">Amount</th>
              <th className="text-left px-4 py-2 ">Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-gray-100">
                <td className="text-left px-2 py-2 min-w-[250px]-2">
                  {expense.Date}
                </td>
                <td className="text-left px-4 py-2  whitespace-nowrap">
                  {expense.Expense}
                </td>
                <td className="text-red-500 text-left px-2 py-2  whitespace-nowrap">
                  Rs.{expense.Amount.toFixed(2)}
                </td>
                <td className="text-left px-2 py-2 min-w-[250px] whitespace-nowrap">
                  <button onClick={() => updateClick(expense)}>
                    <img
                      src="/Images/update (2).png"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </button>
                  <button onClick={() => updateDelete(expense)}>
                    <img
                      src="/Images/delete (2).png"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
