import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentDto, initializeStudent } from 'src/app/models/student.model';
import { AuthentificationService } from 'src/app/services/auth/authentification.service';
import { StudentsService } from 'src/app/services/student/student.service';
import { SCHOOLEMAILSUFFIX, API_URL } from 'src/app/services/config';
import { availablePoles, stringifiedAvailablePoles } from 'src/app/models/role.enum';
import { ActivatedRoute, Router } from '@angular/router';
import Dropzone from "dropzone";
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {
  studentDetails : StudentDto = initializeStudent();
  updateDetailsForm: FormGroup
  changeState: boolean
  avatarPath: string = null


  getAvailablePoles(){
    return availablePoles;
  }
  getStringifiedAvailablePoles(){
    return stringifiedAvailablePoles;
  }
  getOnePoleRoles(pole){
    return Object.values(pole)
  }


  constructor(private studentService: StudentsService, private fb: FormBuilder, private router: Router, 
    private route: ActivatedRoute, private alertService : AlertService){}
  ngOnInit(){
    this.updateDetailsForm = this.fb.group(
      {
        avatar: [''],
        firstname: [''],
        lastname: [''],
        email: ['', Validators.pattern(`[a-z0-9_.]*@${SCHOOLEMAILSUFFIX}$`)],
        password: ['', Validators.minLength(8)],
        
        year: [''],
        department: [''],
        campus: [''],
        role: [''],
        
        phone: [''],
        adress: [''],
        zipCode: [''],
        city: [''],
      }
    );
    
    let studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getStudentInfos(studentId).subscribe(
      (result)=>{
        if(!result){
          this.alertService.error("Erreur lors de la récupération des informations de l'étudiant");
          return;
        } 
        this.studentDetails = result;
        this.updateDetailsForm = this.fb.group(
          {
            avatar: ['https://api.dicebear.com/6.x/micah/svg?randomizeIds=false'],
            firstname: [this.studentDetails.firstname],
            lastname: [this.studentDetails.lastname],
            email: [this.studentDetails.email, Validators.pattern(`[a-z0-9_.]*@${SCHOOLEMAILSUFFIX}$`)],
            password: ['', Validators.minLength(8)],
            
            year: [this.studentDetails.year],
            department: [this.studentDetails.department],
            campus: [this.studentDetails.campus],
            role: [this.studentDetails.role],
            
            phone: [this.studentDetails.phone],
            adress: [this.studentDetails.address],
            zipCode: [this.studentDetails.zipCode],
            city: [this.studentDetails.city],
          }
        );
      }
    );
    document.querySelectorAll('input').forEach((input)=>input.setAttribute('readonly', 'true'));
    if (document.getElementById('dropFile')) {
      let myDropzone = new Dropzone("div#dropFile", {url: `${API_URL}/file/upload-photo`});
      document.getElementsByClassName('dz-button')[0].setAttribute('class','dz-button btn btn-outline-sc');
      

    }
  }

  activateChange(){
    this.changeState = true;
    document.querySelectorAll('input').forEach((input)=>input.removeAttribute('readonly'));
  }

  cancelChange(){
    this.changeState = false;
    document.querySelectorAll('input').forEach((input)=>input.setAttribute('readonly', 'true')); 
  }

  onSubmitChanges(){
    window.location.reload()
  }

  initCancelFile(id:number){
    document.getElementById('modal-close-btn').click();
  }
}
