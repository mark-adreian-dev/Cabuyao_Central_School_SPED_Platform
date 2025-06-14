import type { User } from "@/types/models";
import type { LoginFormInterface } from "@/types/utils";
import { createContext } from "react";
import type { AuthAction } from "./AuthReducer";
import type { AxiosError, AxiosResponse } from "axios";
import api from "@/lib/api";

export interface AuthContextInitialValue {
  token: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  isError: boolean;
  successMessage: string;
  errorMessage: string;
  userData: User | null;

  login: (credentials: LoginFormInterface) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  sendEmailVerification: (userId?: number) => Promise<void>;
  verifyAccount: (
    userData?: User,
    code?: string
  ) => Promise<AxiosResponse | AxiosError>;
  authDispatch: React.Dispatch<AuthAction>;
}

export const authInitalValue: AuthContextInitialValue = {
  token: "",
  isLoggedIn: false,
  isLoading: false,
  isError: false,
  userData: null,
  successMessage: "",
  errorMessage: "",
  login: async () => {},
  logout: async () => {},
  loadUser: async () => {},
  sendEmailVerification: async () => {},
  verifyAccount: async () => {
    return await api.get("");
  },
  authDispatch: () => {},
};

export const AuthContext =
  createContext<AuthContextInitialValue>(authInitalValue);
