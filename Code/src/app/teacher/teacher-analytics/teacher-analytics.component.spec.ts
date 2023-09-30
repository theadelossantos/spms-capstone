import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAnalyticsComponent } from './teacher-analytics.component';

describe('TeacherAnalyticsComponent', () => {
  let component: TeacherAnalyticsComponent;
  let fixture: ComponentFixture<TeacherAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherAnalyticsComponent]
    });
    fixture = TestBed.createComponent(TeacherAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
