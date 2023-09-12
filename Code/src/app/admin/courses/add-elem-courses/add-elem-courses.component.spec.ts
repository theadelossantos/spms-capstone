import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddElemCoursesComponent } from './add-elem-courses.component';

describe('AddElemCoursesComponent', () => {
  let component: AddElemCoursesComponent;
  let fixture: ComponentFixture<AddElemCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddElemCoursesComponent]
    });
    fixture = TestBed.createComponent(AddElemCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
