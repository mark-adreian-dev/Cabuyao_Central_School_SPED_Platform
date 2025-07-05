import type { User } from "../models"

export interface SectionResponse {
    sections: SectionDataResponse[]
}
export interface SectionDataResponse {
    id: number,
    faculty_id: number,
    section_name: string,
    school_year: string,
    grade_level: number,
    isActive: boolean,
    created_at: string,
    updated_at: string,
    students: [],
    faculty: SectionFacultyDataLayout
}

interface SectionFacultyDataLayout {
    position: number,
    user_id: number,
    created_at: Date
    updated_at: Date
    user: User
}