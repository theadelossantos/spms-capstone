import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryGradesComponent } from './summary-grades.component';

describe('SummaryGradesComponent', () => {
  let component: SummaryGradesComponent;
  let fixture: ComponentFixture<SummaryGradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryGradesComponent]
    });
    fixture = TestBed.createComponent(SummaryGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
