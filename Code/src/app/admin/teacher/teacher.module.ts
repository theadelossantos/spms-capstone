import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherComponent } from './teacher.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { THschoolComponent } from './t-hschool/t-hschool.component';
import { TShschoolComponent } from './t-shschool/t-shschool.component';
import { TElemComponent } from './t-elem/t-elem.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { EditTElemComponent } from './edit-t-elem/edit-t-elem.component';

@NgModule({
  declarations: [
    TeacherComponent,
    THschoolComponent,
    TShschoolComponent,
    TElemComponent,
    AddTeacherComponent,
    EditTElemComponent

  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ]
})
export class TeacherModule { }
