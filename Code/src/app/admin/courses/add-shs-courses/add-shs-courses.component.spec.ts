import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShsCoursesComponent } from './add-shs-courses.component';

describe('AddShsCoursesComponent', () => {
  let component: AddShsCoursesComponent;
  let fixture: ComponentFixture<AddShsCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddShsCoursesComponent]
    });
    fixture = TestBed.createComponent(AddShsCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
