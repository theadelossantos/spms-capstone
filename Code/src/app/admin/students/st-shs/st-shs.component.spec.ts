import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StShsComponent } from './st-shs.component';

describe('StShsComponent', () => {
  let component: StShsComponent;
  let fixture: ComponentFixture<StShsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StShsComponent]
    });
    fixture = TestBed.createComponent(StShsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
