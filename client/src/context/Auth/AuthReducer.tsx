import type { AuthContextInitialValue } from "./AuthContext";
import type { User } from "@/types/models";

export type AuthAction =
  | { type: "LOGIN"; payload: { userData: User; successMessage: string } }
  | { type: "ERROR_LOGIN"; payload: { errorMessage: string } }
  | { type: "RESET_AUTH_STATUS" }
  | { type: "LOGOUT" };

const AuthReducer = (state: AuthContextInitialValue, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        userData: action.payload.userData,
        isLoggedIn: true,
        successMessage: action.payload.successMessage,
      };
    case "ERROR_LOGIN": {
      return {
        ...state,
        isError: true,
        errorMessage: action.payload.errorMessage,
      };
    }
    case "RESET_AUTH_STATUS":
      return {
        ...state,
        isError: false,
        successMessage: "",
        errorMessage: "",
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        userData: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
