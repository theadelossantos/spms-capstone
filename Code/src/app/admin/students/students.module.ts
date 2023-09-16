import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStudentComponent } from './add-student/add-student.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StHsComponent } from './st-hs/st-hs.component';
import { StShsComponent } from './st-shs/st-shs.component';
import { StElemComponent } from './st-elem/st-elem.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentsComponent,
    StHsComponent,
    StShsComponent,
    StElemComponent,
    AddStudentComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ]
})
export class StudentsModule { }
