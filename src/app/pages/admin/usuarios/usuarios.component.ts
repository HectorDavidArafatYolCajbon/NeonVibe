import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  password?: string;
  telefono?: string;
  nit?: string;
  direccion?: string;
  estado: boolean;
  id_rol: number;
  rol?: { nombre_rol: string };
  created_at?: string;
  updated_at?: string;
}

interface UsuarioForm {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  nit: string;
  direccion: string;
  id_rol: number;
  aceptaTerminos: boolean;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = false;
  editando = false;
  usuarioSeleccionado?: Usuario;
  usuarioForm: FormGroup;

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,}$/)]],
      nit: [''],
      direccion: ['', Validators.required],
      id_rol: [2],
      aceptaTerminos: [false]
    }, {
      validators: (group: FormGroup) => this.passwordMatchValidator(group)
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Validador personalizado para las contraseñas
  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // 🔹 Cargar usuarios desde el backend
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudieron cargar los usuarios'
        });
      }
    });
  }

  // 🔹 Mostrar errores de formulario
  mostrarErrorCampo(campo: string): string {
    const control = this.usuarioForm.get(campo);
    if (!control?.touched) return '';

    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.hasError('pattern')) return 'Formato inválido';

    return '';
  }

  // 🔹 Validar formulario
  validarFormulario(): boolean {
    if (this.usuarioForm.invalid) {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        const control = this.usuarioForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor, revisa todos los campos requeridos'
      });
      return false;
    }

    if (this.editando && !this.usuarioSeleccionado) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error en la edición del usuario'
      });
      return false;
    }

    if (!this.editando && !this.usuarioForm.get('aceptaTerminos')?.value) {
      Swal.fire({
        icon: 'warning',
        title: 'Términos y Condiciones',
        text: 'Debes aceptar los términos y condiciones'
      });
      return false;
    }

    return true;
  }

  // 🔹 Limpiar formulario
  limpiarFormulario(): void {
    this.editando = false;
    this.usuarioSeleccionado = undefined;
    this.usuarioForm.reset({
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      telefono: '',
      nit: '',
      direccion: '',
      id_rol: 2,
      aceptaTerminos: false
    });
    Object.keys(this.usuarioForm.controls).forEach(key => {
      const control = this.usuarioForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
    });
  }

  // 🔹 Crear usuario
  crearUsuario(): void {
    if (!this.validarFormulario()) return;

    this.cargando = true;
    const formValue = this.usuarioForm.value;
    const datosUsuario = {
      nombre: formValue.nombre,
      email: formValue.email,
      password: formValue.password,
      telefono: formValue.telefono,
      nit: formValue.nit,
      direccion: formValue.direccion,
      id_rol: formValue.id_rol
    };

    this.usuariosService.crearUsuario(datosUsuario).subscribe({
      next: (response) => {
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario creado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.limpiarFormulario();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al crear usuario:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo crear el usuario'
        });
      }
    });
  }

  // 🔹 Editar usuario existente
  editarUsuario(usuario: Usuario): void {
    this.editando = true;
    this.usuarioSeleccionado = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      confirmPassword: '',
      telefono: usuario.telefono || '',
      nit: usuario.nit || '',
      direccion: usuario.direccion || '',
      id_rol: usuario.id_rol,
      aceptaTerminos: true
    });

    // Actualizar validadores
    const passwordControl = this.usuarioForm.get('password');
    passwordControl?.clearValidators();
    passwordControl?.updateValueAndValidity();
  }

  // 🔹 Actualizar usuario
  actualizarUsuario(): void {
    if (!this.validarFormulario() || !this.usuarioSeleccionado) return;

    this.cargando = true;
    const formValue = this.usuarioForm.value;
    const datosActualizados: Partial<Usuario> = {
      nombre: formValue.nombre,
      email: formValue.email,
      telefono: formValue.telefono,
      nit: formValue.nit,
      direccion: formValue.direccion,
      id_rol: formValue.id_rol
    };

    if (formValue.password) {
      datosActualizados.password = formValue.password;
    }

    this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.id_usuario, datosActualizados).subscribe({
      next: () => {
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario actualizado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.limpiarFormulario();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al actualizar usuario:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo actualizar el usuario'
        });
      }
    });
  }

  // 🔹 Cambiar estado del usuario
  toggleEstado(usuario: Usuario): void {
    const nuevoEstado = !usuario.estado;
    const mensaje = nuevoEstado
      ? `¿Deseas activar al usuario "${usuario.nombre}"?`
      : `¿Deseas desactivar al usuario "${usuario.nombre}"?`;

    Swal.fire({
      title: 'Confirmar acción',
      text: mensaje,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando = true;
        this.usuariosService.cambiarEstado(usuario.id_usuario, nuevoEstado).subscribe({
          next: () => {
            usuario.estado = nuevoEstado;
            this.cargando = false;
            Swal.fire({
              title: 'Éxito',
              text: `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.cargando = false;
            console.error('Error al cambiar estado:', err);
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'No se pudo cambiar el estado del usuario',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  // Getter para verificar si hay errores de coincidencia de contraseñas
  get passwordMatchError(): boolean {
    const hasError = this.usuarioForm.hasError('passwordMismatch');
    const isTouched = this.usuarioForm.get('confirmPassword')?.touched ?? false;
    return Boolean(hasError && isTouched && !this.editando);
  }
}
