import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesComponent } from './classes.component';
import { departmentIdGuard } from 'src/app/guard/department-id.guard';
const routes: Routes = [
  {
    path: ':departmentId', 
    component: ClassesComponent, 
    canActivate:[departmentIdGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule { }
