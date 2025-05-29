import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import logo from "../assets/logo.png";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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
      <Header />

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

      <Footer />
    </div>
  );
}

export default AdminDashboard;
