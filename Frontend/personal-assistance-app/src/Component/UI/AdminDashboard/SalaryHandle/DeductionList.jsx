import axios from "axios";
import React, { useEffect, useState } from "react";
import AddRate from "./addRate";

export default function DeductionList() {
  const [deductList, setDeducList] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectRate, setSelectRate] = useState(null);

  useEffect(() => {
    //getList
    const getDeducList = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/adminDashBoard/Financial/getList",
        );
        setDeducList(res.data.list);
      } catch (err) {
        console.error(err);
      }
    };
    getDeducList();
  }, []);
  const updateClick = (rateType) => {
    setSelectRate(rateType);
    setShowUpdateForm(true);
  };

  const onCancel = () => {
    setShowUpdateForm(false);
  };

  return (
    <div className="overflow-auto w-[250px] " style={{ maxHeight: "500px" }}>
      {!showUpdateForm ? (
        <table className="w-screen table  table-hover table-striped-row backdrop-opacity-50">
          <thead className="sticky top-0">
            <tr className="border-b border-gray-200">
              <th className="text-left text-blue-900"> Type</th>
              <th className="text-left text-blue-900 py-2">Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {deductList.map((list) => (
              <tr key={list.id} className="border-b border-gray-100">
                <td className="text-left px-2 py-2 ">{list.type}</td>
                <td className="text-left px-40 py-2 ">{list.rate}</td>
                <td className="text-left px-2 py-2 min-w-[250px] whitespace-nowrap">
                  <button onClick={() => updateClick(list)}>
                    <img
                      src="/Images/update (2).png"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <AddRate onCancel={onCancel} deductType={selectRate}></AddRate>
      )}
    </div>
  );
}
