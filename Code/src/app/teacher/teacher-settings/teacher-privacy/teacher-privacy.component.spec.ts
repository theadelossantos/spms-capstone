import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPrivacyComponent } from './teacher-privacy.component';

describe('TeacherPrivacyComponent', () => {
  let component: TeacherPrivacyComponent;
  let fixture: ComponentFixture<TeacherPrivacyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherPrivacyComponent]
    });
    fixture = TestBed.createComponent(TeacherPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
