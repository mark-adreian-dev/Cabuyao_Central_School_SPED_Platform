import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { AccountType } from "./types/utils";
import AdminDashboard from "./layout/AdminDashboard";
import AccountsPage from "./pages/Admin/AccountsPage";
import { useContext } from "react";
import { AuthContext } from "./context/Auth/AuthContext";
import FacultyDashboard from "./layout/FacultyDashboard";

function App() {
  const { userData } = useContext(AuthContext);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login Routes */}
          <Route path="*" element={<h1>404 page</h1>} />
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
          {/* Principal Dashboard */}
          {userData?.role == AccountType.PRINCIPAL && (
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route path="accounts" element={<AccountsPage />} />
            </Route>
          )}

          {/* Faculty Dashboard */}
          {userData?.role == AccountType.FACULTY && (
            <Route path="/faculty/dashboard" element={<FacultyDashboard />}>
              <Route path="accounts" element={<AccountsPage />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
