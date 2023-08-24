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
@NgModule({
  declarations: [
    AppComponent,
    AddTeacherComponent,
    AddStudentComponent,
    StudentHomepageComponent,
    TeacherHomepageComponent,
    AdminHomepageComponent,
    LandingpageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
