import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RevenueChar() {
  const [Rdata, setRdata] = useState([]);

  useEffect(() => {
    const totalSummary = () => {
      axios
        .get("http://localhost:8070/adminDashBoard/Financial/getTotal")
        .then((res) => {
          setRdata(res.data.monthlyRevenue);
        });
    };
    totalSummary();
  }, []);

  return (
    <div style={{ width: "50%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={Rdata}>
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
          <Bar dataKey="revenue" fill="blue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
