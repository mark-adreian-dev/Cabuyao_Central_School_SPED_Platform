import React from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/Logo.png";

const Header = ({ name, role }) => {
  const isStudentOrGuardian = role === "student" || role === "guardian";

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="Cabuyao Central School SPED Platform Logo"
          className="w-12 h-12"
        />
        <p className="font-bold font-roboto hidden md:block">
          Cabuyao Central Elementary School
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center space-x-8 md:space-x-16 ${
            isStudentOrGuardian
              ? "text-brand-green"
              : "bg-brand-green text-white px-4 py-2 rounded-full"
          }`}
        >
          <FaUserCircle size={36} />
          <div className="text-right">
            <p className="font-bold font-roboto">{name}</p>
            <p className="font-poppins text-xs">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
