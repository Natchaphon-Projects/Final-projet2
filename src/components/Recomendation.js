import React, { useState } from 'react';
import './Recomendation.css';
import { resultData } from './data/resultData'; // Import array ที่แยกมา
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sunglasscat from '../assets/cat-sunglass.jpg';

function Recomendation() {
    const [showFullTable, setShowFullTable] = useState(false);

    return (
        <div className="dashboard-container">
            <Header />
            <div className="recommendation-page">

                {/* Page Title */}
                <div className="recommendation-title">
                    ดูผลลัพธ์การประเมินของผู้ป่วย
                </div>

                {/* Patient Info Section */}
                <div className="recommendation-patient-section">
                    {/* Left: Icon + Name */}
                    <div className="patient-profile">
                        <img
                            src={Sunglasscat}
                            alt="Patient Avatar"
                            className="patient-icon-image"
                        />
                        <div className="patient-name-large">สันติ แซ่ลี</div>
                    </div>

                    {/* Middle: Patient Info */}
                    <div className="patient-info-box">
                        <div className="patient-info-title">ข้อมูลผู้ป่วย</div>
                        <div className="patient-info-item">HN: <span>1</span></div>
                        <div className="patient-info-item">อายุ: <span>3 ปี 3 เดือน</span></div>
                        <div className="patient-info-item">เพศ: <span>ชาย</span></div>
                    </div>

                    {/* Right: Medical Info */}
                    <div className="patient-info-box">
                        <div className="patient-info-title">ข้อมูลทางการแพทย์</div>
                        <div className="patient-info-item">น้ำหนัก: <span>13 กก.</span></div>
                        <div className="patient-info-item">ส่วนสูง: <span>94 ซม.</span></div>
                        <div className="patient-info-item">แพทย์ผู้ดูแล: <span>แพทย์มาตครั้ง</span></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="recommendation-action-buttons">
                    <button className="recommendation-action-btn">ดูประวัติเพิ่มเติม</button>
                    <button className="recommendation-action-btn">ดูประวัติการตรวจย้อนหลัง</button>
                    <button className="recommendation-action-btn">แก้ไขข้อมูลการซักประวัติ</button>
                </div>

                {/* Assessment Status */}
                <div className="recommendation-status">
                    <div className="status-text">อยู่ในเกณฑ์: แคระแกร็น (Stunting)</div>
                    <div className="status-subtext">Assessment Status</div>
                </div>

                {/* ผลการตรวจ Section */}
                <div className="recommendation-result-section">

                    <div className="result-header-row">
                        <div className="result-title">ผลการตรวจ :</div>

                        <div className="food-allergy-badge">
                            แพ้อาหาร: แพ้ถั่วเหลือง
                        </div>
                    </div>

                    {/* Wrapper → 2 ตาราง */}
                    <div className="result-table-wrapper">

                        {/* ตารางซ้าย (3/4) */}
                        <div className="result-table-block left">
                            <table className="result-table">
                                <thead>
                                    <tr>
                                        <th>ข้อมูล</th>
                                        <th>พฤติกรรมของผู้ป่วย</th>
                                        <th>ค่ามาตรฐาน</th>
                                        <th>คำแนะนำ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultData.slice(0, 5).map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.info}</td>
                                            <td>
                                                <span className={item.behaviorType === 'red' ? 'badge-red' : 'badge-green'}>
                                                    {item.behavior}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={item.calcType === 'red' ? 'badge-red' : 'badge-green'}>
                                                    {item.calc}
                                                </span>
                                            </td>
                                            <td>
                                                {item.advice.split('Stunting').map((part, i, arr) => (
                                                    i < arr.length - 1 ? (
                                                        <React.Fragment key={i}>
                                                            {part}
                                                            <span className="highlight-blue">Stunting</span>
                                                        </React.Fragment>
                                                    ) : part
                                                ))}
                                            </td>
                                        </tr>
                                    ))}

                                    {showFullTable && resultData.slice(5, 10).map((item, index) => (
                                        <tr key={index + 5}>
                                            <td>{item.info}</td>
                                            <td>
                                                <span className={item.behaviorType === 'red' ? 'badge-red' : 'badge-green'}>
                                                    {item.behavior}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={item.calcType === 'red' ? 'badge-red' : 'badge-green'}>
                                                    {item.calc}
                                                </span>
                                            </td>
                                            <td>
                                                {item.advice.split('Stunting').map((part, i, arr) => (
                                                    i < arr.length - 1 ? (
                                                        <React.Fragment key={i}>
                                                            {part}
                                                            <span className="highlight-blue">Stunting</span>
                                                        </React.Fragment>
                                                    ) : part
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* ปุ่ม toggle */}
                            <div style={{ margin: '16px 0', textAlign: 'center' }}>
                                <button
                                    className="recommendation-action-btn"
                                    onClick={() => setShowFullTable(!showFullTable)}
                                >
                                    {showFullTable ? 'ซ่อนเพิ่มเติม' : 'แสดงเพิ่มเติม'}
                                </button>
                            </div>
                        </div>

                        {/* ตารางขวา (1/4) */}
                        <div className="result-table-block right">
                            <table className="result-table">
                                <thead>
                                    <tr>
                                        <th>สาเหตุที่สนับสนุนให้เกิด</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>อะไรสักอย่าง</td>
                                    </tr>
                                    <tr>
                                        <td>อะไรสักอย่าง</td>
                                    </tr>
                                    <tr>
                                        <td>อะไรสักอย่าง</td>
                                    </tr>
                                    <tr>
                                        <td>อะไรสักอย่าง</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div> {/* end .result-table-wrapper */}

                </div> {/* end .recommendation-result-section */}

            </div> {/* end .recommendation-page */}
            <Footer />
        </div>
    );
}

export default Recomendation;
