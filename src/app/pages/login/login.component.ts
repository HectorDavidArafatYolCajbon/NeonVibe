import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CrearUsuarioDialogComponent } from '../crear-usuario-dialog/crear-usuario-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.email || !this.password) {
      Swal.fire('Campos incompletos', 'Por favor, ingresa email y contraseña.', 'warning');
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);

        // Validar token y refrescar usuario
        this.authService.validateToken().subscribe({
          next: (user) => {
            if (user) {
              localStorage.setItem('auth_user', JSON.stringify(user));
            }
          },
          error: (err) => {
            console.error('Error al obtener usuario:', err);
          },
        });

        this.loading = false;

        // Mostrar alerta de bienvenida
        Swal.fire({
          title: 'Bienvenido 👋',
          text: 'Inicio de sesión exitoso',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirigir al carrito si venía de ahí
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
        if (redirectTo) {
          this.router.navigate([redirectTo]);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.loading = false;
        const message =
          error.error?.message ||
          'Error al iniciar sesión. Verifica tus credenciales.';
        Swal.fire('Error', message, 'error');
      },
    });
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CrearUsuarioDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de registro se cerró:', result);
    });
  }
}
