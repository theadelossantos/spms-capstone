import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherComponent } from './teacher.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { THschoolComponent } from './t-hschool/t-hschool.component';
import { TShschoolComponent } from './t-shschool/t-shschool.component';
import { TElemComponent } from './t-elem/t-elem.component';


@NgModule({
  declarations: [
    TeacherComponent,
    THschoolComponent,
    TShschoolComponent,
    TElemComponent,

  ],
  imports: [
    CommonModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }
