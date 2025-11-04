import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-faldas-vestidos',
  templateUrl: './vestidos.component.html',
  styleUrls: ['./vestidos.component.scss']
})
export class VestidosComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarFaldasVestidos();
  }

  /** 🟣 Cargar faldas y vestidos agrupando variantes por producto/color */
  cargarFaldasVestidos(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        // 🔹 Filtrar productos tipo falda o vestido
        const prendas = data.filter(
          (v: any) =>
            v.producto?.nombre?.toLowerCase().includes('falda') ||
            v.producto?.nombre?.toLowerCase().includes('vestido') ||
            v.modelo?.toLowerCase().includes('falda') ||
            v.modelo?.toLowerCase().includes('vestido')
        );

        // 🔹 Agrupar por producto
        const agrupadas: any = {};

        for (const v of prendas) {
          const idProducto = v.producto?.id_producto;

          // ⛔️ Saltar variantes sin imágenes reales
          const tieneImagenesValidas =
            (v.imagen_url && !v.imagen_url.includes('Sin+Imagen')) ||
            (Array.isArray(v.imagenes) &&
              v.imagenes.some((img: any) => img?.url && !img.url.includes('Sin+Imagen')));

          if (!tieneImagenesValidas) continue;

          // Crear grupo si no existe
          if (!agrupadas[idProducto]) {
            agrupadas[idProducto] = {
              id: idProducto,
              name: v.producto?.nombre || v.modelo,
              description: v.producto?.descripcion || 'Sin descripción disponible',
              color: v.color,
              image:
                v.imagen_url && !v.imagen_url.includes('Sin+Imagen')
                  ? v.imagen_url
                  : v.imagenes?.find((i: any) => i.url && !i.url.includes('Sin+Imagen'))?.url ||
                    'https://via.placeholder.com/400x400?text=Sin+Imagen',
              images: [],
              sizes: [],
              descuentos: [],
              precios: []
            };
          }

          // 🔹 Combinar imágenes válidas
          const nuevasImgs: string[] = [];

          if (v.imagen_url && !v.imagen_url.includes('Sin+Imagen'))
            nuevasImgs.push(v.imagen_url);

          if (Array.isArray(v.imagenes) && v.imagenes.length > 0) {
            for (const imgObj of v.imagenes) {
              if (imgObj?.url && !imgObj.url.includes('Sin+Imagen')) {
                nuevasImgs.push(imgObj.url);
              }
            }
          }

          // ✅ Unir sin duplicar ni vacíos
          agrupadas[idProducto].images = [
            ...new Set([
              ...(agrupadas[idProducto].images || []),
              ...nuevasImgs.filter(Boolean)
            ])
          ];

          // 🔹 Añadir tallas / variantes
          agrupadas[idProducto].sizes.push({
            talla: v.talla,
            stock: v.stock?.stock ?? 0,
            descuento: parseFloat(v.descuento ?? 0),
            precio: parseFloat(v.precio_final ?? v.precio_venta ?? 0)
          });

          agrupadas[idProducto].descuentos.push(parseFloat(v.descuento ?? 0));
          agrupadas[idProducto].precios.push(
            parseFloat(v.precio_final ?? v.precio_venta ?? 0)
          );
        }

        // 🔹 Calcular precios y descuentos generales
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
          // ⛔️ Filtrar productos sin imágenes válidas
          .filter((p: any) => Array.isArray(p.images) && p.images.length > 0);

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar faldas y vestidos:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Abrir modal
  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage = product.images?.[0] || '';
    this.selectedSize = '';

    // Guardar precios base
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

  // 🔹 Seleccionar talla
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
        variante.precio_final ??
          variante.precio_venta ??
          this.selectedProduct.basePrice
      );
      this.selectedProduct.oldPrice = parseFloat(
        variante.precio_venta ?? this.selectedProduct.baseOldPrice
      );
      this.selectedProduct.descuento = parseFloat(variante.descuento ?? 0);

      // 👇 Animación del precio
      const priceEl = document.querySelector(
        '.modal-details .price'
      ) as HTMLElement;
      if (priceEl) {
        priceEl.classList.remove('price-change');
        void priceEl.offsetWidth;
        priceEl.classList.add('price-change');
      }

      // 👗 Mostrar TODAS las imágenes (variante + producto base)
      const imgsVariante: string[] = [];

      if (variante.imagen_url && !variante.imagen_url.includes('Sin+Imagen'))
        imgsVariante.push(variante.imagen_url);

      if (Array.isArray(variante.imagenes) && variante.imagenes.length > 0) {
        for (const imgObj of variante.imagenes) {
          if (imgObj?.url && !imgObj.url.includes('Sin+Imagen')) {
            imgsVariante.push(imgObj.url);
          }
        }
      }

      // 🔸 Fusionar imágenes de la talla con las del producto
      const todasImgs = [
        ...new Set([
          ...(this.selectedProduct.images || []),
          ...imgsVariante.filter(Boolean)
        ])
      ];

      if (todasImgs.length > 0) {
        this.selectedProduct.images = todasImgs;
        this.activeImage = todasImgs[0];
      }
    } else {
      // Restaurar valores base
      this.selectedProduct.price = this.selectedProduct.basePrice;
      this.selectedProduct.oldPrice = this.selectedProduct.baseOldPrice;
      this.selectedProduct.descuento = this.selectedProduct.baseDescuento;
    }
  }
}
