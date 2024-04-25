import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingComplitedComponent } from './hearing-complited.component';

describe('HearingComplitedComponent', () => {
  let component: HearingComplitedComponent;
  let fixture: ComponentFixture<HearingComplitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HearingComplitedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingComplitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
