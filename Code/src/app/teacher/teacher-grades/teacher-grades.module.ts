import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherGradesComponent } from './teacher-grades.component';
import { TeacherGradesRoutingModule } from './teacher-grades-routing.module';
import { SectionGradesComponent } from './section-grades/section-grades.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TeacherGradesComponent,
    SectionGradesComponent
  ],
  imports: [
    CommonModule,
    TeacherGradesRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ]
})
export class TeacherGradesModule { }
