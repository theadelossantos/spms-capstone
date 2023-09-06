import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsectionComponent } from './addsection.component';

describe('AddsectionComponent', () => {
  let component: AddsectionComponent;
  let fixture: ComponentFixture<AddsectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddsectionComponent]
    });
    fixture = TestBed.createComponent(AddsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
