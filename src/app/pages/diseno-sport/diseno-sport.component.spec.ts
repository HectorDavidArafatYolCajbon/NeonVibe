import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisenoSportComponent } from './diseno-sport.component';

describe('DisenoSportComponent', () => {
  let component: DisenoSportComponent;
  let fixture: ComponentFixture<DisenoSportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisenoSportComponent]
    });
    fixture = TestBed.createComponent(DisenoSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
