import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherWeeklyprogRoutingModule } from './teacher-weeklyprog-routing.module';
import { SectionWeeklyprogComponent } from './section-weeklyprog/section-weeklyprog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SectionWeeklyprogComponent
  ],
  imports: [
    CommonModule,
    TeacherWeeklyprogRoutingModule, 
    FormsModule, 
    ReactiveFormsModule,
    NgbModule

  ]
})
export class TeacherWeeklyprogModule { }
