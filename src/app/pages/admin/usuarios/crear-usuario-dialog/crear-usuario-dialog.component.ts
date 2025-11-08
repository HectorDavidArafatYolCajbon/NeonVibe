import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { UsuariosService } from '../../../../services/usuarios.service';

@Component({
  selector: 'app-crear-usuario-dialog',
  templateUrl: './crear-usuario-dialog.component.html',
  styleUrls: ['./crear-usuario-dialog.component.scss']
})
export class CrearUsuarioDialogComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearUsuarioDialogComponent>,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required]],
      nit: [''],
      direccion: [''],
      id_rol: [2] // 2 para cliente por defecto
    });
  }

  ngOnInit() {}

  async guardarUsuario() {
    if (this.usuarioForm.invalid) {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;
    try {
      const usuario = await firstValueFrom(this.usuariosService.crearUsuario(this.usuarioForm.value));
      this.dialogRef.close(usuario);
      this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      this.snackBar.open('Error al crear el usuario', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
