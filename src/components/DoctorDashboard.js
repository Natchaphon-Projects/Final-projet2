import React from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";
import logo from "../assets/logo.png";
import ViewPatientResults from "./ViewPatientResults";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header />

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
      <Footer />
    </div>
  );
}

export default DoctorDashboard;
