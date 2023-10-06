import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAnalyticsComponent } from './student-analytics.component';

describe('StudentAnalyticsComponent', () => {
  let component: StudentAnalyticsComponent;
  let fixture: ComponentFixture<StudentAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAnalyticsComponent]
    });
    fixture = TestBed.createComponent(StudentAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
