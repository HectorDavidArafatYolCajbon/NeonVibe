import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
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
  loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  // Cambia el tipo del input (password ↔ text)
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Por favor, ingresa email y contraseña.');
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        console.log('Stored:', localStorage.getItem('auth_user'));
        // Fetch user data if not stored
        this.authService.validateToken().subscribe({
          next: (user) => {
            console.log('Fetched user:', user);
            if (user) {
              localStorage.setItem('auth_user', JSON.stringify(user));
            }
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });
        this.loading = false;
        // Al iniciar sesión, ir a la página principal en lugar del carrito
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.loading = false;
        const message = error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        alert(message);
      }
    });
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
