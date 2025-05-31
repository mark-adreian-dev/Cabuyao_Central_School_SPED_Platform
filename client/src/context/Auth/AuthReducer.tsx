import type { AuthContextInitialValue } from "./AuthContext";

type AuthAction =
  | { type: "LOGIN"; payload: { token: string } }
  | { type: "LOGOUT" };

const AuthReducer = (state: AuthContextInitialValue, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
      };
    case "LOGOUT":
      return {
        ...state,
        token: "",
        isLoggedIn: false,
        userData: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
