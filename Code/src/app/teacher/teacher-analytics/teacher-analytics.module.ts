import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherAnalyticsRoutingModule } from './teacher-analytics-routing.module';
import { ItemAnalysisComponent } from './item-analysis/item-analysis.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { StudentAnalyticsTeacherComponent } from './student-analytics-teacher/student-analytics-teacher.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { IndividualAnalyticsComponent } from './individual-analytics/individual-analytics.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { QuarterlyPerformanceComponent } from './quarterly-performance/quarterly-performance.component';

@NgModule({
  declarations: [
    ItemAnalysisComponent,
    StudentAnalyticsTeacherComponent,
    StudentsListComponent,
    IndividualAnalyticsComponent,
    QuarterlyPerformanceComponent
  ],
  imports: [
    CommonModule,
    TeacherAnalyticsRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot()

  ]
})
export class TeacherAnalyticsModule { }
