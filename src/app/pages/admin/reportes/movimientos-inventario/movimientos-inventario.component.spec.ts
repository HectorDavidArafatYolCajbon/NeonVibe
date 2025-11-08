import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosInventarioComponent } from './movimientos-inventario.component';

describe('MovimientosInventarioComponent', () => {
  let component: MovimientosInventarioComponent;
  let fixture: ComponentFixture<MovimientosInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovimientosInventarioComponent]
    });
    fixture = TestBed.createComponent(MovimientosInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
