import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherComponent } from './teacher.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { THschoolComponent } from './t-hschool/t-hschool.component';
import { TShschoolComponent } from './t-shschool/t-shschool.component';


@NgModule({
  declarations: [
    TeacherComponent,
    THschoolComponent,
    TShschoolComponent,

  ],
  imports: [
    CommonModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }
