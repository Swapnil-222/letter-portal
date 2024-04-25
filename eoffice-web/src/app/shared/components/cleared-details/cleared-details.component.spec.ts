import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearedDetailsComponent } from './cleared-details.component';

describe('ClearedDetailsComponent', () => {
  let component: ClearedDetailsComponent;
  let fixture: ComponentFixture<ClearedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
