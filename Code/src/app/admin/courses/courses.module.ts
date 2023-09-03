import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { CoursesHsComponent } from './courses-hs/courses-hs.component';
import { CoursesShsComponent } from './courses-shs/courses-shs.component';


@NgModule({
  declarations: [
    CoursesComponent,
    CoursesHsComponent, 
    CoursesShsComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule
  ]
})
export class CoursesModule { }
