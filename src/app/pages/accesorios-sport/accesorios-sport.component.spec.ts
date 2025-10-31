import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoriosSportComponent } from './accesorios-sport.component';

describe('AccesoriosSportComponent', () => {
  let component: AccesoriosSportComponent;
  let fixture: ComponentFixture<AccesoriosSportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccesoriosSportComponent]
    });
    fixture = TestBed.createComponent(AccesoriosSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
