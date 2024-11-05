import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, map, of, tap} from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { StudentDto } from 'src/app/models/student.model';
import { Role } from 'src/app/models/role.enum';

@Injectable({
    providedIn: 'root'
  })
  export class StudentsService {
    allStudents;
    
    constructor(private http: HttpClient){}

    getAllStudentInfos(): Observable<StudentDto[]>{
        if(this.allStudents)
            return of(this.allStudents);
        return this.http.get<StudentDto[]>('assets/files/students/students.json').pipe(
            tap((result)=>this.allStudents=result)
        );
    };

    getStudentInfos(id: number): Observable<StudentDto>{
        return this.getAllStudentInfos().pipe(
            map(
                (result: StudentDto[]) => { 
                    let found : StudentDto = result.find( student=>student.id === id); 
                    return found;
                }
            )
        );        
    };
    
    
  }