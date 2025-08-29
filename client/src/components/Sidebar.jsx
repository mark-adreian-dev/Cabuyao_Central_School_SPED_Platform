import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { UserContext } from "../contexts/UserContext";

const Sidebar = ({ role, navigation }) => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isStudentOrGuardian = role === "STUDENT" || role === "GUARDIAN";
  console.log(role);

  const bgColor = isStudentOrGuardian ? "bg-white" : "bg-brand-green";
  const textColor = isStudentOrGuardian ? "text-brand-black" : "text-white";
  const hoverBgColor = isStudentOrGuardian
    ? "hover:bg-gray-200"
    : "hover:bg-green-700";
  const activeBgColor = isStudentOrGuardian ? "bg-gray-300" : "bg-green-800";

  const handleLogout = async () => {
    await logout();
    switch (role) {
      case "STUDENT":
        navigate("/login");
        break;
      case "FACULTY":
        navigate("/faculty/login");
        break;
      case "GUARDIAN":
        navigate("/guardian/login");
        break;
      case "PRINCIPAL":
        navigate("/principal/login");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <>
      <div className="md:hidden p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-brand-black">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <aside
        className={`transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative h-full w-64 ${bgColor} ${textColor} shadow-lg z-20 flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center md:hidden">
          <h2 className="text-xl font-bold font-roboto">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="mt-8 flex flex-col justify-between flex-1">
          <ul>
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center p-4 my-2 mx-4 rounded-lg transition-colors duration-200 ${hoverBgColor} ${
                      isActive ? activeBgColor : ""
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-4" size={20} />
                  <span className="font-poppins">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center p-4 my-2 mx-4 rounded-lg rounded-r-none transition-colors duration-200 w-full bg-red-500 hover:bg-red-700 hover:cursor-pointer`}
            >
              <FaSignOutAlt className="mr-4" size={20} />
              <span className="font-poppins">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
