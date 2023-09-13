import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTElemComponent } from './edit-t-elem.component';

describe('EditTElemComponent', () => {
  let component: EditTElemComponent;
  let fixture: ComponentFixture<EditTElemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTElemComponent]
    });
    fixture = TestBed.createComponent(EditTElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
