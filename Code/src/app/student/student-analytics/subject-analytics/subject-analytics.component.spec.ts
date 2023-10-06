import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectAnalyticsComponent } from './subject-analytics.component';

describe('SubjectAnalyticsComponent', () => {
  let component: SubjectAnalyticsComponent;
  let fixture: ComponentFixture<SubjectAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectAnalyticsComponent]
    });
    fixture = TestBed.createComponent(SubjectAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
