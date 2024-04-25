import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParameterComponent } from './list-parameter.component';

describe('ListParameterComponent', () => {
  let component: ListParameterComponent;
  let fixture: ComponentFixture<ListParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
