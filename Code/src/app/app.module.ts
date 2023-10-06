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
import { StudentContentComponent } from './student/student-content/student-content.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentSidenavComponent } from './student/student-sidenav/student-sidenav.component';
import { StudentWeeklyprogComponent } from './student/student-weeklyprog/student-weeklyprog.component';
import { StudentGradesComponent } from './student/student-grades/student-grades.component';
import { StudentSettingsComponent } from './student/student-settings/student-settings.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherSidenavComponent } from './teacher/teacher-sidenav/teacher-sidenav.component';
import { TeacherContentComponent } from './teacher/teacher-content/teacher-content.component';
import { AttendanceComponent } from './teacher/attendance/attendance.component';
import { TeacherClassesComponent } from './teacher/teacher-classes/teacher-classes.component';
import { TeacherWeeklyprogressComponent } from './teacher/teacher-weeklyprogress/teacher-weeklyprogress.component';
import { TeacherSettingsComponent } from './teacher/teacher-settings/teacher-settings.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { PrivacyComponent } from './admin/admin-settings/privacy/privacy.component';
import { TeacherAnalyticsComponent } from './teacher/teacher-analytics/teacher-analytics.component';
import { StudentAnalyticsComponent } from './student/student-analytics/student-analytics.component';


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
    StudentContentComponent,
    StudentDashboardComponent,
    StudentSidenavComponent,
    StudentWeeklyprogComponent,
    StudentGradesComponent,
    StudentSettingsComponent,
    TeacherDashboardComponent,
    TeacherSidenavComponent,
    TeacherContentComponent,
    AttendanceComponent,
    TeacherClassesComponent,
    TeacherWeeklyprogressComponent,
    TeacherSettingsComponent,
    AdminSettingsComponent,
    PrivacyComponent,
    TeacherAnalyticsComponent,
    StudentAnalyticsComponent,
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
