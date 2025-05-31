import { createContext } from "react";

export interface AuthContextInitialValue {
  token: string;
  isLoggedIn: boolean;
  userData: null;
  login: () => void;
  logout: () => void;
}

export const authInitalValue: AuthContextInitialValue = {
  token: "",
  isLoggedIn: false,
  userData: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext =
  createContext<AuthContextInitialValue>(authInitalValue);
