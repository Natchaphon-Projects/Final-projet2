import React from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";
import logo from "../assets/logo.png";
import ViewPatientResults from "./ViewPatientResults";

function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav>
          <ul className="nav-links">
            <li>
              <button className="nav-button" onClick={() => navigate("/doctor-dashboard")}>
                หน้าแรก
              </button>
            </li>
            <li>
              <button className="logout-button" onClick={() => navigate("/")}>
                ออกจากระบบ
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        <div className="user-info-header">
          <div className="profile-circle">NT</div>
          <div className="user-details">
            <p className="greeting">ยินดีต้อนรับ</p>
            <h2 className="role">บุคลากรทางการแพทย์</h2>
            <p className="username">น.พ. ณัชพล ทองอนันต์</p>
            <div className="underline" />
          </div>
        </div>

        {/* แสดงคอมโพเนนต์โดยตรง */}
        <div className="results-section">
          <ViewPatientResults />
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2023 - Project Hospital</p>
      </footer>
    </div>
  );
}

export default DoctorDashboard;
