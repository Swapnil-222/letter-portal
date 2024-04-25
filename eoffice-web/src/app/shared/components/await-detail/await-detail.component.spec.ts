import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitDetailComponent } from './await-detail.component';

describe('AwaitDetailComponent', () => {
  let component: AwaitDetailComponent;
  let fixture: ComponentFixture<AwaitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwaitDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwaitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
