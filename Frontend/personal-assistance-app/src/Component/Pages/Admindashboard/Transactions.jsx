import React, { useEffect, useState } from "react";
import Header from "../../UI/AdminDashboard/Common/Header";
import ExpenseChart from "../../UI/AdminDashboard/ExpensesHandle/ExpenseChart";
import ExpensesList from "../../UI/AdminDashboard/ExpensesHandle/ExpensesList";
import AddExpenses from "../../UI/AdminDashboard/ExpensesHandle/AddExpenses";
import axios from "axios";
import AddRevenue from "../../UI/AdminDashboard/RevenueHandle/AddRevenue";
import RevenueChar from "../../UI/AdminDashboard/RevenueHandle/RevenueChar";
import RevenueList from "../../UI/AdminDashboard/RevenueHandle/RevenueList";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Transactions() {
  const [showForm, setShowForm] = useState(false);
  const [showFormA, setShowFormA] = useState(false);
  const [info, setInfo] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const onclose = () => {
    setShowForm(false);
    setShowFormA(false);
  };

  const getRevenue = async () => {
    axios
      .get("http://localhost:8070/adminDashBoard/Financial/retrieveRevenue")
      .then((res) => {
        setRevenue(res.data.revenue);
      });
  };

  const getExpenses = async () => {
    axios
      .get("http://localhost:8070/adminDashBoard/Financial/getExpences")
      .then((res) => {
        setInfo(res.data.expenses);
      });
  };

  const handleRevenu = async () => {
    if (revenue.length === 0) {
      await getRevenue();
    }
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("SereniLux ", 105, 20, { align: "center" });

    doc.setFontSize(18);
    doc.text("Revenue Report", 105, 28, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Generates on:${new Date().toLocaleDateString()}`, 105, 40);

    const details = revenue.map((rev, index) => [
      index + 1,
      rev.Date,
      rev.Description,
      rev.Amount,
    ]);
    autoTable(doc, {
      startY: 45,
      head: [["#", "Revenue date", "Revenue", "Amount"]],
      body: details,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 128] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 5 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
      },
      margin: { horizontal: 20 },
    });
    doc.save(`Revenue-reports-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleExpenseReport = async () => {
    try {
      if (info.length === 0) {
        await getExpenses();
      }

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text("SereniLux ", 105, 20, { align: "center" });

      doc.setFontSize(18);
      doc.text("Expenses Report", 105, 28, { align: "center" });

      doc.setFontSize(11);
      doc.text(`Generates on:${new Date().toLocaleDateString()}`, 105, 40);

      const details = info.map((expense, index) => [
        index + 1,
        expense.Date,
        expense.Expense,
        expense.Amount,
      ]);
      autoTable(doc, {
        startY: 45,
        head: [["#", "Expense date", "Expense", "Amount"]],
        body: details,
        theme: "grid",
        headStyles: { fillColor: [0, 0, 128] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 5 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
        },
        margin: { horizontal: 20 },
      });
      doc.save(`Expense-reports-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.log(error);
    }
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
                <button
                  className="ml-[380px] mb-2 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                  onClick={handleExpenseReport}
                >
                  Expenses Report
                </button>
                <ExpensesList />
              </div>
            </div>
          )}
          <h2 className="ml-[20px] mt-[20px]">Revenue</h2>
          {showFormA ? (
            <AddRevenue onCancel={onclose} />
          ) : (
            <div className="flex flex-row gap-4 mt-8 ml-8 mb-8 mr-8">
              <div className="flex-1">
                <RevenueChar />
              </div>
              <div className="flex-1">
                <button
                  className="ml-[380px] mb-2 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                  onClick={() => {
                    setShowFormA(true);
                  }}
                >
                  Add New
                </button>
                <button
                  className="ml-[380px] mb-2 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors"
                  onClick={handleRevenu}
                >
                  Revenue Report
                </button>
                <RevenueList />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
