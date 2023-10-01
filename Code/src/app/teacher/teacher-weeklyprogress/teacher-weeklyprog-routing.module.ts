import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherWeeklyprogressComponent } from './teacher-weeklyprogress.component';
import { SectionWeeklyprogComponent } from './section-weeklyprog/section-weeklyprog.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherWeeklyprogressComponent,
  },
  {
    path: 'section-weeklyprog/:deptId/:gradelvlId/:sectionId/:subjectId/:assignmentId',
    component: SectionWeeklyprogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherWeeklyprogRoutingModule { }
