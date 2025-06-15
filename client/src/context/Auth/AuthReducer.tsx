import type { User } from "@/types/models";
import type { AuthContextInitialValue } from "./AuthContext";

export type AuthAction =
  | { type: "LOGIN"; payload: { token: string; successMessage: string } }
  | { type: "LOAD_USER"; payload: { user: User } }
  | { type: "ERROR_LOGIN"; payload: { errorMessage: string } }
  | { type: "REQUEST_SUCCESS"; payload: { successMessage: string } }
  | { type: "RESET_AUTH_STATUS" }
  | { type: "SET_IS_LOADING" }
  | { type: "LOGOUT" };

const AuthReducer = (state: AuthContextInitialValue, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        token: action.payload.token,
        isLoggedIn: true,
      };
    }
    case "LOAD_USER": {
      return {
        ...state,
        userData: action.payload.user,
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
