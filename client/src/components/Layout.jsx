import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { getNavigation } from "../config/navigation";

const Layout = ({ user }) => {
  const navigation = getNavigation(user.role);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={user.role} navigation={navigation} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          name={`${user.last_name}, ${user.first_name}`}
          role={user.role}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
