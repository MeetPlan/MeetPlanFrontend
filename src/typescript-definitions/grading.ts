import type {Grade} from "./grade";

export interface Grading {
    ID: string
    SubjectID: string
    TeacherID: string
    Name: string
    Description: string
    GradingType: number
    SchoolYear: string
    Period: number
    CreatedAt: string
    UpdatedAt: string
}

export interface GradingTerm {
    ID: string
    TeacherID: string
    GradingID: string
    Date: string
    Hour: number
    Name: string
    Description: string
    Term: number
    GradeAutoselectType: number
    CreatedAt: string
    UpdatedAt: string
}

export interface GradingUser {
    ID: string
    Name: string
    Surname: string
    Grade: Grade
}

export interface GradingTermIntermediate {
    GradingTerm: GradingTerm
    Users: GradingUser[]
}

export interface GradingResponseTeacher {
    Grading: Grading
    GradingTerms: GradingTermIntermediate[]
}