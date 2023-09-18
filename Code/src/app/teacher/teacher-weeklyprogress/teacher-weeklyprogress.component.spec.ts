import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherWeeklyprogressComponent } from './teacher-weeklyprogress.component';

describe('TeacherWeeklyprogressComponent', () => {
  let component: TeacherWeeklyprogressComponent;
  let fixture: ComponentFixture<TeacherWeeklyprogressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherWeeklyprogressComponent]
    });
    fixture = TestBed.createComponent(TeacherWeeklyprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
