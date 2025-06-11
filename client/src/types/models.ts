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