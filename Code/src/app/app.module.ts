import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeacherHomepageComponent } from './teacher/teacher-homepage/teacher-homepage.component';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { StudentHomepageComponent } from './student/student-homepage/student-homepage.component';
import { LandingpageComponent } from './landing/landingpage/landingpage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './admin/login/login.component';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { BodyComponent } from './admin/body/body.component';
import { TeacherSublevelMenuComponent } from './admin/sidenav/teacher-sublevel-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    StudentHomepageComponent,
    TeacherHomepageComponent,
    AdminHomepageComponent,
    LandingpageComponent,
    LoginComponent,
    SidenavComponent,
    AdminDashboardComponent,
    BodyComponent,
    TeacherSublevelMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule
],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
