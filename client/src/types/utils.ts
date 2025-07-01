export enum ScreenSize {
    MOBILE = "336px",
    TABLET = "768px",
    DESKTOP = "1440px",
}

export enum AccountType {
    STUDENT = "STUDENT",
    PRINCIPAL = "PRINCIPAL",
    FACULTY = "FACULTY",
    PARENT = "PARENT"
}

export interface LoginFormInterface {
    email: string,
    student_id: string,
    password: string,
    role: AccountType
}

export interface AddSectionFormInterface {
    section_name: string;
    grade_level: number;
    faculty_id: number;
    school_year: string;
    isActive: boolean;
};