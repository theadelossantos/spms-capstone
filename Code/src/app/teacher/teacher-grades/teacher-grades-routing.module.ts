import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherGradesComponent } from './teacher-grades.component';
import { SectionGradesComponent } from './section-grades/section-grades.component';
import { SummaryGradesComponent } from './summary-grades/summary-grades.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherGradesComponent,
  },
  {
    path: 'section-grades/:deptId/:gradelvlId/:sectionId/:subjectId/:assignmentId',
    component: SectionGradesComponent, 
  },
  {
    path: 'summary/:deptId/:gradelvlId/:sectionId/:subjectId/:assignmentId',
    component: SummaryGradesComponent  
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherGradesRoutingModule {}
