import { FileDto } from "./file.model";
import { Role } from "./role.enum";

export function initializeStudent(): StudentDto{
    return {
        id: null,
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        phone: null,
        address: null,
        zipCode: null,
        city: null,
        // School related informations
        year: null,
        department: null,
        campus: null,
        // Enterprise related informations
        role: null,
        myfiles: null
    }
}

export interface StudentDto{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    // School related informations
    year: string;
    department: string;
    campus: string;
    // Enterprise related informations
    role: Role;
    myfiles?: FileDto[];
}

export interface StudentCreateDto {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    zipCode?: string;
    city?: string;

    year: string;
    department: string;
    campus: string;

    role: Role;
}

export interface StudentUpdateDto{
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    phone?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    year?: string;
    department?: string;
    campus?: string;
    role?: Role;
    //files?: File[];
}

export interface StudentDeleteDto{
    id: number;
}

export interface StudentLoginDto {
    email: string;
    password: string;
}

export interface StudentJWtTokenDto{
    username: string;
    accessToken: string;
    expiresIn: string;
}

export interface StudentJWtSessionDto{
    id: number;
    email: string;
    role: Role;
}