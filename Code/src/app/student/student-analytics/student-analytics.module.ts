import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { StudentAnalyticsRoutingModule } from './student-analytics-routing.module';
import { SubjectAnalyticsComponent } from './subject-analytics/subject-analytics.component';
import { OverallPerformanceComponent } from './overall-performance/overall-performance.component';

@NgModule({
  declarations: [
    SubjectAnalyticsComponent,
    OverallPerformanceComponent
  ],
  imports: [
    CommonModule,
    StudentAnalyticsRoutingModule,
    NgCircleProgressModule.forRoot()
  ]
})
export class StudentAnalyticsModule { }
