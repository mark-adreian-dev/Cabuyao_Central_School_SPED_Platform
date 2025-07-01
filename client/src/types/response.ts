import type { User } from "./models"

export enum ResponseStatus {
    NOT_FOUND = 404,
    SUCCESS = 200,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
    UNAUTHORIZED = 401
}
export interface LoginSuccessResponse {
    message: string,
    token: string
}

export interface StudentResponse {
    student_id: number,
    grade_level: number,
    mother_tongue: string,
    LRN: string
}

export interface FacultyResponse {
    position: number,
}

export interface PrincipalResponse {
    year_started: number,
    year_ended: number
}

export interface SectionResponse {
    sections: SectionFacultyResponse[]
}
export interface SectionFacultyResponse {
    id: number,
    section_name: string,
    faculty_id: number,
    school_year: string,
    grade_level: number,
    isActive: number,
    created_at: string,
    updated_at: string,
    students: [],
    faculty: SectionFacultyDataLayout
}

interface SectionFacultyDataLayout{
    position: number,
    user_id?: number,
    created_at: Date
    updated_at: Date
    user: User
}

export interface DeleteResponse {
    message: string
}