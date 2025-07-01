import React, { useContext, useEffect, useReducer, type ReactNode } from "react";
import SectionReducer from "./SectionReducer";
import { SectionContext, sectionInitialValue } from "./SectionContext";
import api from "@/lib/api";
import { AuthContext } from "../Auth/AuthContext";
import type { DeleteResponse, SectionFacultyResponse, SectionResponse } from "@/types/response";
import axios from "axios";
import type { AddSectionFormInterface } from "@/types/utils";

interface Props {
  children: ReactNode;
}
interface ErrorResponse {
  message: string;
}

const AUTH_STATE_TIMEOUT = 2500;

const SectionState: React.FC<Props> = ({ children }) => {
  const { userData } = useContext(AuthContext)
  const [sectionState, sectionDispatch] = useReducer(
    SectionReducer,
    sectionInitialValue
  );

   useEffect(() => {
     const retrieveSections = async () => {
       try {
         if (userData) {
           const response = await api.get("/api/sections");
           const data: SectionResponse = response.data;
           const filteredSections: SectionFacultyResponse[] =
             data.sections.filter(
               (section) => userData.id === section.faculty_id
             );
           sectionDispatch({
             type: "GET_ALL_SECTION",
             payload: {
               sections: filteredSections,
             },
           });
         }
       } catch (err) {
         handleError(err);
       }
     };

     retrieveSections();
   }, [userData]);

  const handleError = (error: unknown) => {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";

      sectionDispatch({
        type: "REQUEST_ERROR",
        payload: {
          errorMessage: message,
        },
      });

      resetAuthState();
    } else {
      // Fallback for unexpected error types
      sectionDispatch({
        type: "REQUEST_ERROR",
        payload: {
          errorMessage: "An unexpected error occurred",
        },
      });

      resetAuthState();
    }

    return;
  };
  const resetActionState = () => {
    setTimeout(() => {
      sectionDispatch({ type: "RESET_REQUEST_STATUS" });
    }, AUTH_STATE_TIMEOUT);
  };
  const updateSection = async () => { }
  const createSection = async (section: AddSectionFormInterface) => {
    const response = await api.post("/api/sections", section);
    const data: SectionFacultyResponse[] = response.data.section
    sectionDispatch({
      type: "ADD_SECTION",
      payload: {
        newSection: data[data.length - 1]
      }
    })
  }
  const deleteSection = async (sectionId: number) => {
    try {
       const response = await api.delete(`/api/sections/${sectionId}`)
        const data: DeleteResponse = response.data
        sectionDispatch({
          type: "SECTION_DELETED",
          payload: {
            section_id: sectionId,
            successMessage: data.message
          }
        })
      resetActionState()
    } catch (err) {
      handleError(err)
    }
  }

 
  return (
    <SectionContext.Provider
      value={{
        sections: sectionState.sections,
        isError: sectionState.isError,
        isLoading: sectionState.isLoading,
        errorMessage: sectionState.errorMessage,
        successMessage: sectionState.successMessage,
        updateSection,
        createSection,
        deleteSection
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export default SectionState;
