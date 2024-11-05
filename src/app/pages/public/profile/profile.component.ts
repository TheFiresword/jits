import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentDto } from 'src/app/models/student.model';
import { AuthentificationService } from 'src/app/services/auth/authentification.service';
import { StudentsService } from 'src/app/services/student/student.service';
import { SCHOOLEMAILSUFFIX, API_URL } from 'src/app/services/config';
import { availablePoles, stringifiedAvailablePoles } from 'src/app/models/role.enum';
import { Router } from '@angular/router';
import Dropzone from "dropzone";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  myDetails : StudentDto
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


  constructor(private studentService: StudentsService, private fb: FormBuilder, private router: Router){}
  ngOnInit(){
    this.studentService.getStudentInfos(1).subscribe(
      (result)=>{this.myDetails = result}
    );

    this.updateDetailsForm = this.fb.group(
      {
        avatar: ['https://api.dicebear.com/6.x/micah/svg?randomizeIds=false'],
        firstname: [this.myDetails.firstname],
        lastname: [this.myDetails.lastname],
        email: [this.myDetails.email, Validators.pattern(`[a-z0-9_.]*@${SCHOOLEMAILSUFFIX}$`)],
        password: ['', Validators.minLength(8)],
        
        year: [this.myDetails.year],
        department: [this.myDetails.department],
        campus: [this.myDetails.campus],
        role: [this.myDetails.role],
        
        phone: [this.myDetails.phone],
        adress: [this.myDetails.address],
        zipCode: [this.myDetails.zipCode],
        city: [this.myDetails.city],
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
