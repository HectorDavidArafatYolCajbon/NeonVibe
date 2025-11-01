import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapatosMujeresComponent } from './zapatos-mujeres.component';

describe('ZapatosMujeresComponent', () => {
  let component: ZapatosMujeresComponent;
  let fixture: ComponentFixture<ZapatosMujeresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZapatosMujeresComponent]
    });
    fixture = TestBed.createComponent(ZapatosMujeresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
