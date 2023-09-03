import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TShschoolComponent } from './t-shschool.component';

describe('TShschoolComponent', () => {
  let component: TShschoolComponent;
  let fixture: ComponentFixture<TShschoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TShschoolComponent]
    });
    fixture = TestBed.createComponent(TShschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
