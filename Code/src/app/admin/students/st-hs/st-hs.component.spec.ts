import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StHsComponent } from './st-hs.component';

describe('StHsComponent', () => {
  let component: StHsComponent;
  let fixture: ComponentFixture<StHsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StHsComponent]
    });
    fixture = TestBed.createComponent(StHsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
