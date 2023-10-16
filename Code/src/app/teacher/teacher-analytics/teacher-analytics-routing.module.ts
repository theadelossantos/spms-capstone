import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherAnalyticsComponent } from './teacher-analytics.component';
import { ItemAnalysisComponent } from './item-analysis/item-analysis.component';
import { StudentAnalyticsTeacherComponent } from './student-analytics-teacher/student-analytics-teacher.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { IndividualAnalyticsComponent } from './individual-analytics/individual-analytics.component';

const routes: Routes = [
  {
    path:'analysis-reports',
    component: TeacherAnalyticsComponent
  },
  {
    path: 'item-analysis/:deptId/:gradelvlId/:sectionId/:subjectId/:assignmentId',
    component: ItemAnalysisComponent,
  },
  {
    path: 'student-analytics',
    component: StudentAnalyticsTeacherComponent,
  },
  {
    path: 'students-list/:deptId/:gradelvlId/:sectionId',
    component: StudentsListComponent,
  },
  {
    path: 'indiv-analytics/:studentId',
    component: IndividualAnalyticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherAnalyticsRoutingModule { }
