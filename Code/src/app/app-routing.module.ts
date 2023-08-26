import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { TeacherHomepageComponent } from './teacher/teacher-homepage/teacher-homepage.component';
import { StudentHomepageComponent } from './student/student-homepage/student-homepage.component';
import { LandingpageComponent } from './landing/landingpage/landingpage.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
 {
  path: 'admin/admin-homepage', component:AdminHomepageComponent
 },
 {
  path: 'teacher/teacher-homepage', component:TeacherHomepageComponent
 },
 {
  path: 'student', component:StudentHomepageComponent, canActivate:[AuthGuard], data:{ roles: ['student']}
 },
 {
  path:'', component:LandingpageComponent
 },
 {
  path: '', redirectTo: '', pathMatch: 'full'
 },
 {
  path: '**', redirectTo: ''
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
