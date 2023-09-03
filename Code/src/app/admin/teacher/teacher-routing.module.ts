import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher.component';
import { THschoolComponent } from './t-hschool/t-hschool.component';
import { TShschoolComponent } from './t-shschool/t-shschool.component';

const routes: Routes = [
  {
    path:'elem',
    component: TeacherComponent
  }, 
  {
    path:'hs',
    component: THschoolComponent
  },
  {
    path:'shs',
    component:TShschoolComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
