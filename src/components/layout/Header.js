import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHospitalSymbol, FaSignOutAlt, FaHome, FaClipboardCheck } from "react-icons/fa";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="custom-header">
      <div className="header-left">
        <FaHospitalSymbol className="hospital-icon" />
        <span className="hospital-name">Project Hospital</span>
      </div>
      <div className="header-right">
        <button className="logout-btn" onClick={() => navigate("/")}>
          <FaSignOutAlt className="icon" />
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}

export default Header;
