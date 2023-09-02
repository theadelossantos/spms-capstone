import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomepageComponent } from './admin/admin-homepage/admin-homepage.component';
import { TeacherHomepageComponent } from './teacher/teacher-homepage/teacher-homepage.component';
import { StudentHomepageComponent } from './student/student-homepage/student-homepage.component';
import { LandingpageComponent } from './landing/landingpage/landingpage.component';
import { LoginComponent } from './admin/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { adminGuard } from './guard/admin.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AddTeacherComponent } from './admin/add-teacher/add-teacher.component';
import { AddStudentComponent } from './admin/add-student/add-student.component';
import { ClassesComponent } from './admin/classes/classes.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { SettingsComponent } from './admin/settings/settings.component';

const routes: Routes = [
 {
  path: 'admin', component:LoginComponent
 },
 {
  path: 'teacher/teacher-homepage', component:TeacherHomepageComponent
 },
 {
  path: 'student', component:StudentHomepageComponent, canActivate:[AuthGuard], data:{ roles: ['student']}
 },
 {
  path: 'admin-home', component:AdminHomepageComponent,
  canActivate:[AuthGuard], 
  data:{ roles:['admin']},
  children: [
    {
      path: 'dashboard',
      component: AdminDashboardComponent,
    },
    {
      path: 'teachers',
      component: AddTeacherComponent,
    },
    {
      path: 'students',
      component: AddStudentComponent,
    },
    {
      path: 'classes',
      component: ClassesComponent,
    },
    {
      path: 'courses',
      component: CoursesComponent,
    },
    {
      path: 'settings',
      component: SettingsComponent,
    },
    
  ],
 },
 {
  path: '', redirectTo: '', pathMatch: 'full'
 },
 {
  path: '**', redirectTo: ''
 },
 {
  path:'', component:LandingpageComponent
 },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
