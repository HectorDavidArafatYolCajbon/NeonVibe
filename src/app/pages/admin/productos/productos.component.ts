import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../services/productos.service';
import { MarcasService } from '../../../services/marcas.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Marca } from '../../../models/marca.model';
import { Categoria } from '../../../models/categoria.model';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  id_marca?: number;
  id_categoria?: number;
  genero?: string;
  precio: number;
  stock: number;
  activo: boolean;
  marca?: Marca;
  categoria?: Categoria;
  imagenes?: string[];
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit, OnDestroy {
  /** Lista completa desde el backend */
  productos: Producto[] = [];

  /** Lista filtrada que se muestra en pantalla */
  filtrados: Producto[] = [];

  /** Indicador de carga */
  cargando = false;

  /** Listas de marcas y categorías */
  marcas: Marca[] = [];
  categorias: Categoria[] = [];

  /** Control de edición */
  editandoProducto: boolean = false;
  productoSeleccionado?: Producto;

  /** Manejo de imágenes */
  selectedImages: { file: File; preview: string }[] = [];

  /** Formulario reactivo */
  productoForm: FormGroup;

  /** Unsubscribe trigger */
  private destroy$ = new Subject<void>();

  /** 🔍 Controlador del buscador */
  private searchTerm = new Subject<string>();

  constructor(
    private productosService: ProductosService,
    private marcasService: MarcasService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      id_marca: [0, [Validators.required, Validators.min(1)]],
      id_categoria: [0, [Validators.required, Validators.min(1)]],
      genero: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagenes: [[]]
    });
  }

  /** Al iniciar, cargamos datos necesarios y configuramos el buscador */
  ngOnInit(): void {
    this.cargarProductos();
    this.cargarMarcas();
    this.cargarCategorias();

    // Configurar el buscador con debounce
    this.searchTerm.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe((texto) => this.filtrarProductos(texto));
  }

  /** Cargar marcas para el selector */
  cargarMarcas(): void {
    this.marcasService.getMarcas().subscribe({
      next: (data) => this.marcas = data,
      error: (err) => console.error('Error al cargar marcas:', err)
    });
  }

  /** Cargar categorías para el selector */
  cargarCategorias(): void {
    this.categoriaService.getCategorias().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: Categoria[]) => this.categorias = data,
      error: (error: any) => {
        console.error('Error al cargar categorías:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorías'
        });
      }
    });
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
      p.marca?.nombre?.toLowerCase().includes(texto) ||
      p.categoria?.nombre?.toLowerCase().includes(texto)
    );
  }

  /** Validar formulario */
  formularioValido(): boolean {
    if (this.productoForm.invalid) {
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return false;
    }
    return true;
  }

  /** Mostrar errores de validación */
  mostrarError(campo: string): string {
    const control = this.productoForm.get(campo);
    if (!control?.touched) return '';

    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `El valor debe ser mayor a ${min}`;
    }
    return '';
  }

  /** Limpiar formulario */
  limpiarFormulario(): void {
    this.editandoProducto = false;
    this.productoSeleccionado = undefined;
    this.selectedImages = [];
    this.productoForm.reset({
      nombre: '',
      descripcion: '',
      id_marca: 0,
      id_categoria: 0,
      genero: '',
      precio: 0,
      stock: 0,
      imagenes: []
    });
    Object.keys(this.productoForm.controls).forEach(key => {
      const control = this.productoForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
    });
  }

  /** Manejo de imágenes */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.push({
            file,
            preview: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  /** Remover imagen seleccionada */
  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  /** 🔹 Crear o actualizar producto */
  async guardarProducto(): Promise<void> {
    if (!this.formularioValido()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    // Preparar datos del producto
    const productoData = {
      ...this.productoForm.value,
      imagenes: await Promise.all(
        this.selectedImages.map(async img => {
          // Aquí iría la lógica para subir la imagen y obtener su URL
          // Por ahora solo retornamos la preview
          return img.preview;
        })
      )
    };

    this.cargando = true;

    // Decidir si crear o actualizar
    const observable = this.editandoProducto
      ? this.productosService.actualizarProducto(this.productoSeleccionado!.id_producto, productoData)
      : this.productosService.crearProducto(productoData);

    observable.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Producto ${this.editandoProducto ? 'actualizado' : 'creado'} correctamente`,
          timer: 1500,
          showConfirmButton: false
        });
        this.limpiarFormulario();
        this.cargarProductos();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al guardar producto:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || `No se pudo ${this.editandoProducto ? 'actualizar' : 'crear'} el producto`
        });
      }
    });
  }

  /** Cargar producto para edición */
  editarProducto(producto: Producto): void {
    this.editandoProducto = true;
    this.productoSeleccionado = producto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      id_marca: producto.id_marca || 0,
      id_categoria: producto.id_categoria || 0,
      genero: producto.genero || '',
      precio: producto.precio,
      stock: producto.stock,
      imagenes: producto.imagenes || []
    });
    // Cargar imágenes existentes como previews
    this.selectedImages = producto.imagenes?.map(url => ({
      file: new File([], "existing"), // dummy file
      preview: url
    })) || [];
  }

  /** 🔹 Activar / desactivar producto */
  toggleEstado(producto: Producto): void {
    const nuevoEstado = !producto.activo;
    const mensaje = nuevoEstado
      ? `¿Deseas activar el producto "${producto.nombre}"?`
      : `¿Deseas desactivar el producto "${producto.nombre}"?`;

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
        this.productosService.cambiarEstado(producto.id_producto, nuevoEstado)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cargando = false;
            producto.activo = nuevoEstado;
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: `El producto ${producto.nombre} ahora está ${nuevoEstado ? 'activo' : 'inactivo'}`,
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.cargando = false;
            console.error('Error al cambiar estado:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cambiar el estado del producto'
            });
          }
        });
      }
    });
  }

  /** Cleanup al destruir el componente */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
