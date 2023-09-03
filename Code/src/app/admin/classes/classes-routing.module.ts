import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesComponent } from './classes.component';
import { ClassesHsComponent } from './classes-hs/classes-hs.component';
import { ClassesShsComponent } from './classes-shs/classes-shs.component';

const routes: Routes = [
  {
    path: 'elem',
    component: ClassesComponent
  }, 
  {
    path: 'hs',
    component: ClassesHsComponent
  },
  {
    path: 'shs',
    component: ClassesShsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule { }
