import React, { useReducer, type ReactNode } from "react";
import AuthReducer from "./AuthReducer";
import { authInitalValue, AuthContext } from "./AuthContext";
import { AccountType, type LoginFormInterface } from "@/types/utils";
import api, { resetAuthToken, setAuthToken } from "@/lib/api";
import { ResponseStatus, type FacultyResponse, type LoginSuccessResponse, type PrincipalResponse, type StudentResponse } from "@/types/response";
import axios from "axios";
import type { User } from "@/types/models";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}
interface ErrorResponse {
  message: string;
}

//milliseconds
const AUTH_STATE_TIMEOUT = 2500

const AuthState: React.FC<Props> = ({ children }) => {
  const [authState, authDispatch] = useReducer(AuthReducer, authInitalValue);
  const navigate = useNavigate();

  const resetAuthState = () => {
    setTimeout(() => {
      authDispatch({ type: "RESET_AUTH_STATUS" });
    }, AUTH_STATE_TIMEOUT);
  };
  const handleError = (error: unknown) => {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      const message = error.response?.data?.message || error.message || "Unknown error";

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

    return
  };
  const redirectUserToLogin = (userRole: AccountType) => {
    if (userRole === AccountType.PRINCIPAL) navigate("/login/admin");
    else if (userRole === AccountType.FACULTY) navigate("/login/faculty");
    else if (userRole === AccountType.STUDENT) navigate("/login");
    else navigate("/login");
  }
  const authRedirect = (user: User) => {
    if (user.email_verified_at === null && user.role !== AccountType.STUDENT) {
      navigate("/verify/account");
    } else {
      switch (user.role) {
        case AccountType.STUDENT:
          navigate("/student/dashboard");
          break;
        case AccountType.PRINCIPAL:
          navigate("/admin/dashboard");
          break;
        case AccountType.FACULTY:
          navigate("/faculty/dashboard");
          break;
      }
    }
  }
  const login = async (credentials: LoginFormInterface) => {
    authDispatch({ type: "SET_IS_LOADING" });
    try {
      console.log("Sending login request...")
      const response = await api.post("/api/user/login", credentials);
      console.log(response)
      if (response.status == ResponseStatus.SUCCESS) {
        const data: LoginSuccessResponse = response.data;
        setAuthToken(data.token);
        authDispatch({
          type: "LOGIN",
          payload: {
            token: data.token,
            successMessage: data.message,
          },
        });
        await loadUser()
        return ResponseStatus.SUCCESS
      } else {
        return ResponseStatus.INTERNAL_SERVER_ERROR;
      }

    } catch (error) {    
      handleError(error);
      return ResponseStatus.UNAUTHORIZED
    }
  };
  const logout = async () => {
    try {
      const response = await api.post("/api/user/logout");
      if (response.status == ResponseStatus.SUCCESS && authState.userData) {
        authDispatch({ type: "LOGOUT" });

        resetAuthToken();
        resetAuthState();

        //overriding interaction flow of shadcn
        //Enabling click interaction upon logout !!DO NO REMOVE AT ALL COST
        const bodyTag = document.getElementsByTagName("body")[0];
        bodyTag.style.pointerEvents = "auto";

        const userRole = authState.userData.role;
        redirectUserToLogin(userRole); 

      }   
    } catch (error) {
      handleError(error);
    }
  };
  const loadUser = async () => {
    try {
      const userResponse = await api.get("/api/user");
      const user: User = userResponse.data;
      const roleData = await loadRoleData(user.id, user.role);
    
      if (roleData) {
        authDispatch({
          type: "LOAD_USER",
          payload: {
            user: user,
            roleData: roleData,
          },
        });
        authRedirect(user);
      }  
    } catch (err) {
      handleError(err);
    }
  };

  const loadRoleData = async (userId: number, role: AccountType) => {
    let endpoint = ""
    if (role === AccountType.STUDENT) endpoint = `/api/user/student-data/${userId}`;
    if (role === AccountType.FACULTY) endpoint = `/api/user/faculty/${userId}`;
    if (role === AccountType.PRINCIPAL) endpoint = `/api/user/admin/${userId}`;

    const response = await api.get(endpoint)  
    const roleData: StudentResponse | FacultyResponse | PrincipalResponse = response.data
    if (response.status === ResponseStatus.SUCCESS) {
      return roleData;
    } else {
      return null
    }
  }

  const sendEmailVerification = async (userId: number) => {
    try {
      authDispatch({ type: "SET_IS_LOADING" })
      const response = await api.post(
        `/api/user/send-email-verification/${userId}`
      );

      if (response.status === ResponseStatus.SUCCESS) {
        authDispatch({
          type: "REQUEST_SUCCESS",
          payload: {
            successMessage: response.data.message,
          },
        });
        resetAuthState()
        return ResponseStatus.SUCCESS
      } else {
          return ResponseStatus.INTERNAL_SERVER_ERROR;
      }
    } catch (err) { 
      handleError(err)
      return ResponseStatus.BAD_REQUEST;
    }
  };
  const verifyAccount = async (
    userData: User,
    code: string
  ) => {
    try {
      const response = await api.post(`/api/user/verify-email/${userData.id}`, {
        code,
      });
      if (response.status === ResponseStatus.SUCCESS) {
        return ResponseStatus.SUCCESS
      } else if (response.status === ResponseStatus.NOT_FOUND){
        return ResponseStatus.NOT_FOUND
      } else {
        return ResponseStatus.INTERNAL_SERVER_ERROR
      }
    } catch (err) {
      handleError(err)
      return ResponseStatus.BAD_REQUEST;
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
        authRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
