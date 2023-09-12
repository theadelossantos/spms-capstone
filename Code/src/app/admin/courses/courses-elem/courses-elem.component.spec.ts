import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesElemComponent } from './courses-elem.component';

describe('CoursesElemComponent', () => {
  let component: CoursesElemComponent;
  let fixture: ComponentFixture<CoursesElemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesElemComponent]
    });
    fixture = TestBed.createComponent(CoursesElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
