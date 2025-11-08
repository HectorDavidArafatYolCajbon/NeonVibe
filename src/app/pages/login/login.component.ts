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
        console.log('✅ Login exitoso:', response);
        console.log('📦 Stored:', localStorage.getItem('auth_user'));

        const userLogin = response?.user || response;

        // ✅ Detectar si es administrador según los datos del login
        const isAdminLogin =
          userLogin?.id_rol === 1 ||
          userLogin?.id_usuario === 1 ||
          userLogin?.role === 'admin' ||
          userLogin?.rol?.toLowerCase() === 'administrador';

        if (isAdminLogin) {
          console.log('➡️ Redirigiendo al panel de administrador (desde login)...');
          this.router.navigate(['/admin']);
          this.loading = false;
          return; // Evitamos la validación adicional
        }

        // 🔍 Si no trae datos completos, validar token para obtener el usuario
        console.log('Login exitoso:', response);

        // Validar token y refrescar usuario
        this.authService.validateToken().subscribe({
          next: (user) => {
            console.log('👤 Usuario obtenido:', user);

            if (user) {
              localStorage.setItem('auth_user', JSON.stringify(user));

              // Detección del rol de administrador (según respuesta /me)
              const isAdmin =
                user.id_rol === 1 ||
                user.id_usuario === 1 ||
                user.role === 'admin' ||
                (typeof user.rol === 'string' && user.rol.toLowerCase() === 'admin') ||
                (typeof user.rol === 'object' && user.rol.nombre_rol?.toLowerCase() === 'admin');

              if (isAdmin) {
                console.log('➡️ Redirigiendo al panel de administrador...');
                this.router.navigate(['/admin']);
              } else {
                console.log('➡️ Redirigiendo al home del cliente...');
                this.router.navigate(['/']);
              }
            }

            this.loading = false;
          },
          error: (err) => {
            console.error('Error al obtener usuario:', err);
            this.loading = false;
            this.router.navigate(['/']);
          }
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
        console.error('❌ Error en login:', error);
        this.loading = false;

        if (error.status === 403) {
          Swal.fire({
            title: 'Cuenta Desactivada',
            text: 'Tu cuenta está actualmente desactivada. Por favor, contacta con el administrador para reactivarla.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
          });
          return;
        }

        const message = error.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        Swal.fire('Error', message, 'error');
      }
    });
  }

  openCreateUserDialog() {
    const dialogRef = this.dialog.open(CrearUsuarioDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal de registro se cerró:', result);
    });
  }
}
