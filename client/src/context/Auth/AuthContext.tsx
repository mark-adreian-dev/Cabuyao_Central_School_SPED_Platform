import type { Faculty, Principal, Student, User } from "@/types/models";
import type { LoginFormInterface } from "@/types/utils";
import { createContext } from "react";
import type { AuthAction } from "./AuthReducer";
import { ResponseStatus } from "@/types/response";

export interface AuthContextInitialValue {
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isError: boolean;
  successMessage: string;
  errorMessage: string;
  userData: Student | Faculty | Principal | null;

  login: (
    credentials: LoginFormInterface
  ) => Promise<
    | ResponseStatus.SUCCESS
    | ResponseStatus.UNAUTHORIZED
    | ResponseStatus.INTERNAL_SERVER_ERROR
  >;
  sendEmailVerification: (
    userId: number
  ) => Promise<
    | ResponseStatus.SUCCESS
    | ResponseStatus.BAD_REQUEST
    | ResponseStatus.INTERNAL_SERVER_ERROR
  >;
  verifyAccount: (
    userData: User,
    code: string
  ) => Promise<
    | ResponseStatus.SUCCESS
    | ResponseStatus.BAD_REQUEST
    | ResponseStatus.INTERNAL_SERVER_ERROR
    | ResponseStatus.NOT_FOUND
  >;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  authRedirect: (user: User) => void;

  authDispatch: React.Dispatch<AuthAction>;
}

export const authInitalValue: AuthContextInitialValue = {
  token: localStorage.getItem("token") && "",
  isLoggedIn: false,
  isLoading: false,
  isError: false,
  userData: null,
  successMessage: "",
  errorMessage: "",
  login: async () => {
    return ResponseStatus.SUCCESS;
  },
  sendEmailVerification: async () => {
    return ResponseStatus.SUCCESS;
  },
  verifyAccount: async () => {
    return ResponseStatus.SUCCESS;
  },
  logout: async () => {},
  loadUser: async () => {},
  authDispatch: () => {},
  authRedirect: () => {},
};

export const AuthContext =
  createContext<AuthContextInitialValue>(authInitalValue);
