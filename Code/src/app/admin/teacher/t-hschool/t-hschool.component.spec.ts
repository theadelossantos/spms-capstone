import { ComponentFixture, TestBed } from '@angular/core/testing';

import { THschoolComponent } from './t-hschool.component';

describe('THschoolComponent', () => {
  let component: THschoolComponent;
  let fixture: ComponentFixture<THschoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [THschoolComponent]
    });
    fixture = TestBed.createComponent(THschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
