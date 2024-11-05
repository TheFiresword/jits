import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { availablePoles, stringifiedAvailablePoles } from 'src/app/models/role.enum';
import { StudentCreateDto } from 'src/app/models/student.model';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthentificationService } from 'src/app/services/auth/authentification.service';
import { SCHOOLEMAILSUFFIX } from 'src/app/services/config';
import { findFirstInvalidField } from 'src/app/services/utilities/form.utility';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm: FormGroup
  
  constructor(private router: Router, private authService: AuthentificationService, private alertService: AlertService, private formBuilder: FormBuilder){}
  
  getAvailablePoles(){
    return availablePoles;
  }
  getStringifiedAvailablePoles(){
    return stringifiedAvailablePoles;
  }

  getOnePoleRoles(pole){
    return Object.values(pole)
  }

  ngOnInit(): void{
    this.registrationForm = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.pattern(`[a-z0-9_.]*@${SCHOOLEMAILSUFFIX}$`), Validators.required]],
        password: ['', [Validators.minLength(8), Validators.required]],
        
        year: ['', Validators.required],
        department: ['', Validators.required],
        campus: ['', Validators.required],
        role: ['', Validators.required],
        
        phone: [''],
        adress: [''],
        zipCode: [''],
        city: [''],
      }
    );
  }

  monitorMandatoryInputs(input:string){
    return this.registrationForm.get(input).hasValidator(Validators.required)
  }
  
  findFirstInvalidField(): string | null {
    return findFirstInvalidField(this.registrationForm);
  }
  

  onSubmit(){
    const student = this.registrationForm.value as StudentCreateDto
    this.authService.register(student).subscribe({
      next: (res) => {
        this.router.navigate(['login']).then(
          () => this.alertService.success(res.message));
      },
      error: err => this.alertService.error(err.error.message)
    });

  }
}
