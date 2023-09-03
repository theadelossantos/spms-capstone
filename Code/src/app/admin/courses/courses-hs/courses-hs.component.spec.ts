import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesHsComponent } from './courses-hs.component';

describe('CoursesHsComponent', () => {
  let component: CoursesHsComponent;
  let fixture: ComponentFixture<CoursesHsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesHsComponent]
    });
    fixture = TestBed.createComponent(CoursesHsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
