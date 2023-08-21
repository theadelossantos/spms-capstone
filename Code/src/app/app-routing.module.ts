import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { TeacherHomepageComponent } from './teacher/teacher-homepage/teacher-homepage.component';
import { StudentHomepageComponent } from './student/student-homepage/student-homepage.component';

const routes: Routes = [
 {
  path: 'admin/admin-homepage', component:AdminHomepageComponent
 },
 {
  path: 'teacher/teacher-homepage', component:TeacherHomepageComponent
 },
 {
  path: 'student/student-homepage', component:StudentHomepageComponent
 },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
