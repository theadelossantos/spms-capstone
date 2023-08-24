import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { TeacherHomepageComponent } from './teacher/teacher-homepage/teacher-homepage.component';
import { StudentHomepageComponent } from './student/student-homepage/student-homepage.component';
import { AuthguardService } from './services/authguard.service';
import { LandingpageComponent } from './landing/landingpage/landingpage.component';

const routes: Routes = [
 {
  path: 'admin/admin-homepage', component:AdminHomepageComponent, canActivate:[AuthguardService], data:{ roles: ['student']}
 },
 {
  path: 'teacher/teacher-homepage', component:TeacherHomepageComponent
 },
 {
  path: 'student', component:StudentHomepageComponent
 },
 {
  path:'', component:LandingpageComponent
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
