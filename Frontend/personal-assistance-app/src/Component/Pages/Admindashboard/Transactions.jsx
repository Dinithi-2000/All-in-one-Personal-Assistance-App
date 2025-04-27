import React, { useState } from "react";
import Header from "../../UI/AdminDashboard/Common/Header";
import ExpenseChart from "../../UI/AdminDashboard/ExpensesHandle/ExpenseChart";
import ExpensesList from "../../UI/AdminDashboard/ExpensesHandle/ExpensesList";
import AddExpenses from "../../UI/AdminDashboard/ExpensesHandle/AddExpenses";

export default function Transactions() {
  const [showForm, setShowForm] = useState(false);

  const onclose = () => {
    setShowForm(false);
  };

  return (
    <div className="flex-1 relative z-10  ml-[4%] ">
      <Header title="Transacion" />
      <main className="max-w-screen mx-auto py-8 px-0 lg:px-8 ">
        <div className="rounded-2xl w-[1080px] overflow-hidden bg-white bg-opacity-50 z-1  ">
          <h2 className="ml-[20px] mt-[20px]">Expenses</h2>
          {showForm ? (
            <AddExpenses onCancel={onclose} />
          ) : (
            <div className="flex flex-row gap-4 mt-8 ml-8 mb-8 mr-8">
              <div className="flex-1">
                <ExpenseChart />
              </div>
              <div className="flex-1">
                <button
                  className="ml-[380px] mb-2 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                  onClick={() => {
                    setShowForm(true);
                  }}
                >
                  Add New
                </button>
                <ExpensesList />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
