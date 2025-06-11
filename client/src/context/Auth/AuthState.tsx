import React, { useReducer, type ReactNode } from "react";
import AuthReducer from "./AuthReducer";
import { authInitalValue, AuthContext } from "./AuthContext";
import { type LoginFormInterface } from "@/types/utils";
import api, { setCSRFHeader } from "@/lib/api";
import { ResponseStatus, type LoginSuccessResponse } from "@/types/response";
import axios from "axios";

interface Props {
  children: ReactNode;
}
interface ErrorResponse {
  message: string;
}

const AuthState: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(AuthReducer, authInitalValue);

  const resetAuthState = () => {
    setTimeout(() => {
      authDispatch({ type: "RESET_AUTH_STATUS" });
    }, 1000);
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";

      authDispatch({
        type: "ERROR_LOGIN",
        payload: {
          errorMessage: message,
        },
      });

      resetAuthState();
    } else {
      // Fallback for unexpected error types
      authDispatch({
        type: "ERROR_LOGIN",
        payload: {
          errorMessage: "An unexpected error occurred",
        },
      });

      resetAuthState();
    }
  };

  const login = async (credentials: LoginFormInterface) => {
    try {
      await api.get("sanctum/csrf-cookie");
      setCSRFHeader();
      const response = await api.post("/api/user/login", credentials);
      console.log(response.data);
      if (response.status == ResponseStatus.SUCCESS) {
        const data: LoginSuccessResponse = response.data;
        authDispatch({
          type: "LOGIN",
          payload: {
            userData: data.user,
            successMessage: data.message,
          },
        });
        resetAuthState();
      }

      return response.status;
    } catch (error) {
      handleError(error);
    }
  };

  const logout = async () => {
    try {
      // await api.get("sanctum/csrf-cookie");
      // setCSRFHeader();
      const response = await api.post("/api/user/logout");
      console.log(response.data);
      if (response.status == ResponseStatus.SUCCESS) {
        authDispatch({ type: "LOGOUT" });
        resetAuthState();
        return response.status;
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        successMessage: authState.successMessage,
        errorMessage: authState.errorMessage,
        isError: authState.isError,
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
