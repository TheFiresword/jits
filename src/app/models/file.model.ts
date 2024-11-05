import { StudentDto } from "./student.model";

export interface FileCreateDto {
  name: string;
  path: string;
  type: string;
  userId: number;
}


export interface FileUpdateDto {
  name: string;
  path: string;
  type: string;
  userId: number;
}

export interface FileDeleteDto {
  id: number;
}

export interface FileDto{
    id: number;
    name: string;
    path: string;
    type: string;
    owner: StudentDto;
}