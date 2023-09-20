import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionGradesComponent } from './section-grades.component';

describe('SectionGradesComponent', () => {
  let component: SectionGradesComponent;
  let fixture: ComponentFixture<SectionGradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionGradesComponent]
    });
    fixture = TestBed.createComponent(SectionGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
