import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassesRoutingModule } from './classes-routing.module';
import { ClassesComponent } from './classes.component';
import { ClassesHsComponent } from './classes-hs/classes-hs.component';
import { ClassesShsComponent } from './classes-shs/classes-shs.component';
import { ClassesElemComponent } from './classes-elem/classes-elem.component';
import { AddsectionComponent } from './addsection/addsection.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ClassesComponent,
    ClassesHsComponent,
    ClassesShsComponent,
    ClassesElemComponent,
    AddsectionComponent,
  ],
  imports: [
    CommonModule,
    ClassesRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,

  ]
})
export class ClassesModule { }
