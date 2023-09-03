import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { CoursesHsComponent } from './courses-hs/courses-hs.component';
import { CoursesShsComponent } from './courses-shs/courses-shs.component';

const routes: Routes = [
  {
    path: 'elem',
    component: CoursesComponent
  },
  {
    path: 'hs',
    component: CoursesHsComponent
  },
  {
    path: 'shs',
    component: CoursesShsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
