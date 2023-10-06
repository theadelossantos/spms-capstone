import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { StudentAnalyticsRoutingModule } from './student-analytics-routing.module';
import { SubjectAnalyticsComponent } from './subject-analytics/subject-analytics.component';

@NgModule({
  declarations: [
    SubjectAnalyticsComponent
  ],
  imports: [
    CommonModule,
    StudentAnalyticsRoutingModule,
    NgCircleProgressModule.forRoot()
  ]
})
export class StudentAnalyticsModule { }
