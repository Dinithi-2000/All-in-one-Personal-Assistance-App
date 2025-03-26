import React from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../UI/AdminDashboard/Common/Header";
import StatCard from "../../UI/AdminDashboard/Common/StatCard";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function RefundPage() {
  return (
    <div className="flex-1 w-64 relative z-10  ml-[2%] ">
      <Header title="Refund Handling" />
      <main className="max-w-screen mx-auto py-8 px-0 lg:px-8 ">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-9 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Refunds" icon={Zap} value="5" color="#6366F1" />
          <StatCard
            name="Requested Refunds"
            icon={Users}
            value="1"
            color="#8B5CF6"
          />
          <StatCard
            name=" Approved Refunds"
            icon={BarChart2}
            value="12.5%"
            color="#10B981"
          />
          <StatCard
            name="Cancelled Refunds"
            icon={ShoppingBag}
            value="567"
            color="#EC4899"
          />
          <div className="overflow-auto" style={{ maxHeight: "500px" }}>
            <table className="table  table-hover table-striped-row backdrop-opacity-10">
              <thead className="sticky top-0 ">
                <tr>
                  <th scope="col" className="text-indigo">
                    #
                  </th>
                  <th scope="col">Refund Details</th>
                  <th scope="col">Refund Reason</th>
                  <th scope="col">Refund Status</th>
                  <th scope="col">Refund Action</th>
                </tr>
              </thead>
              {/* <tbody className="table-group-divider">
                {filteredRefund.length > 0 ? (
                  filteredRefund.map((pay, index) => (
                    <tr key={pay.refundId}>
                      <th scope="row" className="text-left px-4 py-2">
                        {index + 1}
                      </th>
                      <td className="text-left px-4 py-2 min-w-[250px]">
                        <p className="whitespace-nowrap">
                          Refund ID: {pay.refundId}
                        </p>
                        <p className="whitespace-nowrap">
                          Refund Date:
                          {new Date(pay.requestAt).toLocaleDateString()}
                        </p>
                        <p className="whitespace-nowrap">
                          <p>Refund Amount: {pay.amount}</p>
                        </p>
                      </td>
                      <td className="text-left px-4 py-2 min-w-[250px] whitespace-nowrap">
                        {pay.reason}
                      </td>
                      <td className="text-center px-4 py-2 min-w-[250px] whitespace-nowrap">
                        {pay.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>*/}
              <tbody className="table-group-divider">
                <tr>
                  <td>dg</td>
                  <td>dfh</td>
                  <td>sfg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
