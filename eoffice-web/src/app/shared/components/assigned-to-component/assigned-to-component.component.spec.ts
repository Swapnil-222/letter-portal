import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedToComponentComponent } from './assigned-to-component.component';

describe('AssignedToComponentComponent', () => {
  let component: AssignedToComponentComponent;
  let fixture: ComponentFixture<AssignedToComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedToComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedToComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
