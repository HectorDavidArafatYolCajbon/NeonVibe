import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../services/productos.service';
import { MarcasService } from '../../../services/marcas.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Marca } from '../../../models/marca.model';
import { Categoria } from '../../../models/categoria.model';

interface InventarioStock {
  id_inventario: number;
  id_variante: number;
  stock: number;
}

interface Variante {
  id_variante: number;
  talla: string;
  precio_venta: number;
  precio_costo: number;
  descuento: number;
  stock?: InventarioStock;
  modelo?: string;
  color?: string;
}

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  id_marca: number;
  id_categoria: number;
  genero: string;
  activo: boolean;
  marca?: Marca;
  categoria?: Categoria;
  precio_venta?: number;
  precio_costo?: number;
  descuento?: number;
  variantes?: Variante[];
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

  /** Control del modal */
  modalAbierto = false;
  pasoActual = 1; // 1: Producto, 2: Variantes

  /** Estado de edición */
  editandoProducto = false;
  productoSeleccionado: Producto | undefined;

  /** Formulario para variantes */
  varianteForm: FormGroup;
  variantes: any[] = [];

  /** Tallas disponibles */
  tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  /** Métodos de cálculo para producto */
  getStockTotal(producto: Producto): string {
    try {
      if (!producto.variantes?.length) return '0';

      const stockInfo = producto.variantes
        .filter(v => v.talla)
        .map(v => {
          const stockData = v.stock;
          return `${v.talla}: ${stockData?.stock || 0}`;
        })
        .join(' | ');

      return stockInfo || '0';
    } catch (error) {
      console.error('Error al calcular stock:', error);
      return '0';
    }
  }

  getStockPorTalla(producto: Producto): { [talla: string]: number } {
    const stockPorTalla: { [talla: string]: number } = {};

    if (!producto.variantes) return stockPorTalla;

    producto.variantes.forEach(variante => {
      if (variante.talla && variante.stock) {
        stockPorTalla[variante.talla] = variante.stock.stock;
      }
    });

    return stockPorTalla;
  }  getPrecioPromedio(producto: Producto, tipo: 'venta' | 'costo'): number {
    try {
      if (!producto.variantes?.length) return 0;

      const preciosValidos = producto.variantes
        .map(v => tipo === 'venta' ? v.precio_venta : v.precio_costo)
        .filter(precio => precio > 0);

      if (!preciosValidos.length) return 0;

      return Math.min(...preciosValidos);
    } catch (error) {
      console.error(`Error al obtener precio ${tipo}:`, error);
      return 0;
    }
  }

  getDescuentoPromedio(producto: Producto): number {
    try {
      if (!producto.variantes?.length) return 0;

      const descuentos = producto.variantes
        .map(v => v.descuento || 0);

      return Math.max(...descuentos, 0);
    } catch (error) {
      console.error('Error al obtener descuento:', error);
      return 0;
    }
  }

  /** Indicador de carga */
  cargando = false;

  /** Listas de marcas y categorías */
  marcas: Marca[] = [];
  categorias: Categoria[] = [];

  /** Manejo de imágenes */
  selectedImages: { url: string; preview: string }[] = [];

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
    // Formulario del producto
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      id_marca: [0, [Validators.required, Validators.min(1)]],
      id_categoria: [0, [Validators.required, Validators.min(1)]],
      genero: ['', Validators.required],
      activo: [true]
    });

    // Formulario de variante
    this.varianteForm = this.fb.group({
      modelo: ['', [Validators.required]],
      color: [''],
      talla: ['', Validators.required],
      sku: ['', Validators.required],
      barcode: ['', Validators.required],
      precio_venta: [0, [Validators.required, Validators.min(0.01)]],
      precio_costo: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      imagen_url: [''],
      activo: [true]
    });
  }

  /** Totales de inventario sobre la lista filtrada (precio x stock) */
  get totalCostoInventarioFiltrado(): number {
    try {
      return (this.filtrados || []).reduce((accP, p) => {
        const sumProducto = (p.variantes || []).reduce((accV, v) => {
          const stock = Number(v?.stock?.stock) || 0;
          const costo = Number(v?.precio_costo) || 0;
          return accV + stock * costo;
        }, 0);
        return accP + sumProducto;
      }, 0);
    } catch {
      return 0;
    }
  }

  get totalVentaInventarioFiltrado(): number {
    try {
      return (this.filtrados || []).reduce((accP, p) => {
        const sumProducto = (p.variantes || []).reduce((accV, v) => {
          const stock = Number(v?.stock?.stock) || 0;
          const venta = Number(v?.precio_venta) || 0;
          return accV + stock * venta;
        }, 0);
        return accP + sumProducto;
      }, 0);
    } catch {
      return 0;
    }
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

  /** Cargar productos */
  cargarProductos(): void {
    this.cargando = true;
    this.productosService.getProductos(false).subscribe({
      next: (productos) => {
        console.log('Productos raw:', productos); // Para debug
        // Para cada producto, obtenemos sus variantes y stock
        productos.forEach(producto => {
          if (producto.variantes) {
            producto.variantes = producto.variantes.map((variante: any) => {
              console.log('Variante:', variante); // Para debug
              return {
                ...variante,
                precio_venta: parseFloat(variante.precio_venta) || 0,
                precio_costo: parseFloat(variante.precio_costo) || 0,
                descuento: parseFloat(variante.descuento) || 0,
                stock: variante.stock || { stock: 0 }
              };
            });
          }
        });

        this.productos = productos;
        this.filtrados = productos;
        this.cargando = false;

        console.log('Productos cargados:', productos);
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

  /** Agregar URL de imagen */
  addImageUrl(url: string): void {
    if (url && url.trim()) {
      this.selectedImages.push({
        url: url.trim(),
        preview: url.trim()
      });
    }
  }

  /** Remover imagen seleccionada */
  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  /** 🔹 Crear producto y pasar a variantes */
  async guardarProducto(): Promise<void> {
    if (!this.formularioValido()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    this.cargando = true;

    try {
      const productoData = this.productoForm.value;
      const response = await this.productosService.crearProducto(productoData).toPromise();

      this.productoSeleccionado = response;
      this.pasoActual = 2; // Avanzar al paso de variantes
      this.cargando = false;

    } catch (err: any) {
      this.cargando = false;
      console.error('Error al guardar producto:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error?.message || 'No se pudo crear el producto'
      });
    }
  }

  /** Agregar variante al producto */
  async agregarVariante(): Promise<void> {
    if (!this.varianteForm.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Incompleto',
        text: 'Por favor completa todos los campos de la variante'
      });
      return;
    }

    const formValues = this.varianteForm.value;
    const varianteData = {
      id_producto: this.productoSeleccionado?.id_producto,
      modelo: formValues.modelo,
      color: formValues.color,
      talla: formValues.talla,
      sku: formValues.sku,
      barcode: formValues.barcode,
      precio_venta: formValues.precio_venta,
      precio_costo: formValues.precio_costo,
      descuento: formValues.descuento,
      imagen_url: this.selectedImages.length > 0 ? this.selectedImages[0].url : null,
      activo: formValues.activo
    };

    this.cargando = true;

    try {
      const variante = await this.productosService.crearVariante(varianteData).toPromise();

      // Si hay imágenes, las guardamos
      if (this.selectedImages.length > 0) {
        await Promise.all(this.selectedImages.map((img, index) =>
          this.productosService.agregarImagenVariante({
            id_variante: variante.id_variante,
            url_imagen: img.url,
            orden: index + 1
          }).toPromise()
        ));
      }

      this.variantes.push(variante);
      this.varianteForm.reset();
      this.selectedImages = [];
      this.cargando = false;

      Swal.fire({
        icon: 'success',
        title: 'Variante agregada',
        text: 'La variante se ha agregado correctamente',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err: any) {
      this.cargando = false;
      console.error('Error al agregar variante:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error?.message || 'No se pudo agregar la variante'
      });
    }
  }

  /** Finalizar creación del producto */
  finalizarCreacion(): void {
    if (this.variantes.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin variantes',
        text: 'Debes agregar al menos una variante al producto'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Producto creado',
      text: 'El producto y sus variantes se han creado correctamente'
    });

    this.limpiarFormulario();
    this.cargarProductos();
    this.resetearModal();
  }

  /** Resetear estado del modal */
  resetearModal(): void {
    this.pasoActual = 1;
    this.variantes = [];
    this.selectedImages = [];
    this.modalAbierto = false;
  }

  /** Cargar producto para edición */
  editarProducto(producto: Producto): void {
    this.editandoProducto = true;
    this.productoSeleccionado = producto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      id_marca: producto.id_marca,
      id_categoria: producto.id_categoria,
      genero: producto.genero,
      activo: producto.activo
    });
    this.modalAbierto = true;
    this.pasoActual = 1; // Start with product edit
    this.variantes = producto.variantes || [];
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
