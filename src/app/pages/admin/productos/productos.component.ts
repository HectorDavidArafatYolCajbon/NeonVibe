import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  id_marca?: number;
  id_categoria?: number;
  genero?: string;
  activo: boolean;
  marca?: { nombre_marca: string };
  categoria?: { nombre_categoria: string };
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  /** Lista completa desde el backend */
  productos: Producto[] = [];

  /** Lista filtrada que se muestra en pantalla */
  filtrados: Producto[] = [];

  /** Indicador de carga */
  cargando = false;

  /** Modelo para crear nuevo producto */
  nuevoProducto = {
    nombre: '',
    descripcion: '',
    id_marca: 1,
    id_categoria: 1,
    genero: '',
  };

  /** 🔍 Controlador del buscador */
  private searchTerm = new Subject<string>();

  constructor(private productosService: ProductosService) {}

  /** Al iniciar, cargamos productos y configuramos el buscador */
  ngOnInit(): void {
    this.cargarProductos();

    // Configurar el buscador con debounce
    this.searchTerm.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe((texto) => this.filtrarProductos(texto));
  }

  /** 🔹 Obtener todos los productos */
  cargarProductos(): void {
    this.cargando = true;
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrados = data; // mostrar todos al inicio
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al obtener productos:', err);
        this.cargando = false;
        alert('No se pudieron cargar los productos.');
      }
    });
  }

  /** 🔍 Captura texto del input */
  buscarProducto(texto: string): void {
    this.searchTerm.next(texto.toLowerCase());
  }

  /** 🔹 Filtra productos localmente */
  filtrarProductos(texto: string): void {
    if (!texto.trim()) {
      this.filtrados = this.productos;
      return;
    }

    this.filtrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion?.toLowerCase().includes(texto) ||
      p.marca?.nombre_marca?.toLowerCase().includes(texto) ||
      p.categoria?.nombre_categoria?.toLowerCase().includes(texto)
    );
  }

  /** 🔹 Crear nuevo producto */
  crearProducto(): void {
    const { nombre, descripcion } = this.nuevoProducto;

    if (!nombre || !descripcion) {
      alert('Por favor completa el nombre y la descripción.');
      return;
    }

    this.productosService.crearProducto(this.nuevoProducto).subscribe({
      next: () => {
        alert('✅ Producto creado correctamente.');
        this.nuevoProducto = { nombre: '', descripcion: '', id_marca: 1, id_categoria: 1, genero: '' };
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        alert(err.error?.message || 'No se pudo crear el producto.');
      }
    });
  }

  /** 🔹 Activar / desactivar producto */
  toggleEstado(producto: Producto): void {
    const nuevoEstado = !producto.activo;
    this.productosService.cambiarEstado(producto.id_producto, nuevoEstado).subscribe({
      next: () => {
        producto.activo = nuevoEstado;
        alert(`El producto "${producto.nombre}" ahora está ${nuevoEstado ? '🟢 activo' : '🔴 inactivo'}`);
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        alert('No se pudo cambiar el estado.');
      }
    });
  }
}
