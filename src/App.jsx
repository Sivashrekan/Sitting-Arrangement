import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './login';
import Register from './register';
import Forgot from './forgot';
import OtpPage from './otpscreen';
import Homepage from './pages/homepage';
import AdminPage from './pages/adminpage';
import AdminProfile from './pages/adminprofile';
import AddDepartment from './pages/addDepartment';
import ViewDepartments from './pages/viewDepartment';
import AddStaff from './pages/addStaff';
import ViewStaff from './pages/viewStaff';
import AddExam from './pages/addExam';
import ViewExams from './pages/viewExams';
import AddHall from './pages/addHalls';
import ViewHalls from './pages/viewHalls';
import EditHall from './pages/editHall';
import HallView from './pages/hallView';
import AddStudent from './pages/addStudent';
import ViewStudents from './pages/viewStudents';
import EditStudent from "./Operations/editStudent";
import EditStaff from './Operations/editStaff';
import ViewStaffLog from './pages/viewStaffLog';
import EditAdmin from './Operations/editAdmin';
import ChangePassword from './Operations/changePassword';
import ViewAdminLog from './pages/adminLog';
import CreateSeating from './Operations/createSeating';
import ViewSeating from './Operations/viewSeating';
import StudentLogin from './Operations/studentLogin';
import StudentDashboard from './Operations/studentDashboard';
import StaffLogin from './Operations/staffLogin';
import StaffForgotPassword from './Operations/staffForgotpage';
import StaffOTP from './Operations/otpstaff';
import StaffDashboard from './staffs/staffdashboard';
import StaffProfile from './staffs/staffProfile';
import StaffEdit from './staffs/staffEdit';
import StaffChangePassword from './staffs/staffPasswordChange';
import StaffViewStudents from './staffs/staffviewstudents';
import StaffViewExams from './staffs/staffviewExams';
import StaffViewStaff from './staffs/staffviewstaff';
import StaffViewHalls from './staffs/staffviewHalls';
import StaffHallView from './staffs/staffHallview';
import StaffViewSeating from './staffs/staffseatingview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/staff-forgot-password" element={<StaffForgotPassword />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/adminlog" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/change-password/:admin_id" element={<ChangePassword />} />
        <Route path="/admin-profile" element={<AdminProfile/>} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/view-staff" element={<ViewStaff />} />
        <Route path="/view-exams" element={<ViewExams />} />
        <Route path="/admin-log" element={<ViewAdminLog />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/add-exam" element={<AddExam />} />
        <Route path="/edit-student/:student_id" element={<EditStudent />} />
        <Route path="/edit-staff/:staff_id" element={<EditStaff />} />
        <Route path="/edit-admin/:admin_id" element={<EditAdmin />} />
        <Route path="/add-hall" element={<AddHall />} />
        <Route path="/create-seating" element={<CreateSeating />} />
        <Route path="/view-seating" element={<ViewSeating />} />
        <Route path='/' element={<Homepage/>} />
        <Route path="/view-hall/:hall_id" element={<HallView />} />
        <Route path="/view-staff-log" element={<ViewStaffLog />} />
        <Route path='/view-dept' element={<ViewDepartments/>} />
        <Route path='/view-halls' element={<ViewHalls/>} />
        <Route path='/view-students' element={<ViewStudents/>} />
        <Route path="/edit-hall/:hall_id" element={<EditHall />} />
        <Route path="/add-students" element={<AddStudent />} />
        <Route path="/staff-otp" element={<StaffOTP />} />
        <Route path='/add-dept' element={<AddDepartment/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        {/* Staffs */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff-profile" element={<StaffProfile />} />
        <Route path="/staff-edit/:staff_id" element={<StaffEdit />} />
        <Route path="/staff-change-password/:staff_id" element={<StaffChangePassword />} />
        <Route path="/staff/view-students" element={<StaffViewStudents />} />
        <Route path="/staff/view-exams" element={<StaffViewExams />} />
        <Route path="/staff/view-staff" element={<StaffViewStaff />} />
        <Route path="/staff/view-halls" element={<StaffViewHalls />} />
        <Route path="/staff/view-hall/:hall_id" element={<StaffHallView />} />
        <Route path="/staff/view-seating" element={<StaffViewSeating />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
