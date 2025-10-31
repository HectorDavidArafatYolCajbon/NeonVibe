import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearUsuarioDialogComponent } from '../crear-usuario-dialog/crear-usuario-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false; // 👈 Nueva propiedad para alternar visibilidad

  constructor(public dialog: MatDialog) {}

  // Cambia el tipo del input (password ↔ text)
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    // Aquí luego integrarás tu servicio de autenticación
  }

  // Abre el modal de crear usuario
  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CrearUsuarioDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });
  }
}
