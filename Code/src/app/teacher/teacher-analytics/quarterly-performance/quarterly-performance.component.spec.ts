import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterlyPerformanceComponent } from './quarterly-performance.component';

describe('QuarterlyPerformanceComponent', () => {
  let component: QuarterlyPerformanceComponent;
  let fixture: ComponentFixture<QuarterlyPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuarterlyPerformanceComponent]
    });
    fixture = TestBed.createComponent(QuarterlyPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
