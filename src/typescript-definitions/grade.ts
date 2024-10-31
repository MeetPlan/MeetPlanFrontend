export interface Grade {
    ID: string
    UserID: string
    TeacherID: string
    TermID: string
    SubjectID: string
    Grade: number
    Date: string
    IsWritten: boolean
    IsFinal: boolean
    Period: number
    Description: string
    CanPatch: boolean
    CreatedAt: string
    UpdatedAt: string
}
