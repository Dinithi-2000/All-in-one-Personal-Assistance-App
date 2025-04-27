import React from "react";

export default function ExpensesList() {
  const expenses = [
    {
      id: 1,
      name: "Coffee",
      amount: 5.2,
      date: "2023-10-01",
      category: "Food",
    },
    {
      id: 2,
      name: "Taxi",
      amount: 12.5,
      date: "2023-10-02",
      category: "Transport",
    },
    {
      id: 3,
      name: "Netflix",
      amount: 15.99,
      date: "2023-10-05",
      category: "Entertainment",
    },
    {
      id: 4,
      name: "Groceries",
      amount: 45.3,
      date: "2023-10-08",
      category: "Food",
    },
    {
      id: 5,
      name: "Gym",
      amount: 25.0,
      date: "2023-10-10",
      category: "Health",
    },
  ];
  return (
    <div className="overflow-auto w-[500px]" style={{ maxHeight: "500px" }}>
      <table className="w-full table  table-hover table-striped-row backdrop-opacity-50">
        <thead className="sticky top-0">
          <tr className="border-b border-gray-200">
            <th className="text-left px-2 py-2">Name</th>
            <th className="text-left  py-2">Category</th>
            <th className="text-left px-4 py-2">Amount</th>
            <th className="text-left px-4 py-2 ">Action</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-gray-100">
              <td className="text-left px-2 py-2 min-w-[250px]-2">
                {expense.name}
              </td>
              <td className="text-left px-4 py-2  whitespace-nowrap">
                {expense.category}
              </td>
              <td className="text-red-500 text-left px-2 py-2  whitespace-nowrap">
                -${expense.amount.toFixed(2)}
              </td>
              <td className="text-left px-2 py-2 min-w-[250px] whitespace-nowrap">
                <button>Delete</button>
                <button>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
