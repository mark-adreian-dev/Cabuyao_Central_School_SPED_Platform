import type { User } from "@/types/models";
import type { LoginFormInterface } from "@/types/utils";
import { createContext } from "react";

export interface AuthContextInitialValue {
  isLoggedIn: boolean;
  isError: boolean;
  successMessage: string;
  errorMessage: string;
  userData: User | null;

  login: (credentials: LoginFormInterface) => Promise<number | undefined>;
  logout: () => Promise<number | undefined>;
}

export const authInitalValue: AuthContextInitialValue = {
  isLoggedIn: false,
  isError: false,
  userData: null,
  successMessage: "",
  errorMessage: "",
  login: async () => {
    return 0;
  },
  logout: async () => {
    return 0;
  },
};

export const AuthContext =
  createContext<AuthContextInitialValue>(authInitalValue);
