// TypeScript definitions

export declare interface UserJSON {
    Name: string;
    ID: number;
    Email: string;
    Role: string;
    BirthCertificateNumber: string;
    Birthday: string;
    CityOfBirth: string;
    CountryOfBirth: string;
    IsPassing: boolean;
}

export declare interface Subject {
    ID: number;
    TeacherID: number;
    Name: string;
    InheritsClass: boolean;
    ClassID: number;
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
    ID: number;
    MeetingName: string;
    TeacherID: number;
    SubjectID: number;
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
