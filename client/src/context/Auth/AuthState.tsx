import React, { useReducer, type ReactNode } from "react";
import AuthReducer from "./AuthReducer";
import { authInitalValue, AuthContext } from "./AuthContext";
import { AccountType, type LoginFormInterface } from "@/types/utils";
import api, { resetAuthToken, setAuthToken } from "@/lib/api";
import { ResponseStatus, type LoginSuccessResponse } from "@/types/response";
import axios, { AxiosError, type AxiosResponse } from "axios";
import type { User } from "@/types/models";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}
interface ErrorResponse {
  message: string;
}

const AuthState: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(AuthReducer, authInitalValue);
  const navigate = useNavigate();
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
    authDispatch({ type: "SET_IS_LOADING" });
    try {
      const response = await api.post("/api/user/login", credentials);
      if (response.status == ResponseStatus.SUCCESS) {
        const data: LoginSuccessResponse = response.data;
        console.log(data.message);
        setAuthToken(data.token);
        authDispatch({
          type: "LOGIN",
          payload: {
            token: data.token,
            successMessage: data.message,
          },
        });
        resetAuthState();
      }
      await loadUser();
    } catch (error) {
      handleError(error);
    }
  };

  const logout = async () => {
    authDispatch({ type: "SET_IS_LOADING" });
    try {
      const response = await api.post("/api/user/logout");
      if (response.status == ResponseStatus.SUCCESS) {
        authDispatch({ type: "LOGOUT" });

        resetAuthToken();
        resetAuthState();

        //overriding interaction flow of shadcn
        //Enabling click interaction upon logout !!DO NO REMOVE AT ALL COST
        const bodyTag = document.getElementsByTagName("body")[0];
        bodyTag.style.pointerEvents = "auto";

        const userRole: AccountType | null | undefined =
          authState.userData?.role;
        if (userRole === AccountType.PRINCIPAL) navigate("/login/admin");
        else if (userRole === AccountType.FACULTY) navigate("/login/faculty");
        else if (userRole === AccountType.STUDENT) navigate("/login");
        else navigate("/login");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const loadUser = async () => {
    console.log("Loading user data...");
    const response = await api.get("/api/user");
    const user: User = response.data;
    console.log(
      "USER: ",
      `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`
    );
    console.log("ROLE: ", `${user.role.toUpperCase()}`);
    authDispatch({
      type: "LOAD_USER",
      payload: {
        user: user,
      },
    });

    if (user.email_verified_at === null) {
      navigate("/verify/account");
    } else {
      if (user.role == AccountType.PRINCIPAL) {
        navigate("/admin/dashboard/accounts");
      } else if (user.role == AccountType.FACULTY) {
        navigate("/faculty/dashboard/accounts");
      }
    }
  };

  const sendEmailVerification = async (userId: number | undefined) => {
    if (!userId) return;
    try {
      const response = await api.post(
        `/api/user/send-email-verification/${userId}`
      );
      if (response.status === ResponseStatus.SUCCESS) {
        authDispatch({ type: "SET_IS_OTP_SENT" });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        authDispatch({ type: "RESET_AUTH_STATUS" });
      }
    }
  };

  const verifyAccount = async (
    userData: User | undefined,
    code: string | undefined
  ): Promise<AxiosResponse | AxiosError> => {
    if (!userData) throw new Error("Cannot identify target user");

    try {
      const response = await api.post(`/api/user/verify-email/${userData.id}`, {
        code,
      });
      return response;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return err; // let the caller catch it
      }
      throw new Error("Unknown error occurred");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        isLoading: authState.isLoading,
        isLoggedIn: authState.isLoggedIn,
        successMessage: authState.successMessage,
        errorMessage: authState.errorMessage,
        isError: authState.isError,
        userData: authState.userData,
        login,
        logout,
        loadUser,
        sendEmailVerification,
        verifyAccount,
        authDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
