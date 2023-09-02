import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTeacherComponent } from './admin/add-teacher/add-teacher.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddStudentComponent } from './admin/add-student/add-student.component';
import { TeacherHomepageComponent } from './teacher/teacher-homepage/teacher-homepage.component';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { StudentHomepageComponent } from './student/student-homepage/student-homepage.component';
import { LandingpageComponent } from './landing/landingpage/landingpage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './admin/login/login.component';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { TeacherComponent } from './admin/teacher/teacher.component';
import { StudentsComponent } from './admin/students/students.component';
import { ClassesComponent } from './admin/classes/classes.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { BodyComponent } from './admin/body/body.component';


@NgModule({
  declarations: [
    AppComponent,
    AddTeacherComponent,
    AddStudentComponent,
    StudentHomepageComponent,
    TeacherHomepageComponent,
    AdminHomepageComponent,
    LandingpageComponent,
    LoginComponent,
    SidenavComponent,
    AdminDashboardComponent,
    TeacherComponent,
    StudentsComponent,
    ClassesComponent,
    CoursesComponent,
    SettingsComponent,
    BodyComponent,
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
