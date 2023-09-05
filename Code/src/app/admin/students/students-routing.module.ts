import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StHsComponent } from './st-hs/st-hs.component';
import { StShsComponent } from './st-shs/st-shs.component';
import { departmentIdGuard } from 'src/app/guard/department-id.guard';

const routes: Routes = [
  {
    path: ':departmentId',
    component: StudentsComponent,
    canActivate:[departmentIdGuard]
  }
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
