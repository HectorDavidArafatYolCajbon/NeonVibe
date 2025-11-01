import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-crear-usuario-dialog',
  templateUrl: './crear-usuario-dialog.component.html',
  styleUrls: ['./crear-usuario-dialog.component.scss'],
})
export class CrearUsuarioDialogComponent {
  constructor(public dialogRef: MatDialogRef<CrearUsuarioDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close(); // Cierra el modal
  }

  submitForm(form: NgForm): void {
    if (form.valid) {
      console.log('Formulario de creación de usuario:', form.value);
      this.dialogRef.close(); // Cierra el modal después de enviar el formulario
    } else {
      console.log('Formulario no válido');
    }
  }
}
