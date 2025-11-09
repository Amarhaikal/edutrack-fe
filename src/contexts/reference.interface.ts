export interface RefRole {
    id: number;
    code: string;
    description: string;
}

export interface RefCountry {
    id: number;
    code: string;
    description: string;
}

export interface RefProgramme {
    id: number;
    code: string;
    description: string;
    faculty: RefFaculty;
}

export interface RefFaculty {
    id: number;
    code: string;
    description: string;
}
