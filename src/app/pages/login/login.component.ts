import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false; // 👈 Nueva propiedad para alternar visibilidad

  // Cambia el tipo del input (password ↔ text)
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    // Aquí luego integrarás tu servicio de autenticación
  }
}
