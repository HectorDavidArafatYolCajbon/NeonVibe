import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-crear-usuario-dialog',
  templateUrl: './crear-usuario-dialog.component.html',
  styleUrls: ['./crear-usuario-dialog.component.scss'],
})
export class CrearUsuarioDialogComponent {
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CrearUsuarioDialogComponent>,
    private authService: AuthService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  closeDialog(): void {
    this.dialogRef.close(); // Cierra el modal
  }

  submitForm(form: NgForm): void {
    if (form.valid) {
      const formValue = form.value;
      const nombre = formValue.fullName;
      const email = formValue.email;
      const telefono = formValue.telefono;
      const nit = formValue.nit || '';
      const direccion = formValue.direccion;
      const password = formValue.password;
      const confirmPassword = formValue.confirmPassword;
      const terms = formValue.terms;

      if (!nombre || !email || !password || !telefono || !direccion || !terms) {
        alert('Por favor, completa todos los campos obligatorios y acepta los términos.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      this.loading = true;

      this.authService.register(nombre, email, password, direccion).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          const id_usuario = response.id || response.id_usuario; // Ajustar según response structure

          // Crear cliente automáticamente
          this.clienteService.createCliente({
            nombre,
            email,
            telefono,
            direccion,
            nit,
            id_usuario
          }).subscribe({
            next: () => {
              this.loading = false;
              alert('¡Usuario y perfil de cliente creados exitosamente! Ahora inicia sesión.');
              this.dialogRef.close('success');
              // Opcional: Navegar a login
              // this.router.navigate(['/login']);
            },
            error: (clientError) => {
              console.error('Error al crear cliente:', clientError);
              this.loading = false;
              alert('Usuario registrado, pero error al crear perfil de cliente. Contacta soporte.');
              this.dialogRef.close('success');
            }
          });
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.loading = false;
          const message = error.error?.message || 'Error al registrar usuario. Verifica los datos.';
          alert(message);
        }
      });
    } else {
      alert('Formulario no válido. Completa todos los campos correctamente.');
    }
  }
}
