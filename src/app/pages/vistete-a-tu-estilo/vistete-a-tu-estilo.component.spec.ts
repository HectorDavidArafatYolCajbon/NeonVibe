import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisteteATuEstiloComponent } from './vistete-a-tu-estilo.component';

describe('VisteteATuEstiloComponent', () => {
  let component: VisteteATuEstiloComponent;
  let fixture: ComponentFixture<VisteteATuEstiloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisteteATuEstiloComponent]
    });
    fixture = TestBed.createComponent(VisteteATuEstiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
