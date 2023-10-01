import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionWeeklyprogComponent } from './section-weeklyprog.component';

describe('SectionWeeklyprogComponent', () => {
  let component: SectionWeeklyprogComponent;
  let fixture: ComponentFixture<SectionWeeklyprogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectionWeeklyprogComponent]
    });
    fixture = TestBed.createComponent(SectionWeeklyprogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
