import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapatosHombresComponent } from './zapatos-hombres.component';

describe('ZapatosHombresComponent', () => {
  let component: ZapatosHombresComponent;
  let fixture: ComponentFixture<ZapatosHombresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZapatosHombresComponent]
    });
    fixture = TestBed.createComponent(ZapatosHombresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
