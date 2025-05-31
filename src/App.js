import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from "./RoleSelectionPage"; // ✅ หน้าแรก Landing
import LoginPage from "./LoginPage";
import OTPLogin from "./OTPLogin";
import EnterOTP from "./EnterOTP";
import ParentDashboard from "./components/ParentDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ManageDepartment from "./components/ManageDepartment";
import ManageParentDepartment from "./components/ManageParentDepartment";
import ManageDoctorDepartment from "./components/ManageDoctorDepartment";
import EditPatient from "./components/EditPatient";
import AddPatient from "./components/AddPatient";
import ViewPatientResults from "./components/ViewPatientResults";
import PatientAssessmentResult from "./components/PatientAssessmentResult";
import PatientDetails from "./components/PatientDetails";
import RiskAssessmentEdit from "./components/RiskAssessmentEdit";
import RiskAssessment from "./components/RiskAssessment";
import GroupedDataInput from "./components/GroupedDataInput";
import GeneralForm from "./components/Form/GeneralForm";
import CaregiverForm from "./components/Form/CaregiverForm";
import NutritionForm from "./components/Form/NutritionForm";
import SanitationForm from "./components/Form/SanitationForm";
import Recommendations from "./components/Recommendations";
import PatientHistory from "./components/PatientHistory";
import PredictionModel from "./components/Predictio_model/PredictionModel"; // ✅ เพิ่มตรงนี้
import ParentRiskSelection from "./components/ParentRiskSelection"; // ✅ ต้อง import ตรงนี้

import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<RoleSelectionPage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp-login" element={<OTPLogin />} />
        <Route path="/enter-otp" element={<EnterOTP />} />

        {/* Parent Routes */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/parent-risk-selection" element={<ParentRiskSelection />} />
        <Route path="/parent-risk-assessment" element={<GroupedDataInput />} />
        <Route path="/form/general" element={<GeneralForm />} />
        <Route path="/form/caregiver" element={<CaregiverForm />} />
        <Route path="/form/nutrition" element={<NutritionForm />} />
        <Route path="/form/sanitation" element={<SanitationForm />} />
        <Route path="/parent-recommendations" element={<Recommendations />} />
        <Route path="/pre" element={<PredictionModel />} /> {/* ✅ เพิ่ม route ไปยังหน้าผลประเมิน */}

        {/* Doctor Routes */}
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/view-results" element={<ViewPatientResults />} />
        <Route path="/patient-details/:id" element={<PatientDetails />} />
        <Route path="/edit-assessment/:id" element={<RiskAssessmentEdit />} />
        <Route path="/patient-history" element={<PatientHistory />} />
        <Route path="/patient-assessment/:id" element={<PatientAssessmentResult />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-department" element={<ManageDepartment />} />
        <Route path="/manage-parents" element={<ManageParentDepartment />} />
        <Route path="/manage-doctors" element={<ManageDoctorDepartment />} />
        <Route path="/edit-patient/:id" element={<EditPatient />} />
        <Route path="/add-patient" element={<AddPatient />} />
      </Routes>
    </Router>
  );
}

export default App;
