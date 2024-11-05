import { Injectable } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _snackBar: MatSnackBar) { }
  public success(message:string):Observable<boolean>{
    this._snackBar.open(message, 'Ok', {
      duration: 3000,
      panelClass: ['green-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    return of(true);
  }
  public error(message: string): Observable<boolean>{
    this._snackBar.open(message, 'Ok', {
      duration: 3000,
      panelClass: ['red-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    return of(true);
  }
}
