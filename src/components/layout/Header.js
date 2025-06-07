import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHospitalSymbol, FaSignOutAlt,FaHome } from "react-icons/fa";
import "./Header.css";

function Header({ currentPage }) {
  const navigate = useNavigate();

  // Mapping: currentPage → Path ที่จะกลับ
  const pageToPath = {
    "manage-department": "/admin-dashboard",
    "form-nutrition": "/parent-dashboard",
    "manage-doctors": "/manage-doctors",
    "manage-parents": "/manage-parents"
  };

  // Mapping: currentPage → "ชื่อปุ่ม"
  const pageToButtonLabel = {
    "manage-department": "กลับหน้าหลัก",
    "form-nutrition": "กลับหน้าหลัก",
    "manage-doctors": "กลับแดชบอร์ด",
    "manage-parents": "ย้อนกลับ"
  };

  const handleLogoClick = () => {
    const targetPath = pageToPath[currentPage] || "/";
    navigate(targetPath);
  };

  return (
    <header className="custom-header">
      <div className="header-left" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        <FaHospitalSymbol className="hospital-icon" />
        <span className="hospital-name">Healthy Kid</span>
      </div>

      <div className="header-right">
        {pageToPath[currentPage] && (
          <button className="menu-btn" onClick={() => navigate(pageToPath[currentPage])}>
            <FaHome size={24} />
            {pageToButtonLabel[currentPage]}
          </button>
        )}
        

        <button className="logout-btn" onClick={() => navigate("/")}>
          <FaSignOutAlt size={24} />
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}

export default Header;
