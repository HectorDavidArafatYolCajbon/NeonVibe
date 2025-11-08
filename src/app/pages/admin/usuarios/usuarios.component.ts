import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CrearUsuarioDialogComponent } from './crear-usuario-dialog/crear-usuario-dialog.component';
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

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = false;
  displayedColumns: string[] = ['id', 'nombre', 'email', 'rol', 'estado', 'acciones'];
  dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usuariosService: UsuariosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Usuario>();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  // 🔹 Cargar usuarios desde el backend
  cargarUsuarios(): void {
    this.cargando = true;
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.dataSource.data = this.usuarios;
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

  // Abrir diálogo para crear usuario
  abrirDialogoCrearUsuario(): void {
    const dialogRef = this.dialog.open(CrearUsuarioDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarUsuarios();
      }
    });
  }

  // Editar usuario
  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(CrearUsuarioDialogComponent, {
      width: '600px',
      data: { usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarUsuarios();
      }
    });
  }

  // Toggle estado del usuario
  toggleEstado(usuario: Usuario): void {
    const nuevoEstado = !usuario.estado;
    const mensaje = nuevoEstado ? 'activar' : 'desactivar';

    Swal.fire({
      title: `¿Estás seguro de ${mensaje} al usuario?`,
      text: `El usuario ${usuario.nombre} será ${mensaje}do`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando = true;
        this.usuariosService.cambiarEstado(usuario.id_usuario, nuevoEstado).subscribe({
          next: () => {
            this.snackBar.open(
              `Usuario ${mensaje}do exitosamente`,
              'Cerrar',
              { duration: 3000 }
            );
            this.cargarUsuarios();
          },
          error: (err: any) => {
            console.error(`Error al ${mensaje} usuario:`, err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error?.message || `No se pudo ${mensaje} al usuario`
            });
            this.cargando = false;
          }
        });
      }
    });
  }
}
