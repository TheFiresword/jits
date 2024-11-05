import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';
import { API_URL } from '../config';
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import { StudentCreateDto, StudentJWtSessionDto, StudentJWtTokenDto, StudentLoginDto } from 'src/app/models/student.model';



@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  AUTH_API = API_URL + "/auth";
  USER_JWT_TOKEN_KEY = "USER_JWT_TOKEN_KEY";

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getCurrentSession());
  public authStateChanged = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(studentLoginDto: StudentLoginDto): Observable<StudentJWtTokenDto>{
    return this.http.post<StudentJWtTokenDto>(this.AUTH_API + '/login', studentLoginDto).pipe(
      tap(
        (response: StudentJWtTokenDto) => {
          this.setCurrentToken(response);
          this.isLoggedInSubject.next(true);
        }
      )
    );
  }
  
  register(studentCreateDto: StudentCreateDto): Observable<any>{
    return this.http.post<StudentCreateDto>(this.AUTH_API + '/register', studentCreateDto);
  }

  logout(): Observable<boolean>{
    localStorage.removeItem(this.USER_JWT_TOKEN_KEY);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
    return of(true);
  }

  isLoggedIn(): boolean{
    return this.getCurrentSession() !== null;
  }

  getCurrentSession(): StudentJWtSessionDto | null{
    const studentJwtToken = this.getCurrentToken();
    if (studentJwtToken === null)
      return null;
    const base64UrlSessionInfos = studentJwtToken.accessToken.split('.')[1];
    const base64SessionInfos = base64UrlSessionInfos.replace(/-/g, '+').replace(/_/g, '/');
    //console.log(base64UrlSessionInfos);

    return JSON.parse(atob(base64SessionInfos));
  }

  getCurrentToken(): StudentJWtTokenDto | null{
    const studentJwtToken = localStorage.getItem(this.USER_JWT_TOKEN_KEY);
    return studentJwtToken? JSON.parse(studentJwtToken): null;
  }

  private setCurrentToken(studentJwtTokenDto:StudentJWtTokenDto):void{
    localStorage.setItem(this.USER_JWT_TOKEN_KEY, JSON.stringify(studentJwtTokenDto));
  }

}
