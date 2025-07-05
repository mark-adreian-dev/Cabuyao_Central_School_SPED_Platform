
export interface ActivityResponse{
    activities: ActivityDataResponse[]
} 

export interface ActivityDataResponse {
    id: number;
    faculty_id: number;
    activity_description: string;
    perfect_score: number;
    passing_score: number;
    activity_question: string;
    created_at: Date;
    updated_at: Date;
    files: ActivityFile[];
    sections: ActivitySection[] | [];
}

interface ActivityFile {
    id: number;
    activity_id: number;
    activity_file: string;
    created_at: Date;
    updated_at: Date;
}

interface ActivitySection {
    id: number;
    faculty_id: number;
    section_name: string;
    school_year: string;
    grade_level: number;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
    pivot: ActivityPivot;
}

interface ActivityPivot {
    activity_id: number;
    section_id: number;
    deadline: Date;
    grading_period: number;
    created_at: Date;
    updated_at: Date;
}
