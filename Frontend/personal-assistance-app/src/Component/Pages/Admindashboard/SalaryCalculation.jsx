import React from "react";
import Header from "../../UI/AdminDashboard/Common/Header";
import SalaryApprovalList from "../../UI/AdminDashboard/SalaryHandle/SalaryApprovalList";
import axios from "axios";
import DeductionList from "../../UI/AdminDashboard/SalaryHandle/DeductionList";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
export default function SalaryCalculation() {
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

  return (
    <div className="flex-1 relative z-10  ml-[4%] ">
      <Header title="Manage Provider Salaries" />
      <main className="max-w-screen mx-auto py-8 px-0 lg:px-8 ">
        <div className="rounded-2xl w-[1080px] overflow-hidden bg-blue-900 bg-opacity-50 z-1 ml-[10px] ">
          <h4 className="ml-5 mt-2 mb-10">Salary Approval</h4>
          <div className="ml-[900px]">
            <button
              className="bg-white text-blue-900 mb-[20px] text-bolt p-4"
              onClick={handleSalary}
            >
              Process Salary
            </button>
          </div>
          <div className="ml-[20px]">
            <SalaryApprovalList />
          </div>
        </div>
        <div className="rounded-2xl w-[300px] overflow-hidden bg-blue-900 bg-opacity-50 z-1 mt-[50px] ml-[10px]">
          <div className="flex items-start gap-4">
            <div className="ml-[20px] mt-[20px] flex-1">
              <DeductionList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
