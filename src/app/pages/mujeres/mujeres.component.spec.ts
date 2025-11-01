import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MujeresComponent } from './mujeres.component';

describe('MujeresComponent', () => {
  let component: MujeresComponent;
  let fixture: ComponentFixture<MujeresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MujeresComponent]
    });
    fixture = TestBed.createComponent(MujeresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
