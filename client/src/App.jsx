import { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { UserProvider, UserContext } from "./contexts/UserContext";
import { ActivityProvider } from "./contexts/ActivityContext.jsx";
import { LessonProvider } from "./contexts/LessonContext.jsx";
import { SectionProvider } from "./contexts/SectionContext.jsx";
import StudentLogin from "./pages/auth/StudentLogin.jsx";
import FacultyLogin from "./pages/auth/FacultyLogin.jsx";
import Layout from "./components/Layout.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import GuardianDashboard from "./pages/GuardianDashboard.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import PrincipalDashboard from "./pages/PrincipalDashboard.jsx";
import FacultySections from "./pages/FacultySections.jsx";
import SectionDetails from "./pages/SectionDetails.jsx";
import FacultyLessons from "./pages/FacultyLessons.jsx";
import LessonDetails from "./pages/LessonDetails.jsx";

const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Layout user={user} /> : <Navigate to="/login" />;
};

const DashboardRedirect = () => {
  const { user } = useContext(UserContext);

  const getDashboardByRole = (role) => {
    switch (role) {
      case "STUDENT":
        return "/student/dashboard";
      case "GUARDIAN":
        return "/guardian/dashboard";
      case "FACULTY":
        return "/faculty/dashboard";
      case "PRINCIPAL":
        return "/principal/dashboard";
      default:
        return "/login";
    }
  };

  return <Navigate to={getDashboardByRole(user?.role)} />;
};

function App() {
  return (
    <BrowserRouter>
      <ActivityProvider>
        <LessonProvider>
          <UserProvider>
            <SectionProvider>
              <Routes>
                <Route path="/login" element={<StudentLogin />} />
                <Route path="/faculty/login" element={<FacultyLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardRedirect />} />
                  <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                  />
                  <Route
                    path="/guardian/dashboard"
                    element={<GuardianDashboard />}
                  />
                  <Route
                    path="/faculty/dashboard"
                    element={<FacultyDashboard />}
                  />
                  <Route
                    path="/principal/dashboard"
                    element={<PrincipalDashboard />}
                  />
                  <Route
                    path="/faculty/sections"
                    element={<FacultySections />}
                  />
                  <Route
                    path="/faculty/sections/:id"
                    element={<SectionDetails />}
                  />
                  <Route path="/faculty/lessons" element={<FacultyLessons />} />
                  <Route
                    path="/faculty/lessons/:id"
                    element={<LessonDetails />}
                  />
                </Route>
              </Routes>
            </SectionProvider>
          </UserProvider>
        </LessonProvider>
      </ActivityProvider>
    </BrowserRouter>
  );
}

export default App;
