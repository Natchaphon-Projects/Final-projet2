import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import logo from "../assets/logo.png"; // Hospital logo
import profileImage from "../assets/admin.jpg"; // Admin profile image
import managePediatricsIcon from "../assets/baby-boy.png"; // Icon for managing pediatric department
import manageParentsIcon from "../assets/manage.png"; // Icon for managing parents department
import manageDoctorsIcon from "../assets/doctor.png"; // Icon for managing doctors department

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav>
          <ul className="nav-links">
            <li>
              <button className="nav-button" onClick={() => navigate("/admin-dashboard")}>
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

      <main className="dashboard-main">
        <div className="header-content">
          <div className="user-info-left">
            <p>ยินดีต้อนรับ</p>
            <h1>ผู้ดูแลระบบ</h1>
          </div>
          <div className="profile-container-right">
            <img src={profileImage} alt="Admin Profile" className="profile-image" />
          </div>
        </div>

        <div className="centered-user-name">ผู้ดูแลระบบ ณัชพล ทองอนันต์</div>

        <div className="menu-container">
          <div className="menu-item" onClick={() => navigate("/manage-department")}>
            <img src={managePediatricsIcon} alt="Manage Pediatric Department" className="menu-icon" />
            <p className="menu-title">การจัดการข้อมูลเด็ก</p>
            <small className="menu-description">Manage Pediatric Department</small>
          </div>

          <div className="menu-item" onClick={() => navigate("/manage-parents")}>
            <img src={manageParentsIcon} alt="Manage Parents Department" className="menu-icon" />
            <p className="menu-title">การจัดการข้อมูลผู้ปกครอง</p>
            <small className="menu-description">Manage Parents Department</small>
          </div>

          <div className="menu-item" onClick={() => navigate("/manage-doctors")}>
            <img src={manageDoctorsIcon} alt="Manage Doctors Department" className="menu-icon" />
            <p className="menu-title">การจัดการข้อมูลหมอ</p>
            <small className="menu-description">Manage Doctors Department</small>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>© 2023 - Project Hospital</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
