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
