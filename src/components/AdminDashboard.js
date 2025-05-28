import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";
import {
  FaChild,
  FaUserShield,
  FaUserMd
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminMenus = [
    {
      icon: <FaChild />,
      title: "การจัดการข้อมูลเด็ก",
      description: "Manage Pediatric Department",
      onClick: () => navigate("/manage-department"),
      color: "blue",
    },
    {
      icon: <FaUserShield />,
      title: "การจัดการข้อมูลผู้ปกครอง",
      description: "Manage Parents Department",
      onClick: () => navigate("/manage-parents"),
      color: "orange",
    },
    {
      icon: <FaUserMd />,
      title: "การจัดการข้อมูลหมอ",
      description: "Manage Doctors Department",
      onClick: () => navigate("/manage-doctors"),
      color: "purple",
    },
  ];

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
        <div className="user-info-header">
          <div className="profile-circle">NT</div>
          <div className="user-details">
            <p className="greeting">ยินดีต้อนรับ</p>
            <h2 className="role">ผู้ดูแลระบบ</h2>
            <p className="username">คุณ ณัชพล ทองอนันต์</p>
            <div className="underline" />
          </div>
        </div>

        <div className="menu-container">
          {adminMenus.map((item, index) => (
            <div key={index} className="menu-item" onClick={item.onClick}>
              <div className={`icon-circle ${item.color}`}>{item.icon}</div>
              <p className="menu-title">{item.title}</p>
              <small className="menu-description">{item.description}</small>
            </div>
          ))}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>© 2023 - Project Hospital</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
