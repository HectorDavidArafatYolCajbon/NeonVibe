import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.scss']
})
export class OfertasComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  /** 🔥 Cargar productos que tengan al menos una variante con descuento */
  cargarOfertas(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        const agrupadas: any = {};

        for (const v of data) {
          const idProducto = v.producto?.id_producto;
          if (!idProducto) continue;

          if (!agrupadas[idProducto]) {
            agrupadas[idProducto] = {
              id: idProducto,
              name: v.producto?.nombre || v.modelo,
              description: v.producto?.descripcion || 'Producto en oferta especial.',
              images: [],
              sizes: [],
              descuentos: [],
              preciosVenta: [],
              preciosFinales: []
            };
          }

          // 🖼️ Reunir imágenes válidas
          const imgs: string[] = [];

          const agregarImagen = (url: string | undefined) => {
            if (url && url.trim() !== '' && !url.includes('Sin+Imagen')) {
              imgs.push(url);
            }
          };

          agregarImagen(v.imagen_url);
          v.imagenes?.forEach((i: any) => agregarImagen(i?.url));
          v.producto?.imagenes?.forEach((i: any) => agregarImagen(i?.url));

          // Si no hay imágenes válidas, se agregará más adelante un placeholder (NO aquí)

          imgs.forEach((img) => {
            if (!agrupadas[idProducto].images.includes(img)) {
              agrupadas[idProducto].images.push(img);
            }
          });

          // Guardar tallas y precios
          const pv = parseFloat(v.precio_venta ?? 0);
          const pf = parseFloat(v.precio_final ?? 0);
          const desc = parseFloat(v.descuento ?? 0);

          agrupadas[idProducto].sizes.push({
            talla: v.talla || 'Única',
            stock: v.stock?.stock ?? 0,
            descuento: desc,
            precioVenta: pv,
            precioFinal: pf
          });

          agrupadas[idProducto].descuentos.push(desc);
          agrupadas[idProducto].preciosVenta.push(pv);
          agrupadas[idProducto].preciosFinales.push(pf);
        }

        // Filtrar productos con al menos una variante en oferta
        const ofertas = Object.values(agrupadas).filter(
          (p: any) => p.descuentos.some((d: number) => d > 0)
        );

        // Calcular precio correcto
        this.products = ofertas.map((p: any) => {
          const maxDesc = Math.max(...p.descuentos);
          const precioNormal = Math.max(...p.preciosVenta);
          let precioConDescuento = Math.max(...p.preciosFinales);

          // Si el precio final no existe o es igual al normal, se calcula manualmente
          if (!precioConDescuento || precioConDescuento === precioNormal) {
            precioConDescuento = parseFloat(
              (precioNormal * (1 - maxDesc / 100)).toFixed(2)
            );
          }

          // 🩶 Si no hay imágenes válidas, agregamos placeholder
          const imagenesValidas = (p.images || []).filter(
            (img: string) => img && !img.includes('Sin+Imagen')
          );
          const primeraImagen =
            imagenesValidas[0] ||
            'https://via.placeholder.com/400x400?text=Sin+Imagen';

          return {
            ...p,
            image: primeraImagen,
            images: imagenesValidas.length
              ? imagenesValidas
              : [primeraImagen],
            descuento: maxDesc,
            price: precioConDescuento,
            oldPrice: precioNormal,
            tieneRango: false
          };
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar ofertas:', err);
        this.loading = false;
      }
    });
  }

  // ==========================
  // 🔹 Modal y selección
  // ==========================
  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage =
      product.images?.[0] ||
      product.image ||
      'https://via.placeholder.com/400x400?text=Sin+Imagen';
    this.selectedSize = '';

    (this.selectedProduct as any).basePrice = product.price;
    (this.selectedProduct as any).baseOldPrice = product.oldPrice;
    (this.selectedProduct as any).baseDescuento = product.descuento;
    (this.selectedProduct as any).baseImages = [...(product.images || [])];
  }

  closeModal() {
    this.selectedProduct = null;
  }

  nextImage() {
    if (!this.selectedProduct?.images?.length) return;
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[(idx + 1) % this.selectedProduct.images.length];
  }

  prevImage() {
    if (!this.selectedProduct?.images?.length) return;
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[
        (idx - 1 + this.selectedProduct.images.length) %
          this.selectedProduct.images.length
      ];
  }

/** 🔹 Al seleccionar talla (corrige caso sin descuento) */
selectSize(size: any) {
  if (!this.selectedProduct) return;
  this.selectedSize = size.talla;

  const basePrice = (this.selectedProduct as any).basePrice ?? 0;
  const baseOld = (this.selectedProduct as any).baseOldPrice ?? 0;
  const baseDesc = (this.selectedProduct as any).baseDescuento ?? 0;

  const variante = (this.productosService.cachedVariantes || []).find(
    (v: any) =>
      v.producto?.id_producto === this.selectedProduct?.id &&
      (v.talla || 'Única') === size.talla
  );

  if (variante) {
    const pv = parseFloat(variante.precio_venta ?? baseOld);
    const desc = parseFloat(variante.descuento ?? baseDesc);
    let pf = parseFloat(variante.precio_final ?? '0');

    // Si no tiene descuento o descuento 0, mostrar solo el precio normal
    if (!desc || desc <= 0) {
      this.selectedProduct.price = pv;
      this.selectedProduct.oldPrice = 0; // ← no mostrar
      this.selectedProduct.descuento = 0;
    } else {
      // Si tiene descuento, calcular precio final si no viene
      if (!pf || pf === pv) {
        pf = parseFloat((pv * (1 - desc / 100)).toFixed(2));
      }
      this.selectedProduct.price = pf; // rojo (con descuento)
      this.selectedProduct.oldPrice = pv; // gris tachado
      this.selectedProduct.descuento = desc;
    }

    // Mantener imágenes
    this.selectedProduct.images =
      (this.selectedProduct as any).baseImages || [];
    this.activeImage =
      this.selectedProduct.images?.[0] ||
      'https://via.placeholder.com/400x400?text=Sin+Imagen';

    // 🔔 Animación visual del precio
    const priceEl = document.querySelector('.modal-details .price') as HTMLElement;
    if (priceEl) {
      priceEl.classList.remove('price-change');
      void priceEl.offsetWidth;
      priceEl.classList.add('price-change');
    }
  } else {
    // Restaurar base
    this.selectedProduct.price = basePrice;
    this.selectedProduct.oldPrice = baseOld;
    this.selectedProduct.descuento = baseDesc;
  }
}
}
