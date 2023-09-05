import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassesRoutingModule } from './classes-routing.module';
import { ClassesComponent } from './classes.component';
import { ClassesHsComponent } from './classes-hs/classes-hs.component';
import { ClassesShsComponent } from './classes-shs/classes-shs.component';


@NgModule({
  declarations: [
    ClassesComponent,
    ClassesHsComponent,
    ClassesShsComponent
  ],
  imports: [
    CommonModule,
    ClassesRoutingModule
  ]
})
export class ClassesModule { }