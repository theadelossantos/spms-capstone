import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAnalyticsTeacherComponent } from './student-analytics-teacher.component';

describe('StudentAnalyticsTeacherComponent', () => {
  let component: StudentAnalyticsTeacherComponent;
  let fixture: ComponentFixture<StudentAnalyticsTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAnalyticsTeacherComponent]
    });
    fixture = TestBed.createComponent(StudentAnalyticsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
