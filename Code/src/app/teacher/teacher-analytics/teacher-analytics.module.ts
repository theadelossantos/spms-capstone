import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherAnalyticsRoutingModule } from './teacher-analytics-routing.module';
import { ItemAnalysisComponent } from './item-analysis/item-analysis.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ItemAnalysisComponent
  ],
  imports: [
    CommonModule,
    TeacherAnalyticsRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ]
})
export class TeacherAnalyticsModule { }
