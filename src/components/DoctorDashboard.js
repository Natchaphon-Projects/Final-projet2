import React from "react";
import "./DoctorDashboard.css";
import ViewPatientResults from "./ViewPatientResults"; // นำเข้าคอมโพเนนต์
import logo from "../assets/logo.png";
import profileImage from "../assets/doctor.jpg";

function DoctorDashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav>
          <ul className="nav-links">
            <li>
              <button className="nav-button">หน้าแรก</button>
            </li>
            <li>
              <button className="logout-button">ออกจากระบบ</button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="dashboard-main">
        <div className="header-content">
          <div className="user-info-left">
            <p>ยินดีต้อนรับ</p>
            <h1>บุคลากรทางการแพทย์</h1>
          </div>
          <div className="profile-container-right">
            <img src={profileImage} alt="Doctor Profile" className="profile-image" />
          </div>
        </div>

        <div className="centered-user-name">น.พ. ณัชพล ทองอนันต์</div>

        {/* แสดงคอมโพเนนต์ ViewPatientResults โดยตรง */}
        <ViewPatientResults />
      </main>

      <footer className="dashboard-footer">
        <p>© 2023 - Project Hospital</p>
      </footer>
    </div>
  );
}

export default DoctorDashboard;
