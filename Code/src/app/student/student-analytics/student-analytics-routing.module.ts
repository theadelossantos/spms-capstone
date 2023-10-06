import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectAnalyticsComponent } from './subject-analytics/subject-analytics.component';
import { StudentAnalyticsComponent } from './student-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: StudentAnalyticsComponent,
  },
  {
    path: 'subjects/:deptId/:gradelvlId/:sectionId/:subjectId',
    component: SubjectAnalyticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentAnalyticsRoutingModule { }
