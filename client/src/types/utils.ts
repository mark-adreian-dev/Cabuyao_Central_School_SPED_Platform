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
    studentId: string,
    password: string,
    role: AccountType
}