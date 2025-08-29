import {
  FaHome,
  FaBook,
  FaTasks,
  FaChartBar,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

const studentNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: FaHome },
  { name: "Lessons", href: "/lessons", icon: FaBook },
  { name: "Activities", href: "/activities", icon: FaTasks },
  { name: "Progress", href: "/progress", icon: FaChartBar },
];

const guardianNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: FaHome },
  { name: "Child's Progress", href: "/child-progress", icon: FaChartBar },
  { name: "Child's Activities", href: "/child-activities", icon: FaTasks },
];

const facultyNavigation = [
  { name: "Dashboard", href: "/faculty/dashboard", icon: FaHome },
  { name: "My Sections", href: "/faculty/sections", icon: FaUsers },
  { name: "Lessons", href: "/faculty/lessons", icon: FaBook },
  { name: "Activities", href: "/activities", icon: FaTasks },
];

const principalNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: FaHome },
  { name: "Manage Students", href: "/manage-students", icon: FaUsers },
  { name: "Manage Faculty", href: "/manage-faculty", icon: FaUserShield },
  { name: "School Analytics", href: "/school-analytics", icon: FaChartBar },
];

export const getNavigation = (role) => {
  switch (role) {
    case "STUDENT":
      return studentNavigation;
    case "GUARDIAN":
      return guardianNavigation;
    case "FACULTY":
      return facultyNavigation;
    case "PRINCIPAL":
      return principalNavigation;
    default:
      return [];
  }
};
