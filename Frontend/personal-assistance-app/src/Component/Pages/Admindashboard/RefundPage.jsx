import React, { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../UI/AdminDashboard/Common/Header";
import StatCard from "../../UI/AdminDashboard/Common/StatCard";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import LoadingSpinner from "../../UI/AdminDashboard/Common/LoadingSpinner";
import { Pagination } from "../../UI/AdminDashboard/Common/Pagination";

export default function RefundPage() {
  const [refunnds, setRefund] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStat] = useState({
    total: 0,
    requested: 0,
    approved: 0,
    cancelled: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const ITEM_PER_PAGE = 3;

  useEffect(() => {
    refundDetail();
  }, []);

  const refundDetail = async () => {
    try {
      setIsLoading(true);
      const detail = await axios.get(
        "http://localhost:8070/home/Refund/retrieveRefund",
      );
      setRefund(detail.data.refund);
      calculateStats(detail.data.refund);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching refunds:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (refundData) => {
    const total = refundData.length;
    const approved = refundData.filter(
      (ref) => ref.status === "APPROVED",
    ).length;
    const requested = refundData.filter(
      (ref) => ref.status === "PENDING",
    ).length;
    const cancelled = refundData.filter(
      (ref) => ref.status === "CANCELLED",
    ).length;

    setStat({
      total,
      requested,
      approved,
      cancelled,
    });
  };

  const handleApprove = async (refundId) => {
    if (!window.confirm("Are you sure you want to approve this refund?"))
      return;
    try {
      isLoadind(true);
      await axios.put("http://localhost:8070/home/Refund/Approval", {
        refundID: refundId,
      });
      refundDetail();
      alert("Refund Approved Successfully!");
    } catch (error) {
      console.error("Error approving refund:", error);
      alert("Failed to approve refund");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (refundId) => {
    if (!window.confirm("Are you sure you want to Cancel this refund?")) return;
    try {
      await axios.post("http://localhost:8070/home/Refund/CanecelRefund", {
        refundId: refundId,
      });
      refundDetail();
      alert("Refund Cancelled SuccessFUlly");
    } catch (error) {
      alert("Failed to Cancel Refund");
    }
  };

  const setDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("SereniLux ", 105, 20, { align: "center" });

    doc.setFontSize(18);
    doc.text("Refund Report", 105, 28, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Generates on:${new Date().toLocaleDateString()}`, 105, 40);

    doc.setFontSize(18);
    doc.text("Summary Statistics", 14, 40);

    const statData = [
      ["Total Refunds", stats.total],
      ["Approved Refunds", stats.approved],
      ["Requested Refunds", stats.requested],
      ["Cancelled Refunds", stats.cancelled],
    ];

    autoTable(doc, {
      startY: 45,
      head: [["Statistic", "Count"]],
      body: statData,
      theme: "grid",
      headStyle: { fillColor: [0, 0, 128] },
    });

    const details = refunnds.map((refund, index) => [
      index + 1,
      refund.refundId,
      new Date(refund.requestAt).toLocaleDateString(),
      refund.amount,
      refund.reason,
      refund.status,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["#", "ID", "Date", "Amount", "Reason", "Status"]],
      body: details,
      theme: "grid",
      headStyle: { fillColor: [0, 0, 128] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 5 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 30 },
      },
      margin: { horizontal: 10 },
    });

    doc.save(`refund-reports-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const totalPages = Math.ceil(refunnds.length / ITEM_PER_PAGE);
  const currentRefund = refunnds.slice(
    (currentPage - 1) * ITEM_PER_PAGE,
    currentPage * ITEM_PER_PAGE,
  );

  if (isLoadind) {
    return <LoadingSpinner fullPage />;
  }
  if (error) {
    return (
      <div className="flex-1 relative z-10 ml-[2%]">
        <div className="alert alert-danger mt-4">{error}</div>
      </div>
    );
  }
  return (
    <div className="flex-1 relative z-10  ml-[2%] ">
      <Header title="Refund Handling" />
      <div className="absolute top-4 right-4">
        <button
          className="relative p-2 rounded-xl bg-indigo-900 hover:bg-gray-100 hover:text-indigo-900"
          onClick={setDownload}
        >
          <img
            className="relative"
            src="/Images/download.png"
            style={{ width: "20px", height: "20px" }}
          />
          Refund Report
        </button>
      </div>
      <main className="max-w-screen mx-auto py-8 px-0 lg:px-8 ">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-9 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Refunds"
            icon={Zap}
            value={stats.total}
            color="#6366F1"
          />
          <StatCard
            name="Requested Refunds"
            icon={BarChart2}
            value={stats.requested}
            color="#8B5CF6"
          />
          <StatCard
            name=" Approved Refunds"
            icon={BarChart2}
            value={stats.approved}
            color="#10B981"
          />
          <StatCard
            name="Cancelled Refunds"
            icon={BarChart2}
            value={stats.cancelled}
            color="#EC4899"
          />
        </motion.div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-auto " style={{ maxHeight: "500px" }}>
            <table className="table  table-hover table-striped-row backdrop-opacity-10  table-primary">
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
              {
                <tbody className="table-group-divider">
                  {refunnds.length > 0 ? (
                    refunnds.map((pay, index) => (
                      <tr key={pay.refundId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(currentPage - 1) * ITEM_PER_PAGE + index + 1}
                        </td>

                        <td className="text-left px-2 py-2 w-[20px]">
                          <p className="whitespace-nowrap">
                            Refund ID: {pay.refundId}
                          </p>
                          <p className="whitespace-nowrap">
                            Refund Date:
                            {new Date(pay.requestAt).toLocaleDateString()}
                          </p>
                          <p className="whitespace-nowrap">
                            Refund Amount: {pay.amount}
                          </p>
                        </td>
                        <td className="text-left px-2 py-2 min-w-[20px] whitespace-nowrap">
                          {pay.reason}
                        </td>
                        <td className="text-left px-2 py-2 min-w-[20px] whitespace-nowrap">
                          {pay.status}
                        </td>
                        <td className="text-center px-2 py-2 min-w-[20px]">
                          {pay.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(pay.refundId)}
                                className="btn btn-sm btn-success mb-[20px]"
                              >
                                Approve
                              </button>
                              <br />
                              <button
                                onClick={() => handleCancel(pay.refundId)}
                                className="btn btn-sm btn-danger"
                              >
                                Cancel
                              </button>
                            </>
                          )}
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
                </tbody>
              }
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-indigo-900 bg-indigo-300 ">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
