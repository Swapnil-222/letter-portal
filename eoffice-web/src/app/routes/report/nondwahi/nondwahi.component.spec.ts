import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NondwahiComponent } from './nondwahi.component';

describe('NondwahiComponent', () => {
  let component: NondwahiComponent;
  let fixture: ComponentFixture<NondwahiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NondwahiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NondwahiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
