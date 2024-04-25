import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableLetterListComponent } from './editable-letter-list.component';

describe('EditableLetterListComponent', () => {
  let component: EditableLetterListComponent;
  let fixture: ComponentFixture<EditableLetterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableLetterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableLetterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
