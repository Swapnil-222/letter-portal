import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLetterComponent } from './list-letter.component';

describe('ListLetterComponent', () => {
  let component: ListLetterComponent;
  let fixture: ComponentFixture<ListLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
