import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWeeklyprogComponent } from './student-weeklyprog.component';

describe('StudentWeeklyprogComponent', () => {
  let component: StudentWeeklyprogComponent;
  let fixture: ComponentFixture<StudentWeeklyprogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentWeeklyprogComponent]
    });
    fixture = TestBed.createComponent(StudentWeeklyprogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
