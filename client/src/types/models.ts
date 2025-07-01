import type { AccountType } from "./utils"

export interface User {
    id: number
    first_name: string
    last_name: string
    middle_name: string
    ext: string | null
    role: AccountType
    sex: string
    profile_picture: string | null
    date_of_birth: string
    mobile_number: string
    address: string
    age: number
    email: string
    email_verified_at: Date
    created_at: Date
    updated_at: Date
}

export interface Student extends User {
    student_id: number,
    grade_level: number,
    mother_tongue: string,
    LRN: string
}

export interface Faculty extends User{
    position: number,
    user_id?: number
}

export interface Principal extends User {
    year_started: number,
    year_ended: number
}


export interface Section {
    section_name: string,
    school_year: string,
    grade_level: number,
    isActive: boolean
}
