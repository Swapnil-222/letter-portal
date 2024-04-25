import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhoshwaraComponent } from './ghoshwara.component';

describe('GhoshwaraComponent', () => {
  let component: GhoshwaraComponent;
  let fixture: ComponentFixture<GhoshwaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhoshwaraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GhoshwaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
