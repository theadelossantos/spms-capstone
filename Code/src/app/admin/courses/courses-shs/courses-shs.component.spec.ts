import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesShsComponent } from './courses-shs.component';

describe('CoursesShsComponent', () => {
  let component: CoursesShsComponent;
  let fixture: ComponentFixture<CoursesShsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesShsComponent]
    });
    fixture = TestBed.createComponent(CoursesShsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
