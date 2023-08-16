import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { TeacherHomepageComponent } from './teacher/teacher-homepage/teacher-homepage.component';
import { StudentHomepageComponent } from './student/student-homepage/student-homepage.component';

const routes: Routes = [
 {
  path: 'admin/admin-homepage', component:AdminHomepageComponent, canActivate: [AuthGuardService], data: { expectedRole: 'admin' }
 },
 {
  path: 'teacher/teacher-homepage', component:TeacherHomepageComponent, canActivate: [AuthGuardService], data: { expectedRole: 'teacher' }
 },
 {
  path: 'student/student-homepage', component:StudentHomepageComponent, canActivate: [AuthGuardService], data: { expectedRole: 'student' }
 },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
