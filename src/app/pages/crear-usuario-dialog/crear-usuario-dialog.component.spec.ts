import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUsuarioDialogComponent } from './crear-usuario-dialog.component';

describe('CrearUsuarioDialogComponent', () => {
  let component: CrearUsuarioDialogComponent;
  let fixture: ComponentFixture<CrearUsuarioDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearUsuarioDialogComponent]
    });
    fixture = TestBed.createComponent(CrearUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
