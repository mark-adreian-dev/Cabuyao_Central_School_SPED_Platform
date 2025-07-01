import type { Faculty, Principal, Student, User } from "@/types/models";
import type { AuthContextInitialValue } from "./AuthContext";
import type { FacultyResponse, PrincipalResponse, StudentResponse } from "@/types/response";
import { AccountType } from "@/types/utils";

export type AuthAction =
  | { type: "LOGIN"; payload: { token: string; successMessage: string } }
  | { type: "LOAD_USER"; payload: { user: User; roleData: StudentResponse | FacultyResponse | PrincipalResponse | null } }
  | { type: "ERROR_LOGIN"; payload: { errorMessage: string } }
  | { type: "REQUEST_SUCCESS"; payload: { successMessage: string } }
  | { type: "RESET_AUTH_STATUS" }
  | { type: "SET_IS_LOADING" }
  | { type: "LOGOUT" };

const AuthReducer = (state: AuthContextInitialValue, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isLoggedIn: true,
      };
    }
    case "LOAD_USER": {
      const baseUser = action.payload.user;
      const roleData = action.payload.roleData;

      let userData: Student | Faculty | Principal | null = null;

      switch (baseUser.role) {
        case AccountType.STUDENT:
          userData = {
            ...baseUser,
            ...(roleData as Student),
          };
          break;
        case AccountType.FACULTY:
          userData = {
            ...baseUser,
            ...(roleData as Faculty),
          };
          break;
        case AccountType.PRINCIPAL:
          userData = {
            ...baseUser,
            ...(roleData as Principal),
          };
          break;
        default:
          userData = null;
      }

      return {
        ...state,
        userData: userData,
      };
    }
    case "SET_IS_LOADING": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "ERROR_LOGIN": {
      return {
        ...state,
        isError: true,
        errorMessage: action.payload.errorMessage,
      };
    }
    case "REQUEST_SUCCESS": {
      return {
        ...state,
        successMessage: action.payload.successMessage,
      };
    }
    case "RESET_AUTH_STATUS": {
      return {
        ...state,
        isError: false,
        successMessage: "",
        errorMessage: "",
        isLoading: false,
      };
    }
    case "LOGOUT": {
      localStorage.removeItem("token")
      return {
        ...state,
        token: "",
        isLoggedIn: false,
        userData: null,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
