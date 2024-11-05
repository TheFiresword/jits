import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthentificationService } from "../services/auth/authentification.service";
import { Router } from "@angular/router";
import { StudentJWtTokenDto } from "../models/student.model";
import { AlertService } from "../services/alert/alert.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService: AuthentificationService, private router: Router, private alertService: AlertService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        let userToken: null | StudentJWtTokenDto = this.authService.getCurrentToken();
        let reqToSend = req;
        if(userToken){
            reqToSend = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${userToken.accessToken}`)
            })
        }
        return next.handle(reqToSend).pipe(
            catchError(
                (error: any, caught: Observable<any>) => {
                    if(error.status === 401){
                        this.authService.logout();
                        this.router.navigate(['/login']).then(
                            ()=> this.alertService.error("Vous devez être connecté pour accéder à cette page")
                        )
                    }
                    if(error.status === 403){
                        this.router.navigate(['/dashboard']).then(
                            ()=> this.alertService.error("Vous n'avez pas les permissions pour accéder à cette page !")
                        )
                    }
                    return throwError(error);
                }
            )
        );
    }
}