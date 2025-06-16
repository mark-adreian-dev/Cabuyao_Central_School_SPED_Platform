import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { AccountType } from "./types/utils";
import AdminDashboard from "./layout/AdminDashboard";
import AccountsPage from "./pages/Admin/AccountsPage";
import { useContext } from "react";
import { AuthContext } from "./context/Auth/AuthContext";
import FacultyDashboard from "./layout/FacultyDashboard";
import StudentDashboard from "./layout/StudentDashboard";
import OTPVerificationPage from "./pages/OTPVerificationPage";

function App() {
  const { userData, isLoading } = useContext(AuthContext);
  return (
    <>
      <Routes>
        {/* Login Routes */}
        <Route path="*" element={!isLoading && <h1>404 page</h1>} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={<Login accountType={AccountType.STUDENT} />}
        />
        <Route
          path="/login/admin"
          element={<Login accountType={AccountType.PRINCIPAL} />}
        />
        <Route
          path="/login/faculty"
          element={<Login accountType={AccountType.FACULTY} />}
        />

       
        <Route path="/verify/account" element={<OTPVerificationPage />} /> :
         

        {/* Student Dashboard */}
        {userData?.role == AccountType.STUDENT && (
          <Route path="/student" element={<StudentDashboard />}>
            <Route path="dashboard" element={<AccountsPage />} />
          </Route>
        )}

        {/* Principal Dashboard */}
        {(userData?.role == AccountType.PRINCIPAL && userData?.email_verified_at !== null) && (
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<AccountsPage />} />
          </Route>
        )}

        {/* Faculty Dashboard */}
        {(userData?.role == AccountType.FACULTY && userData?.email_verified_at !== null) && (
          <Route path="/faculty" element={<FacultyDashboard />}>
            <Route path="dashboard" element={<AccountsPage />} />
          </Route>
        )}
      </Routes>
    </>
  );
}

export default App;
