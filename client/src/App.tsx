import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { AccountType } from "./types/utils";
import { useContext } from "react";
import { AuthContext } from "./context/Auth/AuthContext";
import AdminDashboard from "./layout/AdminDashboard";

function App() {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={<Login accountType={AccountType.STUDENT} />}
          />
          <Route
            path="/login/admin"
            element={<Login accountType={AccountType.ADMIN} />}
          />
          <Route
            path="/login/faculty"
            element={<Login accountType={AccountType.FACULTY} />}
          />
          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route
              path="accounts"
              element={<h1 className="text-9xl font-bold">ACCOUNTS</h1>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      {userData ? <h1>USER FOUND</h1> : <h1>USER NOT FOUND</h1>}
    </>
  );
}

export default App;
