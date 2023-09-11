import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShssectionComponent } from './add-shssection.component';

describe('AddShssectionComponent', () => {
  let component: AddShssectionComponent;
  let fixture: ComponentFixture<AddShssectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddShssectionComponent]
    });
    fixture = TestBed.createComponent(AddShssectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
