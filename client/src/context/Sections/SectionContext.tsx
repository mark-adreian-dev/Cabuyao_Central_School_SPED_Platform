
import type { SectionDataResponse } from "@/types/Response/SectionResponse";
import type { AddSectionFormInterface } from "@/types/utils";
import { createContext } from "react";

export interface SectionContextInitialValue {
  sections: SectionDataResponse[] | [];
  isError: boolean;
  errorMessage: string;
  isLoading: boolean;
  successMessage: string;
  updateSection: () => void;
  createSection: (section: AddSectionFormInterface) => void;
  deleteSection: (sectionId: number) => Promise<void>;
}

export const sectionInitialValue = {
  sections: [],
  isError: false,
  errorMessage: "",
  isLoading: false,
  successMessage: "",
  updateSection: async () => {},
  createSection: async (section: AddSectionFormInterface) => { console.log(section) },
  deleteSection: async (sectionId: number) => { console.log(sectionId); },
};

export const SectionContext = createContext<SectionContextInitialValue>(sectionInitialValue);
