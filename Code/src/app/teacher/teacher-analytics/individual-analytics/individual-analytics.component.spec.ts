import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAnalyticsComponent } from './individual-analytics.component';

describe('IndividualAnalyticsComponent', () => {
  let component: IndividualAnalyticsComponent;
  let fixture: ComponentFixture<IndividualAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualAnalyticsComponent]
    });
    fixture = TestBed.createComponent(IndividualAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
