import React from "react";
import "./../../Styles/paymentStyle.css";
import SideNavBar from "../UI/SideNavBar";
import PaymentStack from "../UI/PaymentStack";

export default function PaymentDashboard() {
  return (
    <div className="dashboard-container flex min-h-screen gap-5 relative ">
      {/*<div className="fixed left-0 top-0 h-full w-1/5 text-white z-50">
        <SideNavBar />
      </div>
      <div className="flex-1 flex justify-center items-center min-h-screen ml-[20%] ">
        <PaymentStack />
      </div>*/}
      <div className="nav">
        <SideNavBar />
      </div>
      <div className="stackcontent">
        <PaymentStack />
      </div>
    </div>
  );
}
