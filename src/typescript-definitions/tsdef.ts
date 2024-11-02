// TypeScript definitions

export interface UserJSON {
    ID: string
    Email: string
    Role: string
    Name: string
    Surname: string
    EMSO: string
    Citizenship: string
    BeforeAchievedEducation: string
    PermanentAddress: string
    TemporaryAddress: string
    TaxNumber: string
    PhoneNumber: string
    Gender: string
    BirthCertificateNumber: string
    Birthday: string
    CityOfBirth: string
    CountryOfBirth: string
    IsPassing: boolean
    IsLocked: boolean
    IsMissingInfo: boolean
}

export declare interface Subject {
    ID: string;
    TeacherID: string;
    Name: string;
    InheritsClass: boolean;
    ClassID: string;
    Students: string;
    LongName: string;
    Realization: number;
    SelectedHours: number;
    Color: string;
    Location: string;
    TeacherName: string;
    User: UserJSON[];
    RealizationDone: number;
    IsGraded: boolean;
}

export declare interface Meeting {
    ID: string;
    MeetingName: string;
    TeacherID: string;
    SubjectID: string;
    Hour: number;
    Date: string;
    IsMandatory: boolean;
    URL: string;
    Details: string;
    IsSubstitution: boolean;
    Location: string;
    IsGrading: boolean;
    IsWrittenAssessment: boolean;
    IsTest: boolean;
    IsBeta: boolean;
    TeacherName: string;
    SubjectName: string;
    Subject: Subject;
}
