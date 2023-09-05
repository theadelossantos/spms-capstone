import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesElemComponent } from './classes-elem.component';

describe('ClassesElemComponent', () => {
  let component: ClassesElemComponent;
  let fixture: ComponentFixture<ClassesElemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassesElemComponent]
    });
    fixture = TestBed.createComponent(ClassesElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
