import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

export default function ExpenseChart() {
  const data = [
    { month: "January", expense: 10000 },
    { month: "February", expense: 15000 },
    { month: "March", expense: 10000 },
  ];
  return (
    <div>
      <BarChart width={350} height={400} data={data}>
        <Bar dataKey="expense" fill="blue" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="month" />
        <YAxis />
      </BarChart>
    </div>
  );
}
