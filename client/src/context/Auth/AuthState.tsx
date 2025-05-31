import React, { useReducer, type ReactNode } from "react";
import AuthReducer from "./AuthReducer";
import { authInitalValue, AuthContext } from "./AuthContext";

interface Props {
  children: ReactNode;
}

const AuthState: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(AuthReducer, authInitalValue);

  const login = () => {
    authDispatch({ type: "LOGOUT" });
  };
  const logout = () => {};

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        isLoggedIn: authState.isLoggedIn,
        userData: authState.userData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
