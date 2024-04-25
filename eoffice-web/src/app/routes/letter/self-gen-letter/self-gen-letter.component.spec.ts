import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfGenLetterComponent } from './self-gen-letter.component';

describe('SelfGenLetterComponent', () => {
  let component: SelfGenLetterComponent;
  let fixture: ComponentFixture<SelfGenLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfGenLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfGenLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
