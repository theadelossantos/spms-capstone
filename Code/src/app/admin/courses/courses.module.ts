import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { CoursesHsComponent } from './courses-hs/courses-hs.component';
import { CoursesShsComponent } from './courses-shs/courses-shs.component';
import { CoursesElemComponent } from './courses-elem/courses-elem.component';
import { FormsModule } from '@angular/forms';
import { AddElemCoursesComponent } from './add-elem-courses/add-elem-courses.component';
import { AddHsCoursesComponent } from './add-hs-courses/add-hs-courses.component';
import { AddShsCoursesComponent } from './add-shs-courses/add-shs-courses.component';



@NgModule({
  declarations: [
    CoursesComponent,
    CoursesHsComponent, 
    CoursesShsComponent, CoursesElemComponent, AddElemCoursesComponent, AddHsCoursesComponent, AddShsCoursesComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ]
})
export class CoursesModule { }
