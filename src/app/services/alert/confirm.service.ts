import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
    constructor(private dialog: MatDialog){};

    openConfirmDialog(enterAnimationDuration:string, exitAnimationDuration:string){
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            enterAnimationDuration: enterAnimationDuration,
            exitAnimationDuration: exitAnimationDuration
        });
        return dialogRef.afterClosed();
    }
}