import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParameterComponent } from './create-parameter.component';

describe('CreateParameterComponent', () => {
  let component: CreateParameterComponent;
  let fixture: ComponentFixture<CreateParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
