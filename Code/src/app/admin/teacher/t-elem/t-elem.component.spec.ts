import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TElemComponent } from './t-elem.component';

describe('TElemComponent', () => {
  let component: TElemComponent;
  let fixture: ComponentFixture<TElemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TElemComponent]
    });
    fixture = TestBed.createComponent(TElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
