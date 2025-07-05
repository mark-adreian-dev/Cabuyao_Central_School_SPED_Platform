import type { ActivityDataResponse } from "@/types/Response/ActivityResponse";
import type { ActivityContextInitialValue } from "./ActivitiesContext";

export type ActivityAction =
  | {
      type: "GET_ALL_ACTIVITIES";
      payload: { activities: ActivityDataResponse[] }
    }
  | { type: "REQUEST_ERROR"; payload: { errorMessage: string } }
  | { type: "RESET_REQUEST_STATUS" }
  | {
      type: "ACTIVITY_DELETED";
      payload: { activity_id: number; successMessage: string };
    }
  | { type: "ADD_ACTIVITY"; payload: { activity: ActivityDataResponse } };


const ActivityReducer = (
  state: ActivityContextInitialValue,
  action: ActivityAction
) => {
  switch (action.type) {
    case "GET_ALL_ACTIVITIES": {
      return {
        ...state,
        activities: action.payload.activities,
      };
    }
    case "ADD_ACTIVITY": {
      return {
        ...state,
        activities: [...state.activities, action.payload.activity],
      };
    }
    case "REQUEST_ERROR": {
      return {
        ...state,
        isError: true,
        errorMessage: action.payload.errorMessage,
      };
    }
    case "RESET_REQUEST_STATUS": {
      return {
        ...state,
        isError: false,
        successMessage: "",
        errorMessage: "",
        isLoading: false,
      };
    }
    case "ACTIVITY_DELETED": {
      return {
        ...state,
        activities: state.activities.filter(
          (activity) => activity.id !== action.payload.activity_id
        ),
        successMessage: action.payload.successMessage,
      };
    }

    default:
      return state;
  }
};

export default ActivityReducer;
