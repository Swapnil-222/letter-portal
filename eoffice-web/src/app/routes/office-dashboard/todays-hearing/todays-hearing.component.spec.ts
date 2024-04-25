import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysHearingComponent } from './todays-hearing.component';

describe('TodaysHearingComponent', () => {
  let component: TodaysHearingComponent;
  let fixture: ComponentFixture<TodaysHearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodaysHearingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
