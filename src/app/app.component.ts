import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from './services/auth/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  constructor(private router: Router, private authService: AuthentificationService){}

  canShowSharedComponents(){
    return !this.router.url.includes('login') && !this.router.url.includes('register');
    //this.authService.isLoggedIn() && !this.router.url.includes('login');
  }
}
