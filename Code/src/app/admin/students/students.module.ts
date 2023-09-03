import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StHsComponent } from './st-hs/st-hs.component';
import { StShsComponent } from './st-shs/st-shs.component';


@NgModule({
  declarations: [
    StudentsComponent,
    StHsComponent,
    StShsComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule
  ]
})
export class StudentsModule { }
