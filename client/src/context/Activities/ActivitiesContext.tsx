
import type { ActivityDataResponse } from "@/types/Response/ActivityResponse";
import { createContext } from "react";

export interface ActivityContextInitialValue {
  activities: ActivityDataResponse[] | [];
  isError: boolean;
  errorMessage: string;
  isLoading: boolean;
  successMessage: string;
  deleteActivity: (activityId: number) => Promise<void> 
  addActivity: (activityData: FormData) => Promise<void>
}

export const activityInitialValue = {
  activities: [],
  isError: false,
  errorMessage: "",
  isLoading: false,
  successMessage: "",
  deleteActivity: async (activityId: number) => {
    console.log(activityId);
  },
  addActivity: async (activityData: FormData) => {
    console.log(activityData);
  },
};

export const ActivityContext =
  createContext<ActivityContextInitialValue>(activityInitialValue);
