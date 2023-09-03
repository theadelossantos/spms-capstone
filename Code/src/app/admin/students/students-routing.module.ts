import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StHsComponent } from './st-hs/st-hs.component';
import { StShsComponent } from './st-shs/st-shs.component';

const routes: Routes = [
  {
    path: 'elem',
    component: StudentsComponent
  }, 
  {
    path: 'hs',
    component: StHsComponent
  },
  {
    path: 'shs',
    component: StShsComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
