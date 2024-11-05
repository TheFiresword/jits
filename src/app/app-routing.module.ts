import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/public/dashboard/dashboard.component';
import { PerformancesComponent } from './pages/public/performances/performances.component';
import { ContactsListComponent } from './pages/public/contacts-list/contacts-list.component';
import { CorrectionsComponent } from './pages/public/corrections/corrections.component';
import { DocumentsComponent } from './pages/public/documents/documents.component';
import { EnterprisesListComponent } from './pages/public/enterprises-list/enterprises-list.component';
import { GeneralComponent } from './pages/public/general/general.component';
import { GuideComponent } from './pages/public/guide/guide.component';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { LogoutComponent } from './pages/public/logout/logout.component';
import { MeetingsComponent } from './pages/public/meetings/meetings.component';
import { MembersListComponent } from './pages/public/members-list/members-list.component';
import { PositionsComponent } from './pages/public/positions/positions.component';
import { ProcessesComponent } from './pages/public/processes/processes.component';
import { ProjectsComponent } from './pages/public/projects/projects.component';
import { ReportsComponent } from './pages/public/reports/reports.component';
import { TreasuryComponent } from './pages/special-pages/treasury/treasury.component';
import { NotFoundComponent } from './pages/public/not-found/not-found.component';
import { ProfileComponent } from './pages/public/profile/profile.component';
import { isConnected, isDiconnected } from './guards/authentification-guard';
import { WrapperComponent } from './wrapper/wrapper.component';
import { MemberCardComponent } from './pages/public/member-card/member-card.component';
import { PurchaseCardComponent } from './shared/purchase-card/purchase-card.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [isDiconnected]
  },

  {
    path: 'register',
    component: RegisterComponent,
    //canActivate: [isConnected]
  },

  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [isConnected]
  },
  
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch : 'full'
      },
      
      {
        path: 'dashboard',
        component: DashboardComponent,
        //canActivate: [isConnected]
      },
    
      {
        path: 'performances',
        component: PerformancesComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'contacts',
        component: ContactsListComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'corrections',
        component: CorrectionsComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'documents',
        component: DocumentsComponent,
        //canActivate: [isConnected]
      },
    
      {
        path: 'enterprises',
        component: EnterprisesListComponent,
        canActivate: [isConnected]
      },
      {
        path: 'general',
        component: GeneralComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'guide',
        component: GuideComponent,
        canActivate: [isConnected]
      },
      {
        path: 'meetings',
        component: MeetingsComponent,
        //canActivate: [isConnected]
      },
    
      {
        path: 'students',
        component: MembersListComponent,
        //canActivate: [isConnected]
      },
      {
        path: 'students/:id',
        component: MemberCardComponent,
        //canActivate: [isConnected]
      },
      
    
      {
        path: 'positions',
        component: PositionsComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'processes',
        component: ProcessesComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [isConnected]
      },
    
      {
        path: 'treasury',
        children : [
          {
            path: '',
            component: TreasuryComponent
          },
          {
            path: 'purchase/:id',
            component : PurchaseCardComponent
          }
        ]
        //canActivate: [isConnected]
      },
    
      {
        path: 'profile',
        component: ProfileComponent,
        //canActivate: [isConnected]
      },
    ],
    component: WrapperComponent
  },
  
  {
    path: '**',
    component: NotFoundComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
