import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { StudentLoginDto } from 'src/app/models/student.model';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthentificationService } from 'src/app/services/auth/authentification.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = {email: '', password: ''};

  constructor(private authService: AuthentificationService,
              private alertService: AlertService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const studentLogin = this.loginForm as StudentLoginDto;
    this.authService.login(studentLogin).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']).then(
          () => this.alertService.success("Vous êtes maintenant connecté(e)"));
      },
      error: err => this.alertService.error(err.error.message)
    });

  }
  retrievePassword(){
    
  }
}
