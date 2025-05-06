import axios from "axios";
import React, { useEffect, useState } from "react";

export default function TopEarners() {
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    const getEmployee = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/topEarners")
        .then((res) => {
          setEmployeeList(res.data.topemployee);
        });
    };
    getEmployee();
  }, []);

  return (
    <div className="w-[600px] mx-auto   rounded-xl shadow-md overflow-hidden p-6 mr-[10px]">
      {employeeList.map((employee) => (
        <div className="flex justify-between items-center py-1 px-4 bg-gray-50 opacity-50 rounded-lg">
          <div className="text-[20px] text-blue-900">
            {employee.serviceProvider?.FirstName}{" "}
            {employee.serviceProvider?.LastName}
          </div>
          <div className="text-[20px] text-blue-900">{employee.totSalary}</div>
        </div>
      ))}
    </div>
  );
}
