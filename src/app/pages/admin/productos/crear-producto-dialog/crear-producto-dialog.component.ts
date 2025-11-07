import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { MarcasService } from '../../../../services/marcas.service';
import { CategoriaService } from '../../../../services/categoria.service';
import { ProductosService } from '../../../../services/productos.service';

// Interfaces
import { Marca } from '../../../../models/marca.model';
import { Categoria } from '../../../../models/categoria.model';
import { Producto, ProductoVariante, ProductoImagen, InventarioStock } from '../../../../models/producto.model';

@Component({
  selector: 'app-crear-producto-dialog',
  templateUrl: './crear-producto-dialog.component.html',
  styleUrls: ['./crear-producto-dialog.component.scss']
})
export class CrearProductoDialogComponent implements OnInit {
  currentStep = 0;
  loading = false;
  marcas: Marca[] = [];
  categorias: Categoria[] = [];

  // Formularios para cada paso
  productoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: [''],
    id_marca: ['', [Validators.required]],
    id_categoria: ['', [Validators.required]],
    genero: ['', [Validators.required]]
  });

  variantePrincipalForm: FormGroup = this.fb.group({
    sku: ['', [Validators.required]],
    barcode: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    color: [''],
    talla: [''],
    precio_venta: ['', [Validators.required, Validators.min(0)]],
    precio_costo: ['', [Validators.required, Validators.min(0)]],
    descuento: [0],
    imagen_url: ['', [Validators.required]]
  });

  variantesForm: FormGroup = this.fb.group({
    variantes: this.fb.array([])
  });

  imagenesForm: FormGroup = this.fb.group({
    imagenesVariantes: this.fb.array([])
  });

  stockForm: FormGroup = this.fb.group({
    stocks: this.fb.array([])
  });  // Lista de variantes creadas
  variantes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearProductoDialogComponent>,
    private snackBar: MatSnackBar,
    private marcasService: MarcasService,
    private categoriasService: CategoriaService,
    private productosService: ProductosService
  ) {
    this.createForms();
  }

  ngOnInit() {
    this.cargarDatos();
  }

  createForms() {
    // Formulario de producto base
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      id_marca: ['', [Validators.required]],
      id_categoria: ['', [Validators.required]],
      genero: ['', [Validators.required]]
    });

    // Formulario de variante principal
    this.variantePrincipalForm = this.fb.group({
      sku: ['', [Validators.required]],
      barcode: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      color: [''],
      talla: [''],
      precio_venta: ['', [Validators.required, Validators.min(0)]],
      precio_costo: ['', [Validators.required, Validators.min(0)]],
      descuento: [0],
      imagen_url: ['', [Validators.required]]
    });

    // Formulario de variantes adicionales
    this.variantesForm = this.fb.group({
      variantes: this.fb.array([])
    });

    // Formulario de imágenes adicionales
    this.imagenesForm = this.fb.group({
      imagenesVariantes: this.fb.array([])
    });

    // Formulario de stock
    this.stockForm = this.fb.group({
      stocks: this.fb.array([])
    });

    // Mantener una lista de variantes creadas
    this.variantes = [];
  }

  async cargarDatos() {
    try {
      // Cargar marcas y categorías en paralelo
      const [marcas, categorias] = await Promise.all([
        firstValueFrom(this.marcasService.getMarcas()),
        firstValueFrom(this.categoriasService.getCategorias())
      ]);

      if (marcas) this.marcas = marcas;
      if (categorias) this.categorias = categorias;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.snackBar.open('Error al cargar datos iniciales', 'Cerrar', { duration: 3000 });
    }
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      // Si estamos pasando al paso de stock (paso 4) y no hay entradas de stock, inicializar
      if (this.currentStep === 3) {
        const stocksArray = this.stockForm.get('stocks') as FormArray;
        if (stocksArray.length === 0) {
          // Agregar entrada de stock para la variante principal
          stocksArray.push(this.fb.group({
            stock: [0, [Validators.required, Validators.min(0)]]
          }));

          // Agregar entradas de stock para las variantes adicionales
          const variantesArray = this.variantesForm.get('variantes') as FormArray;
          for (let i = 0; i < variantesArray.length; i++) {
            stocksArray.push(this.fb.group({
              stock: [0, [Validators.required, Validators.min(0)]]
            }));
          }
        }
      }
      this.currentStep++;
    }
  }

  prevStep() {
    this.currentStep--;
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 0:
        return this.productoForm.valid;
      case 1:
        return this.variantePrincipalForm.valid;
      case 2:
        return this.variantesForm.valid;
      case 3:
        return this.imagenesForm.valid;
      case 4:
        return this.stockForm.valid;
      default:
        return true;
    }
  }

  // Método para agregar una nueva variante
  agregarVariante() {
    const variantesArray = this.variantesForm.get('variantes') as FormArray;

    // Copiar datos de la variante principal excepto talla
    const variantePrincipal = this.variantePrincipalForm.value;
    const nuevaVariante = this.fb.group({
      sku: [variantePrincipal.sku + '-' + (variantesArray.length + 1), [Validators.required]],
      barcode: [variantePrincipal.barcode + '-' + (variantesArray.length + 1), [Validators.required]],
      modelo: [variantePrincipal.modelo, [Validators.required]],
      color: [variantePrincipal.color],
      talla: ['', [Validators.required]],
      precio_venta: [variantePrincipal.precio_venta, [Validators.required, Validators.min(0)]],
      precio_costo: [variantePrincipal.precio_costo, [Validators.required, Validators.min(0)]],
      descuento: [variantePrincipal.descuento || 0],
      imagen_url: [''] // Vacío por defecto
    });

    variantesArray.push(nuevaVariante);

    // Agregar entrada de stock para la nueva variante
    const stocksArray = this.stockForm.get('stocks') as FormArray;
    stocksArray.push(this.fb.group({
      stock: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  // Método para eliminar una variante
  eliminarVariante(index: number) {
    const variantesArray = this.variantesForm.get('variantes') as FormArray;
    variantesArray.removeAt(index);
  }

  // Método para agregar imagen a una variante
  agregarImagenVariante(varianteId: number) {
    const imagenesArray = this.imagenesForm.get('imagenesVariantes') as FormArray;
    const nuevaImagen = this.fb.group({
      id_variante: [varianteId],
      url: ['', [Validators.required]],
      orden: [imagenesArray.length + 1]
    });

    imagenesArray.push(nuevaImagen);
  }

  // Método para eliminar imagen
  eliminarImagen(index: number) {
    const imagenesArray = this.imagenesForm.get('imagenesVariantes') as FormArray;
    imagenesArray.removeAt(index);
  }

  // Método para establecer stock inicial
  agregarStockInicial(varianteId: number, cantidad: number = 0) {
    const stocksArray = this.stockForm.get('stocks') as FormArray;
    const nuevoStock = this.fb.group({
      id_variante: [varianteId],
      stock: [cantidad, [Validators.required, Validators.min(0)]]
    });

    stocksArray.push(nuevoStock);
  }

  async guardarProducto() {
    if (this.loading) return;

    this.loading = true;
    try {
      // 1. Crear producto base
      const producto = await firstValueFrom(this.productosService.createProducto(this.productoForm.value));

      // 2. Crear variante principal
      const variantePrincipal = {
        ...this.variantePrincipalForm.value,
        id_producto: producto.id_producto
      };
      const variantePrincipalCreada = await firstValueFrom(this.productosService.createVariante(variantePrincipal));

      // Agregar la variante principal a la lista
      this.variantes.push(variantePrincipalCreada);

      // 3. Crear variantes adicionales
      const variantesArray = this.variantesForm.get('variantes') as FormArray;
      for (const varianteForm of variantesArray.controls) {
        const nuevaVariante = {
          ...varianteForm.value,
          id_producto: producto.id_producto
        };
        const varianteCreada = await firstValueFrom(this.productosService.createVariante(nuevaVariante));
        this.variantes.push(varianteCreada);
      }

      // 4. Agregar imágenes adicionales
      const imagenesArray = this.imagenesForm.get('imagenesVariantes') as FormArray;
      for (const imagenForm of imagenesArray.controls) {
        await firstValueFrom(this.productosService.createImagenVariante(imagenForm.value));
      }

      // 5. Establecer stock inicial
      const stocksArray = this.stockForm.get('stocks') as FormArray;
      for (const stockForm of stocksArray.controls) {
        await firstValueFrom(this.productosService.createStock(stockForm.value));
      }

      this.dialogRef.close(true);
      this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 3000 });
    } catch (error) {
      console.error('Error al crear producto:', error);
      this.snackBar.open('Error al crear el producto', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }  cancel() {
    this.dialogRef.close();
  }

  // Helper method to get controls from FormArray
  getControls(form: FormGroup, key: string) {
    return (form.get(key) as FormArray).controls;
  }
}
