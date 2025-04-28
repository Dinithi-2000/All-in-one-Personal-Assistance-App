import axios from "axios";
import React, { useState } from "react";

export default function AddRate({ onCancel, deductType }) {
  const [rateType, setRateType] = useState({
    id: deductType.id,
    type: deductType.type,
    rate: deductType.rate,
  });

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setRateType((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8070/adminDashBoard/Financial/updateSalary",
        {
          id: rateType.id,
          type: rateType.type,
          rate: rateType.rate,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="ml-[20px]">
      <h2 className="text-xl font-semibold mb-4"> Rate Details</h2>
      <form onSubmit={updateSubmit}>
        <div className="mb-4 ">
          <label className="block text-white mb-2">Deduction Type</label>
          <input
            type="text"
            className=" p-2 border rounded text-blue-900"
            name="type"
            value={rateType.type}
            onChange={inputHandle}
            required
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Rate</label>
          <input
            type="number"
            className=" p-2 border rounded text-blue-900"
            name="rate"
            value={rateType.rate}
            onChange={inputHandle}
          />
        </div>

        <div className="mb-4 ">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-[20px]"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-60"
            type="submit"
          >
            Update Revenue
          </button>
        </div>
      </form>
    </div>
  );
}
