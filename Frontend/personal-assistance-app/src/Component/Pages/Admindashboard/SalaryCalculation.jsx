import React, { useState } from "react";
import Header from "../../UI/AdminDashboard/Common/Header";
import SalaryApprovalList from "../../UI/AdminDashboard/SalaryHandle/SalaryApprovalList";
import axios from "axios";
import DeductionList from "../../UI/AdminDashboard/SalaryHandle/DeductionList";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
import TopEarners from "../../UI/AdminDashboard/SalaryHandle/TopEarners";
import { LampDemo } from "../../UI/AdminDashboard/SalaryHandle/lamp";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SalaryCalculation() {
  const [info, setInfo] = useState([]);

  const getSalaryDetails = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8070/adminDashBoard/Financial/salaryDetail",
      );
      setInfo(res.data.salary);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSalary = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8070/home/payment/AdminDashBoard/providerSalary",
      );
      console.log(res.data);
      alert("Provider salaries calculated successfully!");
      // You can also refresh data here if needed
    } catch (error) {
      console.error("Error processing salary:", error);
      alert("Something went wrong while processing salaries.");
    }
  };

  const handlesalaryReport = async () => {
    try {
      if (info.length === 0) {
        await getSalaryDetails();
      }

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text("SereniLux ", 105, 20, { align: "center" });

      doc.setFontSize(18);
      doc.text("Service Provider Salary Report", 105, 28, { align: "center" });

      doc.setFontSize(11);
      doc.text(`Generates on:${new Date().toLocaleDateString()}`, 105, 40);

      const details = info.map((salary, index) => [
        index + 1,
        salary.serviceProvider?.FirstName,
        salary.totSalary,
        salary.EPF,
        salary.ETF,
      ]);

      autoTable(doc, {
        startY: 45,
        head: [["#", "Provider", "TotalSalary", "EPF", "ETF"]],
        body: details,
        theme: "grid",
        headStyles: { fillColor: [0, 0, 128] },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 5 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
        },
        margin: { horizontal: 20 },
      });
      doc.save(`salary-reports-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 relative z-10  ml-[4%] ">
      <Header title="Manage Provider Salaries" />
      <main className="max-w-screen mx-auto py-8 px-0 lg:px-8 ">
        <div className="rounded-2xl w-[1200px] overflow-hidden bg-slate-900 bg-opacity-50 z-1 ml-[10px] mb-[80px] mr-[10px]">
          <h4 className="ml-[20px] mt-2 mb-10">Salary Approval</h4>
          <div className="ml-[500px] flex gap-4">
            <button
              className="bg-white text-blue-900 mb-[20px]  mr-[50px]text-bolt p-1"
              onClick={handleSalary}
            >
              Process Salary
            </button>
            <button
              onClick={handlesalaryReport}
              className="bg-white text-blue-900 mb-[20px] text-bolt p-1"
            >
              Salary Report
            </button>
          </div>
          <div className="ml-[60px]">
            <SalaryApprovalList />
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="rounded-xl overflow-hidden bg-slate-900 bg-opacity-50 z-1 mt-[8px] ml-[10px] flex-1">
            <div className="flex items-start gap-4">
              <div className="ml-[100px] mt-[20px] flex-1">
                <DeductionList />
              </div>
              <div>
                <h4 className="text-center mt-[80px] mr-[20px]">
                  {" "}
                  Deduction Rates
                </h4>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden bg-slate-900 bg-opacity-50 z-1 mt-[8px] ml-[10px]">
            <h3 className="mt-[10px] ml-[10px]">Top Earners</h3>
            <LampDemo />
          </div>
        </div>
      </main>
    </div>
  );
}
