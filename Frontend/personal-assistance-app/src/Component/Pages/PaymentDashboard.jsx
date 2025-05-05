import React from "react";
import "./../../Styles/paymentStyle.css";
import SideNavBar from "../UI/SideNavBar";
import PaymentStack from "../UI/PaymentStack";
import { Outlet, useLocation } from "react-router-dom";

const PaymentDashboard =() =>  {
  const location = useLocation();

  //check current route
  const isPaymentPath = location.pathname === "/payment";

  return (
    <div className="dashboard-container flex min-h-screen gap-5 relative ">
      {/*<div className="fixed left-0 top-0 h-full w-1/5 text-white z-50">
        <SideNavBar />
      </div>
      <div className="flex-1 flex justify-center items-center min-h-screen ml-[20%] ">
        <PaymentStack />
      </div>*/}
      <div className="min-h-screen w-full flex flex-col ml-[5%] mr-[60px] -mt-[50px]">
        <SideNavBar />
      </div>
      <div className="flex-grow max-w-4xl p-4  mt-[20px] ml-[50%]">
        {isPaymentPath ? <PaymentStack /> : <Outlet />}
      </div>
    </div>
  );
}

export default PaymentDashboard;
