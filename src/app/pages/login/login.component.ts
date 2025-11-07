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
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

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
        console.log('✅ Login exitoso:', response);
        console.log('📦 Stored:', localStorage.getItem('auth_user'));

        // ⚠️ Si el backend ya devuelve el usuario dentro del login, lo usamos directamente
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
        this.authService.validateToken().subscribe({
          next: (user) => {
            console.log('👤 Usuario obtenido:', user);

            if (user) {
              localStorage.setItem('auth_user', JSON.stringify(user));

              // ✅ Detección del rol de administrador (según respuesta /me)
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
            console.error('Error fetching user data:', err);
            this.loading = false;
            this.router.navigate(['/']);
          },
        });
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.loading = false;
        const message =
          error.error?.message ||
          'Error al iniciar sesión. Verifica tus credenciales.';
        alert(message);
      },
    });
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CrearUsuarioDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('El modal se cerró');
    });
  }
}
