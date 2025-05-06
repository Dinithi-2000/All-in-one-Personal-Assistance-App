import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const totalSummary = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/expensesMonth")
        .then((res) => {
          setData(res.data.monthlyExpense);
        });
    };

    totalSummary();
  }, []);

  return (
    <div style={{ width: "50%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" interval={0} angle={-20} textAnchor="end" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderColor: "#4B5563",
            }}
            itemStyle={{ color: "#E5E7EB" }}
          />
          <Bar dataKey="expense" fill="blue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
