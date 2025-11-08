import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../services/productos.service';
import { MarcasService } from '../../../services/marcas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss']
})
export class ModalProductoComponent implements OnInit {
  @Input() marcas: any[] = [];
  @Input() categorias: any[] = [];
  @Input() editMode = false;
  @Input() existingProduct: any = null;
  @Input() existingVariantes: any[] = [];
  @Output() productoGuardado = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  // Control de pasos
  pasoActual = 1;

  // Formularios
  productoForm!: FormGroup;
  varianteForm!: FormGroup;

  // Estado
  cargando = false;
  productoId: number | null = null;
  variantes: any[] = [];
  selectedImages: { url: string; preview: string }[] = [];
  editingVariant = false;
  currentVariant: any = null;
  editingIndex: number | null = null;

  // Sistemas de tallas según categoría
  sistemaTallas = {
    ropa: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    pantalones: [
      '28x30', '28x32',
      '29x30', '29x32',
      '30x30', '30x32', '30x34',
      '31x30', '31x32', '31x34',
      '32x30', '32x32', '32x34',
      '33x30', '33x32', '33x34',
      '34x30', '34x32', '34x34',
      '36x30', '36x32', '36x34',
      '38x30', '38x32', '38x34',
    ],
    calzado: Array.from({length: 9}, (_, i) => (34 + i).toString()), // 34 al 42
    bolsos: ['Único'],
    accesorios: ['Talla Única', 'Ajustable'],
    tallaUnica: ['Talla Única']
  };

  // Tallas disponibles (se actualizará según la categoría)
  tallas: string[] = this.sistemaTallas.ropa;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private marcasService: MarcasService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    if (this.editMode && this.existingProduct) {
      this.productoId = this.existingProduct.id_producto;
      this.productoForm.patchValue(this.existingProduct);
      this.variantes = this.existingVariantes;
      this.actualizarTallasSegunCategoria(this.existingProduct.id_categoria);
    }

