import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { departmentIdGuard } from 'src/app/guard/department-id.guard';

const routes: Routes = [
  {
    path: ':departmentId',
    component: CoursesComponent,
    canActivate:[departmentIdGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
