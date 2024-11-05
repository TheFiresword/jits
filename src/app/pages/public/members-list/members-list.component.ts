import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableEvent } from 'src/app/models/dataTable-event.model';
import { StudentDto } from 'src/app/models/student.model';
import { ConfirmService } from 'src/app/services/alert/confirm.service';
import { StudentsService } from 'src/app/services/student/student.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit{
  students: StudentDto[] = [];
  colsLabels: Object;
  colsNames: Object;
  dtOptions: DataTables.Settings = {};
  avatarTypes = ['adventurer-neutral', 'adventurer', 'avataaars', 'croodles'];
  
  constructor(private studentService: StudentsService, private confirmService: ConfirmService, private router: Router){}
  getRandomValue(){
    let choice = `https://api.dicebear.com/7.x/${this.avatarTypes[Math.floor(Math.random()*this.avatarTypes.length)]}/svg`;
    return choice;
  }

  ngOnInit(): void {      
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
        language: {
          processing:     "Traitement en cours...",
          search:         "Rechercher&nbsp;:",
          lengthMenu:    "Afficher _MENU_ &eacute;l&eacute;ments",
          info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
          infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
          infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
          infoPostFix:    "",
          loadingRecords: "Chargement en cours...",
          zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
          emptyTable:     "Aucune donnée disponible dans le tableau",
          paginate: {
              first:      "",
              previous:   "<",
              next:       ">",
              last:       ""
          },
          aria: {
              sortAscending:  ": activer pour trier la colonne par ordre croissant",
              sortDescending: ": activer pour trier la colonne par ordre décroissant"
          }
        }    
      };
      this.colsLabels = [

      ];
      this.colsNames = [

      ];
      
      this.getAllStudentsInfos();      
  };
  
  getAllStudentsInfos(){
    this.studentService.getAllStudentInfos().subscribe(
      (result)=>{this.students = result;
        this.students.forEach( (student) => {
          student['schoolInfos'] = `${student.year} ${student.department} ${student.campus}`;
          student['avatar'] = {
            "id": 200,
            "name": "avat.png",
            "path": this.getRandomValue(),
            "type": "img",
            "owner": null
          };
          student['availability'] = true;
          return student
        });}
    );
  }

  monitorAction(event: TableEvent){
    if(event.type === "delete"){
      this.confirmService.openConfirmDialog('1000ms', '1000ms').subscribe(
        (result)=>{
          let targetId = String(event.target);
          if(result=="Yes") console.log("Entrée supprimée")
          else console.log("Suppression infirmée");
        }
      );
    }
    else if(event.type === "add" ){

    }
    else if(event.type === "details" || event.type === "modify"){
      let targetId = String(event.target);
      this.router.navigate([`/students/${targetId}`])

    }
  }
}
