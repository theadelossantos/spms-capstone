import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherGradesComponent } from './teacher-grades.component';
import { TeacherGradesRoutingModule } from './teacher-grades-routing.module';
import { SectionGradesComponent } from './section-grades/section-grades.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SummaryGradesComponent } from './summary-grades/summary-grades.component';



@NgModule({
  declarations: [
    TeacherGradesComponent,
    SectionGradesComponent,
    SummaryGradesComponent
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
