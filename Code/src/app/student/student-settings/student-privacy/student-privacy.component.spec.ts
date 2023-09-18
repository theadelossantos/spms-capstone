import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPrivacyComponent } from './student-privacy.component';

describe('StudentPrivacyComponent', () => {
  let component: StudentPrivacyComponent;
  let fixture: ComponentFixture<StudentPrivacyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentPrivacyComponent]
    });
    fixture = TestBed.createComponent(StudentPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
