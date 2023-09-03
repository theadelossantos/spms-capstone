import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesHsComponent } from './classes-hs.component';

describe('ClassesHsComponent', () => {
  let component: ClassesHsComponent;
  let fixture: ComponentFixture<ClassesHsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassesHsComponent]
    });
    fixture = TestBed.createComponent(ClassesHsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
