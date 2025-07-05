import type { SectionContextInitialValue } from "./SectionContext";
import type { SectionDataResponse } from "@/types/Response/SectionResponse";

export type SectionAction =
  | { type: "GET_ALL_SECTION"; payload: { sections: SectionDataResponse[] } }
  | { type: "REQUEST_ERROR"; payload: { errorMessage: string } }
  | { type: "RESET_REQUEST_STATUS" }
  | {
      type: "SECTION_DELETED";
      payload: { section_id: number; successMessage: string };
    }
  | { type: "ADD_SECTION"; payload: { newSection: SectionDataResponse } };


const SectionReducer = (
  state: SectionContextInitialValue,
  action: SectionAction
) => {
  switch (action.type) {
    
    case "GET_ALL_SECTION": {
      return {
        ...state,
        sections: action.payload.sections,
      };
    }
    case "ADD_SECTION": {
      return {
        ...state,
        sections: [...state.sections, action.payload.newSection]
      }
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
    case "SECTION_DELETED": {
      return {
        ...state,
        sections: state.sections.filter(section => section.id !== action.payload.section_id),
        successMessage: action.payload.successMessage
      };
    }

    default:
      return state;
  }
};

export default SectionReducer;
