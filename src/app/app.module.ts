import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { LogoutComponent } from './pages/public/logout/logout.component';
import { DashboardComponent } from './pages/public/dashboard/dashboard.component';
import { GeneralComponent } from './pages/public/general/general.component';
import { PerformancesComponent } from './pages/public/performances/performances.component';
import { ContactsListComponent } from './pages/public/contacts-list/contacts-list.component';
import { MembersListComponent } from './pages/public/members-list/members-list.component';
import { EnterprisesListComponent } from './pages/public/enterprises-list/enterprises-list.component';
import { MeetingsComponent } from './pages/public/meetings/meetings.component';
import { ProjectsComponent } from './pages/public/projects/projects.component';
import { DocumentsComponent } from './pages/public/documents/documents.component';
import { CorrectionsComponent } from './pages/public/corrections/corrections.component';
import { ProcessesComponent } from './pages/public/processes/processes.component';
import { PositionsComponent } from './pages/public/positions/positions.component';
import { ReportsComponent } from './pages/public/reports/reports.component';
import { NotificationsComponent } from './pages/public/notifications/notifications.component';
import { GuideComponent } from './pages/public/guide/guide.component';
import { NotFoundComponent } from './pages/public/not-found/not-found.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ProfileComponent } from './pages/public/profile/profile.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WrapperComponent } from './wrapper/wrapper.component';
import { EvolutionPipe } from './pipes/evolution.pipe';
import { PercentPipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TreasuryComponent } from './pages/special-pages/treasury/treasury.component';
import { DataTablesModule } from "angular-datatables";
import { DatatableComponent } from './shared/datatable/datatable.component';
import { MonthlySalesPlotComponent } from './shared/monthly-sales-plot/monthly-sales-plot.component';
import { CalendarComponent } from './shared/calendar/calendar.component';
import { StatsCardComponent } from './shared/stats-card/stats-card.component';
import { TvaDeclaratifComponent } from './shared/tva-declaratif/tva-declaratif.component';
import { ChatBotComponent } from './shared/chat-bot/chat-bot.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MemberCardComponent } from './pages/public/member-card/member-card.component';
import { PurchaseCardComponent } from './shared/purchase-card/purchase-card.component';

// Boostrap

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    DashboardComponent,
    GeneralComponent,
    PerformancesComponent,
    ContactsListComponent,
    MembersListComponent,
    EnterprisesListComponent,
    MeetingsComponent,
    ProjectsComponent,
    DocumentsComponent,
    CorrectionsComponent,
    ProcessesComponent,
    PositionsComponent,
    ReportsComponent,
    NotificationsComponent,
    GuideComponent,
    NotFoundComponent,
    ProfileComponent,
    WrapperComponent,
    TreasuryComponent,
    EvolutionPipe,
    DatatableComponent,
    MonthlySalesPlotComponent,
    CalendarComponent,
    StatsCardComponent,
    TvaDeclaratifComponent,
    ChatBotComponent,
    ConfirmDialogComponent,
    MemberCardComponent,
    PurchaseCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DataTablesModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'fr'},
    PercentPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(){
    registerLocaleData(localeFr);
  }
}
