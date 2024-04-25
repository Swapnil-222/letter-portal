import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandedOverComponent } from './handed-over.component';

describe('HandedOverComponent', () => {
  let component: HandedOverComponent;
  let fixture: ComponentFixture<HandedOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandedOverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandedOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
