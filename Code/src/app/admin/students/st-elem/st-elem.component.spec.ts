import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StElemComponent } from './st-elem.component';

describe('StElemComponent', () => {
  let component: StElemComponent;
  let fixture: ComponentFixture<StElemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StElemComponent]
    });
    fixture = TestBed.createComponent(StElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
