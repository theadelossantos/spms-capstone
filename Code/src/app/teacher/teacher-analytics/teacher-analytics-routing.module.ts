import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherAnalyticsComponent } from './teacher-analytics.component';
import { StudentAnalyticsTeacherComponent } from './student-analytics-teacher/student-analytics-teacher.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { IndividualAnalyticsComponent } from './individual-analytics/individual-analytics.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherAnalyticsRoutingModule { }
