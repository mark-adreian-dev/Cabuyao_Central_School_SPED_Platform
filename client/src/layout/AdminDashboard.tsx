import type { JSX } from "react";
import { Outlet } from "react-router-dom";

const AdminDashboard: () => JSX.Element = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default AdminDashboard;
