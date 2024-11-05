import { Component } from '@angular/core';
import { Role } from 'src/app/models/role.enum';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthentificationService } from 'src/app/services/auth/authentification.service';

const toCapitalize = (str:string):string=>{
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  notifications: string[] = [
    "Item",
    "Text"
  ]
  user: {name: string, firstname: string, position: Role, avatar:any}
  
  constructor(private authService: AuthentificationService, private alertService: AlertService){}

  ngOnInit(){
    const userDetails = this.authService.getCurrentSession();
    if(userDetails){
      //this.user.firstname = userDetails.firstname;
      //this.user.name = userDetails.name;
      //this.user.avatar = userDetails.avatarFile;
      this.user.position = userDetails.role;
    }
    else{
      this.user = {
        "name": "Sedogbo",
        "firstname": toCapitalize("junior"),
        "position": Role.Trésorier,
        avatar: null
      }    
    }
  }
  onLogOutClick(){
    this.authService.logout().subscribe(
      (disconnected)=>{if(disconnected)this.alertService.success("Déconnexion effectuée avec succès");}
    );
  }
}
