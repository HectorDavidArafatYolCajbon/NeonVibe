import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlusasComponent } from './blusas.component';

describe('BlusasComponent', () => {
  let component: BlusasComponent;
  let fixture: ComponentFixture<BlusasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlusasComponent]
    });
    fixture = TestBed.createComponent(BlusasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
