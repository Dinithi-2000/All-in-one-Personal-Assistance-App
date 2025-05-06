import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./../../Styles/navbar.css";
import { Link } from "react-router-dom";
function SideNavBar() {
  return (
    <div className="main_contatent">
      <input type="checkbox" id="check"></input>
      <div className="btn_one">
        <label htmlFor="check">
          <i className="fa fa-bars"></i>
        </label>
      </div>

      <div className="sideBar_menu">
        <div className="logo"></div>

        <div className="btn_two">
          <label htmlFor="check">
            <i className="fa fa-times"></i>
          </label>
        </div>

        <div className="menu">
          <ul>
            <li>
              <Link to="/payment">
                <i className="fa fa-home"></i>DashBoard
              </Link>
            </li>
            <li>
              <Link to="/payment/MakePayment">
                <i className="fa fa-home"></i>Monthly Service Payment
              </Link>
            </li>
            <li>
              <Link to="/payment/RefundHistory">
                <i className="fa fa-credit-card"></i>Refund Service Payment
              </Link>
            </li>
            <li>
              <Link to="/payment/PaymentHistory">
                <i className="fa fa-credit-card"></i>Payment History
              </Link>
            </li>

            <li>
              <a href="#">
                <i className="fa fa-ban"></i>Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideNavBar;
