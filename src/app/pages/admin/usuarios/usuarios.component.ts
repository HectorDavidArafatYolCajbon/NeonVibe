import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  direccion?: string;
  estado: boolean;
  id_rol: number;
  rol?: { nombre_rol: string }; // puede venir poblado
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = false;

  // Formulario para crear
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    direccion: '',
    id_rol: 2, // 1 = admin, 2 = cliente
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // 🔹 Cargar usuarios desde el backend (solo lectura)
  cargarUsuarios(): void {
    this.cargando = true;
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al obtener usuarios:', err);
        alert(err.error?.message || 'No se pudieron cargar los usuarios (¿sesión admin?)');
      }
    });
  }

  // 🔹 Crear usuario (usa POST /register)
  crearUsuario(): void {
    const { nombre, email, password } = this.nuevoUsuario;
    if (!nombre || !email || !password) {
      alert('Por favor, completa nombre, email y contraseña.');
      return;
    }

    this.usuariosService.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        alert('✅ Usuario creado correctamente');
        // limpiar formulario y recargar
        this.nuevoUsuario = { nombre: '', email: '', password: '', direccion: '', id_rol: 2 };
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        alert(err.error?.message || 'No se pudo crear el usuario');
      }
    });
  }

  // 🔹 Simular activar / desactivar (solo visual)
  toggleEstado(u: Usuario): void {
    // Cambiar el estado visualmente
    u.estado = !u.estado;

    // Mostrar mensaje visual simulado
    const mensaje = u.estado
      ? `✅ Usuario "${u.nombre}" fue activado.`
      : `⚠️ Usuario "${u.nombre}" fue desactivado.`;

    alert(mensaje);
  }
}
