import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert } from "react-bootstrap";
import { Pagination } from "../Common/Pagination";

export default function SalaryApprovalList() {
  const [info, setInfo] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getSalaryDetails = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/adminDashBoard/Financial/salaryDetail",
        );
        setInfo(res.data.salary);
      } catch (err) {
        setError("Failed to load salary");
        console.error(err);
      } finally {
        setIsloading(false);
      }
    };
    getSalaryDetails();
  }, []);

  const currencyFormat = (value) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
    }).format(value);
  };

  const totalPages = Math.ceil(info.length / 5);
  const currentsalary = info.slice((currentPage - 1) * 5, currentPage * 5);

  if (isloading) {
    return <div className="text-center py-4"> Loading......</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-auto w-[1000px]" style={{ maxHeight: "500px" }}>
        <table className="w-screen table  table-hover table-striped-row backdrop-opacity-50">
          <thead className="sticky top-0">
            <tr className="border-b border-gray-200">
              <th className="text-left ml-8 px-2 py-2">Salary Details</th>
              <th className="text-left  py-2">Salary</th>
              <th className="text-left px-4 py-2">EPF</th>
              <th className="text-left px-4 py-2">ETF</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {info.map((salary) => (
              <tr key={salary.id} className="border-b border-gray-100">
                <td className="text-left px-2 py-2 min-w-[250px]-2">
                  <p>
                    Provider :<span>{salary.serviceProvider?.FirstName}</span>
                    <span>{salary.serviceProvider?.LastName}</span>
                  </p>
                  <p>Month: {salary.month + 1}</p>
                </td>
                <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                  {currencyFormat(salary.totSalary)}
                </td>
                <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                  {currencyFormat(salary.EPF)}
                </td>
                <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                  {currencyFormat(salary.ETF)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-indigo-900 bg-indigo-300">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
