import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeLoNuevoEnModaComponent } from './de-lo-nuevo-en-moda.component';

describe('DeLoNuevoEnModaComponent', () => {
  let component: DeLoNuevoEnModaComponent;
  let fixture: ComponentFixture<DeLoNuevoEnModaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeLoNuevoEnModaComponent]
    });
    fixture = TestBed.createComponent(DeLoNuevoEnModaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
