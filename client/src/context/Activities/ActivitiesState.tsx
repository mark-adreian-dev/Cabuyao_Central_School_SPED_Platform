import { useCallback, useContext, useEffect, useReducer, type ReactNode } from "react";
import { ActivityContext, activityInitialValue } from "./ActivitiesContext";
import api from "@/lib/api";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios";
import type { ActivityDataResponse, ActivityResponse } from "@/types/Response/ActivityResponse";
import ActivityReducer from "./ActivitiesReducer";
import type { DeleteResponse } from "@/types/Response/AuthResponse";

interface Props {
  children: ReactNode;
}
interface ErrorResponse {
  message: string;
}

const AUTH_STATE_TIMEOUT = 2500;

const ActivitiesState = ({ children }: Props) => {
  const { userData } = useContext(AuthContext)
  const [activityState, activityDispatch] = useReducer(
    ActivityReducer,
    activityInitialValue
  );

  const handleError = useCallback(
    (error: unknown) => {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        const message =
          error.response?.data?.message || error.message || "Unknown error";

        activityDispatch({
          type: "REQUEST_ERROR",
          payload: {
            errorMessage: message,
          },
        });

        resetActionState();
      } else {
        // Fallback for unexpected error types
        activityDispatch({
          type: "REQUEST_ERROR",
          payload: {
            errorMessage: "An unexpected error occurred",
          },
        });

        resetActionState();
      }

      return;
    },
    []
  );
  const resetActionState = () => {
    setTimeout(() => {
      activityDispatch({ type: "RESET_REQUEST_STATUS" });
    }, AUTH_STATE_TIMEOUT);
  };

  useEffect(() => {
    const retrieveActivities = async () => {
      try {
        if (userData) {
          const response = await api.get("/api/activities");
          const data: ActivityResponse = response.data;
          const activitiesData: ActivityDataResponse[] = data.activities;

          activityDispatch({
            type: "GET_ALL_ACTIVITIES",
            payload: {
              activities: activitiesData,
            },
          });
        }
      } catch (err) {
        handleError(err);
      }
    };

    retrieveActivities();
  }, [handleError, userData]);

  const deleteActivity = async (activityId: number) => {
    try {
      const response = await api.delete(`/api/activities/${activityId}`);
      const data: DeleteResponse = response.data
      activityDispatch({
        type: "ACTIVITY_DELETED",
        payload: {
          activity_id: activityId,
          successMessage: data.message
        }
      })
      resetActionState()
    } catch (err) {
      handleError(err)
    }
  }
  const addActivity = async (activityData: FormData) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/activities",
        activityData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data: ActivityDataResponse = response.data.activity
      activityDispatch({
        type: "ADD_ACTIVITY",
        payload: {
          activity: data
        }
      })
    } catch (err) {
      handleError(err)
    }
  }
 
  return (
    <ActivityContext.Provider
      value={{
        activities: activityState.activities,
        isError: activityState.isError,
        isLoading: activityState.isLoading,
        errorMessage: activityState.errorMessage,
        successMessage: activityState.successMessage,
        deleteActivity,
        addActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export default ActivitiesState;
