import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherAnalyticsComponent } from './teacher-analytics.component';
import { ItemAnalysisComponent } from './item-analysis/item-analysis.component';

const routes: Routes = [
  {
    path:'analysis-reports',
    component: TeacherAnalyticsComponent
  },
  {
    path: 'item-analysis/:deptId/:gradelvlId/:sectionId/:subjectId/:assignmentId',
    component: ItemAnalysisComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherAnalyticsRoutingModule { }
