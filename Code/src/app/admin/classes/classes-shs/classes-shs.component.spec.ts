import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesShsComponent } from './classes-shs.component';

describe('ClassesShsComponent', () => {
  let component: ClassesShsComponent;
  let fixture: ComponentFixture<ClassesShsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassesShsComponent]
    });
    fixture = TestBed.createComponent(ClassesShsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
