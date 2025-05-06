import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateRevenue from "./UpdateRevenue";

export default function RevenueList() {
  const [revenue, setRevenue] = useState([]);
  const [selectRevenue, setSelectRevenue] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const getExpenses = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/retrieveRevenue")
        .then((res) => {
          setRevenue(res.data.revenue);
        });
    };
    getExpenses();
  }, []);

  const updateClick = (revenue) => {
    setSelectRevenue(revenue);
    setShowUpdateForm(true);
  };

  const updateDelete = async (revenue) => {
    await axios.delete(
      `http://localhost:8070/adminDashBoard/Financial/deleteRevenue/${revenue.id}`,
    );
    // Refetch the updated revenue list
    const res = await axios.get(
      "http://localhost:8070/adminDashBoard/Financial/retrieveRevenue",
    );
    setRevenue(res.data.revenue);
  };

  const onCancel = () => {
    setShowUpdateForm(false);
    setSelectRevenue(null);
  };

  return (
    <div className="overflow-auto w-[500px]" style={{ maxHeight: "500px" }}>
      {showUpdateForm ? (
        <UpdateRevenue onCancel={onCancel} revenue={selectRevenue} />
      ) : (
        <table className="w-full table  table-hover table-striped-row backdrop-opacity-50">
          <thead className="sticky top-0">
            <tr className="border-b border-gray-200">
              <th className="text-left px-2 py-2">Date</th>
              <th className="text-left  py-2">Revenu</th>
              <th className="text-left px-4 py-2">Amount</th>
              <th className="text-left px-4 py-2 ">Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {revenue.map((rev) => (
              <tr key={rev.id} className="border-b border-gray-100">
                <td className="text-left px-2 py-2 min-w-[250px]-2">
                  {rev.Date}
                </td>
                <td className="text-left px-4 py-2  whitespace-nowrap">
                  {rev.Description}
                </td>
                <td className="text-red-500 text-left px-2 py-2  whitespace-nowrap">
                  Rs.{rev.Amount.toFixed(2)}
                </td>
                <td className="text-left px-2 py-2 min-w-[250px] whitespace-nowrap">
                  <button onClick={() => updateClick(rev)}>
                    <img
                      src="/Images/update (2).png"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </button>
                  <button onClick={() => updateDelete(rev)}>
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
