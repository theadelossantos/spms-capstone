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
import { AddTeacherComponent } from './admin/teacher/add-teacher/add-teacher.component';
import { AddStudentComponent } from './admin/students/add-student/add-student.component';
import { ClassesComponent } from './admin/classes/classes.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { TeacherModule } from './admin/teacher/teacher.module';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { StudentWeeklyprogComponent } from './student/student-weeklyprog/student-weeklyprog.component';
import { StudentGradesComponent } from './student/student-grades/student-grades.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { AttendanceComponent } from './teacher/attendance/attendance.component';
import { TeacherWeeklyprogressComponent } from './teacher/teacher-weeklyprogress/teacher-weeklyprogress.component';
import { TeacherGradesComponent } from './teacher/teacher-grades/teacher-grades.component';
import { TeacherAnalyticsComponent } from './teacher/teacher-analytics/teacher-analytics.component';
import { StudentAnalyticsComponent } from './student/student-analytics/student-analytics.component';
import { ForgotPasswordComponent } from './landing/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './landing/reset-password/reset-password.component';
const routes: Routes = [
 {
  path: 'admin', component:LoginComponent
 },
 {
  path: 'forgot-password', component:ForgotPasswordComponent
 },
 {
  path: 'reset-password/:token',
  component: ResetPasswordComponent,
},
 {
  path: 'teacher', 
  component:TeacherHomepageComponent,
  canActivate:[AuthGuard], 
  data:{ roles: ['teacher']},
  children:[
    {
      path:'',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      component: TeacherDashboardComponent,
    },
    {
      path: 'attendance',
      component: AttendanceComponent,
    },
    {
      path: 'weeklyprog',
      loadChildren:() => import ('./teacher/teacher-weeklyprogress/teacher-weeklyprog.module').then(m => m.TeacherWeeklyprogModule)
    },
    {
      path: 'grades',
      loadChildren:() => import('./teacher/teacher-grades/teacher-grades.module').then(m => m.TeacherGradesModule),
    },
    {
      path: 'settings',
      loadChildren:() => import('./teacher/teacher-settings/teacher-settings.module').then(m => m.TeacherSettingsModule)
    },
    {
      path: 'analytics',
      component: TeacherAnalyticsComponent
    },

  ]
 },
 {
  path: 'student',
  component:StudentHomepageComponent, 
  canActivate:[AuthGuard], 
  data:{ roles: ['student']},
  children: [
    {
      path:'',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      component: StudentDashboardComponent,
    },
    {
      path: 'weeklyprog',
      component: StudentWeeklyprogComponent,
    },
    {
      path: 'grades',
      component: StudentGradesComponent,
    },
    {
      path: 'analytics',
      loadChildren:() => import('./student/student-analytics/student-analytics.module').then(m => m.StudentAnalyticsModule)
    },
    {
      path: 'settings',
      loadChildren:() => import('./student/student-settings/student-settings.module').then(m => m.StudentSettingsModule)
    }
  ]
 },
 {
  path: 'admin-home', component:AdminHomepageComponent,
  canActivate:[AuthGuard], 
  data:{ roles:['admin']},
  children: [
    {
      path:'',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      component: AdminDashboardComponent,
    },
    {
      path: 'teachers',
      loadChildren:() => import('./admin/teacher/teacher.module').then(m => m.TeacherModule)

    },
    {
      path: 'students',
      loadChildren:() => import('./admin/students/students.module').then(m => m.StudentsModule)
    },
    {
      path: 'classes',
      loadChildren:() => import('./admin/classes/classes.module').then(m => m.ClassesModule)
    },
    {
      path: 'courses',
      loadChildren:() => import('./admin/courses/courses.module').then(m => m.CoursesModule)
    },
    {
      path: 'settings',
      loadChildren:() => import('./admin/admin-settings/admin-settings.module').then(m => m.AdminSettingsModule)
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
