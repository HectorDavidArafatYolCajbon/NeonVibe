import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-camisas',
  templateUrl: './camisas.component.html',
  styleUrls: ['./camisas.component.scss']
})
export class CamisasComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarCamisas();
  }

  /** 🔹 Cargar camisas agrupando variantes por producto/color */
  /** 🔹 Cargar camisas agrupando variantes por producto/color */
cargarCamisas(): void {
  this.loading = true;
  this.productosService.getVariantes().subscribe({
    next: (data) => {
      // Filtrar camisas
      const camisas = data.filter(
        (v: any) =>
          v.producto?.nombre?.toLowerCase().includes('camisa') ||
          v.modelo?.toLowerCase().includes('camisa')
      );

      // Agrupar por producto
      const agrupadas: any = {};
      for (const v of camisas) {
        const idProducto = v.producto?.id_producto;
        if (!agrupadas[idProducto]) {
          agrupadas[idProducto] = {
            id: idProducto,
            name: v.producto?.nombre || v.modelo,
            description: v.producto?.descripcion || 'Sin descripción disponible',
            color: v.color,
            image: v.imagen_url || v.imagenes?.[0]?.url || 'https://via.placeholder.com/400x400?text=Sin+Imagen',
            images: [
              v.imagen_url,
              ...(v.imagenes?.map((img: any) => img.url) || [])
            ].filter(Boolean),
            sizes: [],
            descuentos: [], // guardamos todos los descuentos de tallas
            precios: []
          };
        }

        // Añadimos información de cada variante
        agrupadas[idProducto].sizes.push({
          talla: v.talla,
          stock: v.stock?.stock ?? 0,
          descuento: parseFloat(v.descuento ?? 0),
          precio: parseFloat(v.precio_final ?? v.precio_venta ?? 0)
        });

        agrupadas[idProducto].descuentos.push(parseFloat(v.descuento ?? 0));
        agrupadas[idProducto].precios.push(parseFloat(v.precio_final ?? v.precio_venta ?? 0));
      }

      // Determinar precio mostrado y descuento general
      this.products = Object.values(agrupadas).map((p: any) => {
        const maxPrecio = Math.max(...p.precios);
        const maxDesc = Math.max(...p.descuentos);
        const minPrecio = Math.min(...p.precios);

        return {
          ...p,
          descuento: maxDesc > 0 ? maxDesc : 0,
          price: minPrecio,
          oldPrice: maxDesc > 0 ? maxPrecio : minPrecio,
          tieneRango: maxPrecio !== minPrecio // 👈 indicador para mostrar "Desde Q..."
        };
      });

      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error al cargar camisas:', err);
      this.loading = false;
    }
  });
}


// 🔹 Abrir modal
openModal(product: Product) {
  this.selectedProduct = { ...product };
  this.activeImage = product.images?.[0] || '';
  this.selectedSize = '';

  // Guardamos los precios originales del producto base
  this.selectedProduct.basePrice = product.price;
  this.selectedProduct.baseOldPrice = product.oldPrice;
  this.selectedProduct.baseDescuento = product.descuento;
}

  // 🔹 Cerrar modal
  closeModal() {
    this.selectedProduct = null;
  }

  // 🔹 Navegar entre imágenes
  nextImage() {
    if (!this.selectedProduct?.images) return;
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[(idx + 1) % this.selectedProduct.images.length];
  }

  prevImage() {
    if (!this.selectedProduct?.images) return;
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[
        (idx - 1 + this.selectedProduct.images.length) %
          this.selectedProduct.images.length
      ];
  }

 // 🔹 Al seleccionar talla
selectSize(size: any) {
  if (!this.selectedProduct) return;

  this.selectedSize = size.talla;

  const variante = (this.productosService.cachedVariantes || [])
    .find((v: any) =>
      v.producto?.id_producto === this.selectedProduct?.id &&
      v.talla === size.talla
    );

  if (variante) {
    // Actualiza precio y descuento según talla
    this.selectedProduct.price = parseFloat(variante.precio_final ?? variante.precio_venta ?? this.selectedProduct.basePrice);
    this.selectedProduct.oldPrice = parseFloat(variante.precio_venta ?? this.selectedProduct.baseOldPrice);
    this.selectedProduct.descuento = parseFloat(variante.descuento ?? 0);

    // 👇 Agregar clase temporal al precio para animar
    const priceEl = document.querySelector('.modal-details .price') as HTMLElement;
      if (priceEl) {
        priceEl.classList.remove('price-change');
        void priceEl.offsetWidth; // reinicia animación
        priceEl.classList.add('price-change');
      }


    // Imágenes según variante
    if (variante.imagenes?.length > 0) {
      this.selectedProduct.images = [
        variante.imagen_url,
        ...variante.imagenes.map((i: any) => i.url)
      ].filter(Boolean);
      this.activeImage = this.selectedProduct.images[0];
    } else {
      this.selectedProduct.images =
        this.selectedProduct.images || [];
      this.activeImage =
        this.selectedProduct.images[0] ||
        'https://via.placeholder.com/400x400?text=Sin+Imagen';
    }
  } else {
    // Restaurar valores base
    this.selectedProduct.price = this.selectedProduct.basePrice;
    this.selectedProduct.oldPrice = this.selectedProduct.baseOldPrice;
    this.selectedProduct.descuento = this.selectedProduct.baseDescuento;
  }
}




}
