import { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("/user/login", credentials);
      const { user, token } = response.data;
      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);
      console.log(user);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const studentLogin = async (studentNumber, password) => {
    return login({
      student_id: studentNumber.toString(),
      password: password,
      role: "STUDENT",
    });
  };

  const facultyLogin = async (email, password) => {
    return login({
      email: email,
      password: password,
      role: "FACULTY",
    });
  };

  const principalLogin = async (email, password) => {
    return login({
      email: email,
      password: password,
      role: "PRINCIPAL",
    });
  };

  const logout = async () => {
    console.log(sessionStorage.getItem("token"));
    await axios.post("/user/logout");

    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        studentLogin,
        facultyLogin,
        principalLogin,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
