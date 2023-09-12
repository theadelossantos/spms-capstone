import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHsCoursesComponent } from './add-hs-courses.component';

describe('AddHsCoursesComponent', () => {
  let component: AddHsCoursesComponent;
  let fixture: ComponentFixture<AddHsCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHsCoursesComponent]
    });
    fixture = TestBed.createComponent(AddHsCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