    // Escuchar cambios en la categoría seleccionada
    this.productoForm.get('id_categoria')?.valueChanges.subscribe(categoriaId => {
      this.actualizarTallasSegunCategoria(categoriaId);
    });
  }

  private actualizarTallasSegunCategoria(categoriaId: number): void {
    // Obtener la categoría seleccionada
    const categoriaSeleccionada = this.categorias.find(cat => cat.id_categoria === categoriaId);

    if (!categoriaSeleccionada) {
      this.tallas = ['Talla Única'];
      return;
    }

    // Normalizamos el nombre: minúsculas y sin acentos para comparar de forma robusta
    const nombreCategoriaRaw = (categoriaSeleccionada.nombre || '').toString();
    const nombreCategoria = nombreCategoriaRaw.toLowerCase();
    const nombreSinAcentos = nombreCategoria.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const incluye = (texto: string, candidatas: string[]) => candidatas.some(c => texto.includes(c));

    console.log('Categoría seleccionada:', {
      id: categoriaId,
      nombre: nombreCategoriaRaw,
      nombreNormalizado: nombreSinAcentos,
      categoriaCompleta: categoriaSeleccionada
    });

    // Asignar el sistema de tallas según la categoría
    if (incluye(nombreSinAcentos, ['calzado', 'zapato', 'zapatos', 'zapatilla', 'zapatillas', 'tenis'])) {
      this.tallas = this.sistemaTallas.calzado;
    }
    // Pantalones (usando tallas específicas de cintura x largo)
    else if (incluye(nombreSinAcentos, ['pantalon', 'pantalones', 'jean', 'jeans'])) {
      this.tallas = this.sistemaTallas.pantalones;
      console.log('Asignando tallas de pantalones:', this.sistemaTallas.pantalones);
    }
    // Categorías que usan tallas de ropa (XS-XXL)
    else if (
      incluye(nombreSinAcentos, ['camisa', 'camisas', 'playera', 'remera']) ||
      incluye(nombreSinAcentos, ['vestido', 'vestidos']) ||
      incluye(nombreSinAcentos, ['falda', 'faldas']) ||
      incluye(nombreSinAcentos, ['blusa', 'blusas'])
    ) {
      this.tallas = this.sistemaTallas.ropa;
      console.log('Asignando tallas de ropa:', this.sistemaTallas.ropa);
    }
    else if (incluye(nombreSinAcentos, ['bolso', 'bolsos'])) {
      this.tallas = this.sistemaTallas.bolsos;
    }
    else if (incluye(nombreSinAcentos, ['accesorio', 'accesorios'])) {
      this.tallas = this.sistemaTallas.accesorios;
    }
    else {
      this.tallas = this.sistemaTallas.tallaUnica;
    }    // Resetear el valor de talla en el formulario de variante
    this.varianteForm.patchValue({ talla: '' });
  }

  private initForms(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      id_marca: [0, [Validators.required, Validators.min(1)]],
      id_categoria: [0, [Validators.required, Validators.min(1)]],
      genero: ['', Validators.required],
      activo: [true]
    });

    this.varianteForm = this.fb.group({
      modelo: ['', [Validators.required]],
      color: [''],
      talla: [''], // La validación de talla se manejará dinámicamente
      sku: ['', Validators.required],
      barcode: ['', Validators.required],
      precio_costo: [0, [Validators.required, Validators.min(0.01)]],
      precio_venta: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      stock_inicial: [0, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }

  async guardarProducto(): Promise<void> {
    if (this.productoForm.invalid) {
      return;
    }

    this.cargando = true;

    try {
      if (this.editMode && this.productoId) {
        await this.productosService.actualizarProducto(this.productoId, this.productoForm.value).toPromise();
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          text: 'El producto se ha actualizado correctamente'
        });
      } else {
        const response = await this.productosService.crearProducto(this.productoForm.value).toPromise();
        this.productoId = response.id_producto;
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El producto se ha creado correctamente'
        });
      }
      this.pasoActual = 2;
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.error?.message || 'No se pudo guardar el producto'
      });
    } finally {
      this.cargando = false;
    }
  }

  addImageUrl(url: string): void {
    if (!url?.trim()) return;

    const esAccesorio = this.isAccesorio();
    console.log('Debug - Agregar Imagen:', {
      esAccesorio,
      imagenesCargadas: this.selectedImages.length,
      categoriaId: this.productoForm.get('id_categoria')?.value
    });

    // Si no es accesorio y ya hay una imagen, mostrar advertencia
    if (!esAccesorio && this.selectedImages.length >= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite de imágenes',
        text: 'Solo los accesorios permiten múltiples imágenes por variante',
        timer: 2000
      });
      return;
    }

    // Para accesorios, limitar a 5 imágenes por variante
    if (esAccesorio && this.selectedImages.length >= 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite de imágenes',
        text: 'Máximo 5 imágenes por variante de accesorio',
        timer: 2000
      });
      return;
    }

    this.selectedImages.push({
      url: url.trim(),
      preview: url.trim()
    });
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  copiarUltimaVariante(): void {
    if (this.variantes.length === 0) {
      return;
    }

    const ultimaVariante = this.variantes[this.variantes.length - 1];
    const categoriaId = this.productoForm.get('id_categoria')?.value;
    // Convertimos a string para la comparación
    const esTallaUnica = ['3', '7'].includes(String(categoriaId)); // 3: Bolsos, 7: Accesorios

    // Si es talla única, no permitimos copiar
    if (esTallaUnica) {
      Swal.fire({
        icon: 'warning',
        title: 'No disponible',
        text: 'La copia de variantes solo está disponible para ropa y calzado',
        timer: 2000
      });
      return;
    }

    // Copiamos todos los valores excepto talla, sku, stock y barcode
    this.varianteForm.patchValue({
      modelo: ultimaVariante.modelo,
      color: ultimaVariante.color,
      precio_costo: ultimaVariante.precio_costo,
      precio_venta: ultimaVariante.precio_venta,
      descuento: ultimaVariante.descuento,
      activo: ultimaVariante.activo
    });

    // Limpiamos los campos que deben ser únicos
    this.varianteForm.get('talla')?.reset();
    this.varianteForm.get('sku')?.reset();
    this.varianteForm.get('barcode')?.reset();
    this.varianteForm.get('stock_inicial')?.reset();

    // Limpiamos las imágenes seleccionadas
    this.selectedImages = [];

    Swal.fire({
      icon: 'success',
      title: 'Datos copiados',
      text: 'Complete los campos restantes para la nueva variante',
      timer: 2000
    });
  }

  /**
   * Inicia la edición de una variante existente
   */
  startEditVariante(v: any, index: number): void {
    this.editingVariant = true;
    this.editingIndex = index;
    this.currentVariant = v;

    // Precargar datos en el formulario (incluye stock actual si existe)
    this.varianteForm.patchValue({
      modelo: v.modelo || '',
      color: v.color || '',
      talla: v.talla || '',
      sku: v.sku || '',
      barcode: v.barcode || '',
      precio_costo: v.precio_costo ?? 0,
      precio_venta: v.precio_venta ?? 0,
      descuento: v.descuento ?? 0,
      stock_inicial: v.stock?.stock ?? 0,
      activo: v.activo ?? true
    });
    // Limpiar imágenes seleccionadas (edición de imágenes fuera de alcance por ahora)
    this.selectedImages = [];
  }

  /**
   * Guarda los cambios de una variante en edición
   */
  async guardarEdicionVariante(): Promise<void> {
    if (!this.editingVariant || this.editingIndex === null || !this.currentVariant) {
      return;
    }
    if (this.varianteForm.invalid) {
      return;
    }

    this.cargando = true;
    const formValues = this.varianteForm.value;
    // Normalización SKU / barcode
    const normalizedSku = (formValues.sku || '').trim().toUpperCase();
    const normalizedBarcode = (formValues.barcode || '').trim().toUpperCase();

    const updateData = {
      modelo: formValues.modelo,
      color: formValues.color,
      talla: formValues.talla,
      sku: normalizedSku,
      barcode: normalizedBarcode,
      precio_costo: formValues.precio_costo,
      precio_venta: formValues.precio_venta,
      descuento: formValues.descuento,
      activo: formValues.activo
    };

    try {
      // Validación de unicidad SKU / barcode (permitimos mismo que el actual)
      const skuNuevo = normalizedSku;
      const barcodeNuevo = normalizedBarcode;
      if (skuNuevo) {
        const skuDuplicado = this.variantes.some((v, idx) => idx !== this.editingIndex && v.sku === skuNuevo);
        if (skuDuplicado) {
          Swal.fire({ icon: 'error', title: 'SKU duplicado', text: 'Ya existe otra variante con este SKU.' });
          this.cargando = false;
          return;
        }
      }
      if (barcodeNuevo) {
        const barcodeDuplicado = this.variantes.some((v, idx) => idx !== this.editingIndex && v.barcode === barcodeNuevo);
        if (barcodeDuplicado) {
          Swal.fire({ icon: 'error', title: 'Código de barras duplicado', text: 'Ya existe otra variante con este código de barras.' });
          this.cargando = false;
          return;
        }
      }
      // 1) Actualizar variante
      await this.productosService.updateVariante(this.currentVariant.id_variante, updateData).toPromise();

      // 2) Actualizar/crear stock con el valor ingresado
      const nuevoStock = Number(formValues.stock_inicial) || 0;
      try {
        await this.productosService.updateStock(this.currentVariant.id_variante, nuevoStock).toPromise();
      } catch (e) {
        // Si no existe el stock, lo creamos
        await this.productosService.createStock({ id_variante: this.currentVariant.id_variante, stock: nuevoStock }).toPromise();
      }

      // 3) Agregar imágenes nuevas si las hay (no elimina existentes)
      if (this.selectedImages.length > 0) {
        const esAccesorio = this.isAccesorio();
        const imagenesToAdd = esAccesorio ? this.selectedImages : [this.selectedImages[0]];

        const startOrden = (this.currentVariant?.imagenes?.length || 0) + 1;
        for (let i = 0; i < imagenesToAdd.length; i++) {
          try {
            await this.productosService.agregarImagenVariante({
              id_variante: this.currentVariant.id_variante,
              url: imagenesToAdd[i].url,
              orden: startOrden + i
            }).toPromise();
          } catch (imgErr) {
            console.warn('No se pudo agregar una imagen en edición:', imgErr);
          }
        }
      }

      // 4) Reflejar cambios en la lista local
      const updated = {
        ...this.variantes[this.editingIndex],
        ...updateData,
        stock: { ...(this.variantes[this.editingIndex]?.stock || {}), stock: nuevoStock }
      };
      // Si se agregaron imágenes, anexarlas localmente para feedback inmediato
      if (this.selectedImages.length > 0) {
        const nuevas = this.isAccesorio() ? this.selectedImages : [this.selectedImages[0]];
        const existentes = (this.variantes[this.editingIndex]?.imagenes || []).slice();
        updated['imagenes'] = existentes.concat(
          nuevas.map((s, idx) => ({ url: s.url, orden: (existentes.length || 0) + idx + 1 }))
        );
        // También mantener imagen_url si aplica
        if (!updated['imagen_url']) {
          updated['imagen_url'] = updated['imagenes'][0]?.url || updated['imagen_url'];
        }
      }
      this.variantes[this.editingIndex] = updated;

      Swal.fire({
        icon: 'success',
        title: 'Variante actualizada',
        timer: 1500,
        showConfirmButton: false
      });

      // Limpiar estado y formulario de edición
      this.cancelEditVariante();
    } catch (error: any) {
      console.error('Error al actualizar variante:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.error?.message || 'No se pudo actualizar la variante'
      });
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Cancela la edición y limpia el formulario
   */
  cancelEditVariante(): void {
    this.editingVariant = false;
    this.editingIndex = null;
    this.currentVariant = null;
    this.varianteForm.reset();
    this.selectedImages = [];
  }

  async agregarVariante(): Promise<void> {
    if (this.varianteForm.invalid || !this.productoId) {
      return;
    }

    this.cargando = true;

    try {
      // 1. Crear la variante
      const formValues = this.varianteForm.value;
      // Validaciones de unicidad SKU y barcode antes de enviar al backend
      const skuNuevo = formValues.sku?.trim();
      const barcodeNuevo = formValues.barcode?.trim();
      if (skuNuevo) {
        const skuDuplicado = this.variantes.some(v => v.sku === skuNuevo);
        if (skuDuplicado) {
          Swal.fire({ icon: 'error', title: 'SKU duplicado', text: 'Ya existe una variante con este SKU.' });
          this.cargando = false;
          return;
        }
      }
      if (barcodeNuevo) {
        const barcodeDuplicado = this.variantes.some(v => v.barcode === barcodeNuevo);
        if (barcodeDuplicado) {
          Swal.fire({ icon: 'error', title: 'Código de barras duplicado', text: 'Ya existe una variante con este código de barras.' });
          this.cargando = false;
          return;
        }
      }
      const normalizedSku = (formValues.sku || '').trim().toUpperCase();
      const normalizedBarcode = (formValues.barcode || '').trim().toUpperCase();

      const varianteData = {
        id_producto: this.productoId,
        modelo: formValues.modelo,
        color: formValues.color,
        talla: formValues.talla,
        sku: normalizedSku,
        barcode: normalizedBarcode,
        precio_venta: formValues.precio_venta,
        precio_costo: formValues.precio_costo,
        descuento: formValues.descuento,
        activo: formValues.activo
      };

      const variante = await this.productosService.crearVariante(varianteData).toPromise();

      // 2. Crear el registro de stock inicial
      if (formValues.stock_inicial > 0) {
        try {
          const stockData = {
            id_variante: variante.id_variante,
            stock: formValues.stock_inicial
          };
          await this.productosService.createStock(stockData).toPromise();
        } catch (error) {
          console.error('Error al crear el stock inicial:', error);
          // Mostramos el error pero continuamos ya que la variante está creada
          Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La variante se creó pero hubo un error al registrar el stock inicial',
            timer: 2000
          });
        }
      }

      // 3. Agregar imágenes a la variante
      if (this.selectedImages.length > 0) {
        try {
          const esAccesorio = this.isAccesorio();
          const esFirstVariante = this.variantes.length === 0;

          console.log('Debug - Procesar Imágenes:', {
            esAccesorio,
            totalImagenes: this.selectedImages.length,
            esFirstVariante
          });

          // Para accesorios permitimos todas las imágenes, para el resto solo una
          const imagenesToAdd = esAccesorio ? this.selectedImages : [this.selectedImages[0]];

          // Primero agregamos las imágenes a la variante
          for (let i = 0; i < imagenesToAdd.length; i++) {
            try {
              const imagenData = {
                id_variante: variante.id_variante,
                url: imagenesToAdd[i].url,
                orden: i + 1
              };

              // Agregar la imagen a la variante
              await this.productosService.agregarImagenVariante(imagenData).toPromise();

              // Si es la primera imagen de la primera variante, establecerla como principal
              if (esFirstVariante && i === 0) {
                try {
                  await this.productosService.actualizarProducto(
                    this.productoId!,
                    {
                      imagen_principal: imagenesToAdd[i].url,
                      activo: true // aseguramos que el producto esté activo
                    }
                  ).toPromise();
                  console.log('✅ Imagen principal establecida:', imagenesToAdd[i].url);
                } catch (error) {
                  console.warn('⚠️ Advertencia al establecer imagen principal:', error);
                  // Continuamos ya que el error podría ser solo del endpoint
                }
              }
            } catch (error) {
              console.error(`Error al procesar imagen ${i}:`, error);
            }
          }
        } catch (error) {
          console.error('Error al guardar las imágenes:', error);
          // Continuamos aunque falle la imagen, ya que la variante ya se creó
        }
      }

      this.variantes.push(variante);
      this.varianteForm.reset();
      this.selectedImages = [];

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Variante agregada correctamente',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error: any) {
      console.error('Error al crear variante:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.error?.message || 'No se pudo crear la variante'
      });
    } finally {
      this.cargando = false;
    }
  }

  finalizarCreacion(): void {
    if (this.variantes.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin variantes',
        text: 'Debe agregar al menos una variante al producto'
      });
      return;
    }

    this.productoGuardado.emit();
    this.cerrar();
  }

  cerrar(): void {
    this.pasoActual = 1;
    this.productoId = null;
    this.variantes = [];
    this.selectedImages = [];
    this.productoForm.reset();
    this.varianteForm.reset();
    this.cerrarModal.emit();
  }

  isAccesorio(): boolean {
    const categoriaId = this.productoForm.get('id_categoria')?.value;
    console.log('Verificando categoría:', {
      categoriaId,
      tipo: typeof categoriaId,
      esIgual: categoriaId === 7,
      esIgualString: categoriaId === '7'
    });
    // Comparamos tanto con número como con string ya que podría venir en cualquier formato
    return categoriaId === 7 || categoriaId === '7'; // Categoría 7 corresponde a Accesorios
  }

  mostrarError(campo: string): string {
    const control = this.productoForm.get(campo);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return `El campo es requerido`;
    if (control.errors['minlength'])
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `El valor debe ser mayor a ${control.errors['min'].min}`;

    return 'Campo inválido';
  }

  // Totales (unitarios) de costo y venta de las variantes cargadas
  get totalCosto(): number {
    return (this.variantes || []).reduce((acc, v) => acc + (Number(v?.precio_costo) || 0), 0);
  }

  get totalVenta(): number {
    return (this.variantes || []).reduce((acc, v) => acc + (Number(v?.precio_venta) || 0), 0);
  }

  // Totales por inventario (precio * stock) si hay stock disponible
  get totalCostoInventario(): number {
    return (this.variantes || []).reduce((acc, v) => {
      const s = Number(v?.stock?.stock) || 0;
      const c = Number(v?.precio_costo) || 0;
      return acc + s * c;
    }, 0);
  }

  get totalVentaInventario(): number {
    return (this.variantes || []).reduce((acc, v) => {
      const s = Number(v?.stock?.stock) || 0;
      const pv = Number(v?.precio_venta) || 0;
      return acc + s * pv;
    }, 0);
  }

  // Previews incluyendo lo que hay en el formulario actual (sin haber guardado todavía)
  private getFormNumber(control: string): number {
    return Number(this.varianteForm?.get(control)?.value) || 0;
  }

  get totalCostoConFormulario(): number {
    const formCosto = this.getFormNumber('precio_costo');
    if (formCosto <= 0) return this.totalCosto;
    // Si estamos editando, reemplazamos el costo de la variante actual
    if (this.editingVariant && this.currentVariant) {
      const actual = Number(this.currentVariant?.precio_costo) || 0;
      return this.totalCosto - actual + formCosto;
    }
    return this.totalCosto + formCosto;
  }

  get totalVentaConFormulario(): number {
    const formVenta = this.getFormNumber('precio_venta');
    if (formVenta <= 0) return this.totalVenta;
    if (this.editingVariant && this.currentVariant) {
      const actual = Number(this.currentVariant?.precio_venta) || 0;
      return this.totalVenta - actual + formVenta;
    }
    return this.totalVenta + formVenta;
  }

  get totalCostoInventarioConFormulario(): number {
    const formCosto = this.getFormNumber('precio_costo');
    const formStock = this.getFormNumber('stock_inicial');
    if (formCosto <= 0 || formStock < 0) return this.totalCostoInventario;
    if (this.editingVariant && this.currentVariant) {
      const oldCosto = Number(this.currentVariant?.precio_costo) || 0;
      const oldStock = Number(this.currentVariant?.stock?.stock) || 0;
      return this.totalCostoInventario - (oldCosto * oldStock) + (formCosto * formStock);
    }
    return this.totalCostoInventario + (formCosto * formStock);
  }

  get totalVentaInventarioConFormulario(): number {
    const formVenta = this.getFormNumber('precio_venta');
    const formStock = this.getFormNumber('stock_inicial');
    if (formVenta <= 0 || formStock < 0) return this.totalVentaInventario;
    if (this.editingVariant && this.currentVariant) {
      const oldVenta = Number(this.currentVariant?.precio_venta) || 0;
      const oldStock = Number(this.currentVariant?.stock?.stock) || 0;
      return this.totalVentaInventario - (oldVenta * oldStock) + (formVenta * formStock);
    }
    return this.totalVentaInventario + (formVenta * formStock);
  }

  /** Crear marca rápida desde el modal */
  async crearMarcaRapida(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Crear nueva marca',
      html:
        '<input id="swal-marca-nombre" class="swal2-input" placeholder="Nombre*" />' +
  '<input id="swal-marca-imagen" class="swal2-input" placeholder="URL de la imagen*" />',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-marca-nombre') as HTMLInputElement)?.value?.trim();
        const imagen = (document.getElementById('swal-marca-imagen') as HTMLInputElement)?.value?.trim();
        if (!nombre) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return null;
        }
        if (!imagen) {
          Swal.showValidationMessage('La URL de la imagen es obligatoria');
          return null;
        }
        // Validación básica de URL
        try {
          const u = new URL(imagen);
          if (!/^https?:$/i.test(u.protocol)) throw new Error('Protocolo no válido');
        } catch {
          Swal.showValidationMessage('Ingrese una URL válida (http/https)');
          return null;
        }
        return { nombre, imagen };
      }
    });

    if (!formValues) return; // cancelado

    try {
  const nueva = await this.marcasService.crearMarca({ nombre: formValues.nombre, imagen: formValues.imagen }).toPromise();
      if (!nueva) throw new Error('Respuesta vacía del servidor');
      // Insertar en lista local
      this.marcas.push(nueva);
      // Seleccionar automáticamente
      this.productoForm.patchValue({ id_marca: nueva.id_marca });
      Swal.fire({ icon: 'success', title: 'Marca creada', timer: 1500, showConfirmButton: false });
    } catch (e: any) {
      console.error('Error creando marca rápida:', e);
      Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'No se pudo crear la marca' });
    }
  }
}
