import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHssectionComponent } from './add-hssection.component';

describe('AddHssectionComponent', () => {
  let component: AddHssectionComponent;
  let fixture: ComponentFixture<AddHssectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHssectionComponent]
    });
    fixture = TestBed.createComponent(AddHssectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
