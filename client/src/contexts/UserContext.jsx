import { createContext, useContext, useState } from "react";
import axios from "./axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const studentLogin = async (studentNumber, password) => {
    try {
      console.log("password in method" + password);

      const response = await axios.post("/user/login", {
        email: "",
        student_id: studentNumber.toString(),
        password: password,
        role: "STUDENT",
      });
      setUser(response.data.user);
      sessionStorage.setItem("token", response.data.token);
      console.log(response.data.user);
      console.log(response.data.token);
      return response;
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    await axios.post("/logout");
    setUser(null);
    sessionStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, studentLogin, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
