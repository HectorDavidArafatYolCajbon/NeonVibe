import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-blusas',
  templateUrl: './blusas.component.html',
  styleUrls: ['./blusas.component.scss']
})
export class BlusasComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarBlusas();
  }

  /** 🩵 Cargar productos tipo blusa */
  cargarBlusas(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        // 🔹 Filtrar solo productos tipo blusa
        const blusas = data.filter(
          (v: any) =>
            v.producto?.nombre?.toLowerCase().includes('blusa') ||
            v.modelo?.toLowerCase().includes('blusa')
        );

        const agrupadas: any = {};

        for (const v of blusas) {
          const idProducto = v.producto?.id_producto;

          // ⛔️ Omitir variantes sin imágenes válidas
          const tieneImagen =
            (v.imagen_url && !v.imagen_url.includes('Sin+Imagen')) ||
            (Array.isArray(v.imagenes) &&
              v.imagenes.some((img: any) => img?.url && !img.url.includes('Sin+Imagen')));

          if (!tieneImagen) continue;

          if (!agrupadas[idProducto]) {
            agrupadas[idProducto] = {
              id: idProducto,
              name: v.producto?.nombre || v.modelo,
              description: v.producto?.descripcion || 'Sin descripción disponible',
              color: v.color,
              image:
                v.imagen_url ||
                v.imagenes?.[0]?.url ||
                'https://via.placeholder.com/400x400?text=Sin+Imagen',
              images: [],
              sizes: [],
              descuentos: [],
              precios: []
            };
          }

          // Combinar imágenes válidas
          const nuevasImgs: string[] = [];
          if (v.imagen_url) nuevasImgs.push(v.imagen_url);
          if (Array.isArray(v.imagenes))
            nuevasImgs.push(...v.imagenes.filter((i: any) => i?.url).map((i: any) => i.url));

          agrupadas[idProducto].images = [
            ...new Set([...(agrupadas[idProducto].images || []), ...nuevasImgs])
          ];

          agrupadas[idProducto].sizes.push({
            talla: v.talla,
            stock: v.stock?.stock ?? 0,
            descuento: parseFloat(v.descuento ?? 0),
            precio: parseFloat(v.precio_final ?? v.precio_venta ?? 0)
          });

          agrupadas[idProducto].descuentos.push(parseFloat(v.descuento ?? 0));
          agrupadas[idProducto].precios.push(parseFloat(v.precio_final ?? v.precio_venta ?? 0));
        }

        this.products = Object.values(agrupadas)
          .map((p: any) => {
            const maxPrecio = Math.max(...p.precios);
            const maxDesc = Math.max(...p.descuentos);
            const minPrecio = Math.min(...p.precios);

            return {
              ...p,
              descuento: maxDesc > 0 ? maxDesc : 0,
              price: minPrecio,
              oldPrice: maxDesc > 0 ? maxPrecio : minPrecio,
              tieneRango: maxPrecio !== minPrecio
            };
          })
          .filter((p: any) => Array.isArray(p.images) && p.images.length > 0);

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar blusas:', err);
        this.loading = false;
      }
    });
  }

  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage = product.images?.[0] || '';
    this.selectedSize = '';

    this.selectedProduct.basePrice = product.price;
    this.selectedProduct.baseOldPrice = product.oldPrice;
    this.selectedProduct.baseDescuento = product.descuento;
  }

  closeModal() {
    this.selectedProduct = null;
  }

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
        (idx - 1 + this.selectedProduct.images.length) % this.selectedProduct.images.length
      ];
  }

  selectSize(size: any) {
    if (!this.selectedProduct) return;
    this.selectedSize = size.talla;

    const variante = (this.productosService.cachedVariantes || []).find(
      (v: any) =>
        v.producto?.id_producto === this.selectedProduct?.id &&
        v.talla === size.talla
    );

    if (variante) {
      this.selectedProduct.price = parseFloat(
        variante.precio_final ?? variante.precio_venta ?? this.selectedProduct.basePrice
      );
      this.selectedProduct.oldPrice = parseFloat(
        variante.precio_venta ?? this.selectedProduct.baseOldPrice
      );
      this.selectedProduct.descuento = parseFloat(variante.descuento ?? 0);

      const priceEl = document.querySelector('.modal-details .price') as HTMLElement;
      if (priceEl) {
        priceEl.classList.remove('price-change');
        void priceEl.offsetWidth;
        priceEl.classList.add('price-change');
      }

      const imgsVariante: string[] = [];
      if (variante.imagen_url) imgsVariante.push(variante.imagen_url);
      if (Array.isArray(variante.imagenes))
        imgsVariante.push(...variante.imagenes.filter((i: any) => i?.url).map((i: any) => i.url));

      const todasImgs = [
        ...new Set([...(this.selectedProduct.images || []), ...imgsVariante])
      ];

      if (todasImgs.length > 0) {
        this.selectedProduct.images = todasImgs;
        this.activeImage = todasImgs[0];
      }
    } else {
      this.selectedProduct.price = this.selectedProduct.basePrice;
      this.selectedProduct.oldPrice = this.selectedProduct.baseOldPrice;
      this.selectedProduct.descuento = this.selectedProduct.baseDescuento;
    }
  }
}
