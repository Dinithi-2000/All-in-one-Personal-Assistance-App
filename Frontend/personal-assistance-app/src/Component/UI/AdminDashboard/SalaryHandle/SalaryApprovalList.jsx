import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SalaryApprovalList() {
  const [info, setInfo] = useState([]);

  useEffect(() => {
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
    getSalaryDetails();
  }, []);

  return (
    <div className="overflow-auto w-[1000px]" style={{ maxHeight: "500px" }}>
      <table className="w-screen table  table-hover table-striped-row backdrop-opacity-50">
        <thead className="sticky top-0">
          <tr className="border-b border-gray-200">
            <th className="text-left ml-8 px-2 py-2">Provider Name</th>
            <th className="text-left  py-2">Salary</th>
            <th className="text-left px-4 py-2">EPF</th>
            <th className="text-left px-4 py-2">ETF</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {info.map((salary) => (
            <tr key={salary.id} className="border-b border-gray-100">
              <td className="text-left px-2 py-2 min-w-[250px]-2">
                {salary.serviceProvider?.FirstName}
                {salary.serviceProvider?.LastName}
              </td>
              <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                {salary.totSalary}
              </td>
              <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                {salary.EPF}
              </td>
              <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                {salary.ETF}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
