import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-zapatos-mujeres',
  templateUrl: './zapatos-mujeres.component.html',
  styleUrls: ['./zapatos-mujeres.component.scss']
})
export class ZapatosMujeresComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarZapatosMujer();
  }

  /** 👟 Cargar zapatillas de mujer */
  cargarZapatosMujer(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        console.log('🟣 Variantes recibidas:', data);

        // 🔹 Filtrar solo variantes que sean zapatillas de mujer
        const variantesMujer = data.filter(
          (v: any) =>
            (v.producto?.genero?.toLowerCase() === 'mujer' ||
              v.modelo?.toLowerCase().includes('mujer')) &&
            (v.producto?.nombre?.toLowerCase().includes('zapatilla') ||
              v.modelo?.toLowerCase().includes('zapatilla') ||
              String(v.producto?.id_categoria) === '6')
        );

        const agrupadas: any = {};

        for (const v of variantesMujer) {
          const idProducto = v.producto?.id_producto;
          if (!idProducto) continue;

          // 🟣 Crear grupo del producto si no existe
          if (!agrupadas[idProducto]) {
            agrupadas[idProducto] = {
              id: idProducto,
              name: v.producto?.nombre || v.modelo,
              description: v.producto?.descripcion || 'Calzado deportivo para mujer',
              color: v.color,
              image: '', // se define luego
              images: [],
              sizes: [],
              descuentos: [],
              precios: []
            };
          }

          // 🖼️ Agregar solo imágenes válidas (evita placeholders)
          const nuevasImgs: string[] = [];

          if (v.imagen_url && !v.imagen_url.includes('Sin+Imagen')) {
            nuevasImgs.push(v.imagen_url);
          }

          if (Array.isArray(v.imagenes)) {
            nuevasImgs.push(
              ...v.imagenes
                .filter((i: any) => i?.url && !i.url.includes('Sin+Imagen'))
                .map((i: any) => i.url)
            );
          }

          if (nuevasImgs.length > 0) {
            agrupadas[idProducto].images = [
              ...new Set([...(agrupadas[idProducto].images || []), ...nuevasImgs])
            ];
          }

          // 📏 Agregar tallas y precios (aunque no tengan imagen)
          agrupadas[idProducto].sizes.push({
            talla: v.talla,
            stock: v.stock?.stock ?? 0,
            descuento: parseFloat(v.descuento ?? 0),
            precio: parseFloat(v.precio_final ?? v.precio_venta ?? 0)
          });

          agrupadas[idProducto].descuentos.push(parseFloat(v.descuento ?? 0));
          agrupadas[idProducto].precios.push(parseFloat(v.precio_final ?? v.precio_venta ?? 0));
        }

        // 🔹 Convertir a array y calcular precios finales
        this.products = Object.values(agrupadas)
          .map((p: any) => {
            const maxPrecio = Math.max(...p.precios);
            const maxDesc = Math.max(...p.descuentos);
            const minPrecio = Math.min(...p.precios);

            // 🔹 Asignar imagen principal (si no tiene, usar placeholder)
            const imagenPrincipal =
              p.images.length > 0
                ? p.images[0]
                : 'https://via.placeholder.com/400x400/eeeeee/888888?text=Sin+imagen+disponible';

            return {
              ...p,
              image: imagenPrincipal,
              descuento: maxDesc > 0 ? maxDesc : 0,
              price: minPrecio,
              oldPrice: maxDesc > 0 ? maxPrecio : minPrecio,
              tieneRango: maxPrecio !== minPrecio
            };
          })
          // ✅ Mantiene productos incluso si no tienen imágenes válidas
          .filter((p: any) => Array.isArray(p.sizes) && p.sizes.length > 0);

        console.log('✅ Zapatillas mujer agrupadas:', this.products);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar zapatillas mujer:', err);
        this.loading = false;
      }
    });
  }

  /** 🔹 Modal */
  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage = product.images?.[0] || product.image || '';
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

  /** 🔹 Seleccionar talla (con animación de precio) */
  selectSize(size: any) {
    if (!this.selectedProduct) return;
    this.selectedSize = size.talla;

    const variante = (this.productosService.cachedVariantes || []).find(
      (v: any) =>
        v.producto?.id_producto === this.selectedProduct?.id &&
        v.talla === size.talla
    );

    // 🎨 Selecciona el elemento del precio en el DOM
    const priceElement = document.querySelector('.modal-details .price') as HTMLElement;
    if (priceElement) {
      priceElement.classList.remove('price-change');
    }

    if (variante) {
      this.selectedProduct.price = parseFloat(
        variante.precio_final ?? variante.precio_venta ?? this.selectedProduct.basePrice
      );
      this.selectedProduct.oldPrice = parseFloat(
        variante.precio_venta ?? this.selectedProduct.baseOldPrice
      );
      this.selectedProduct.descuento = parseFloat(variante.descuento ?? 0);

      const imgsVariante: string[] = [];

      if (variante.imagen_url && !variante.imagen_url.includes('Sin+Imagen'))
        imgsVariante.push(variante.imagen_url);

      if (Array.isArray(variante.imagenes))
        imgsVariante.push(
          ...variante.imagenes
            .filter((i: any) => i?.url && !i.url.includes('Sin+Imagen'))
            .map((i: any) => i.url)
        );

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

    // ✨ Aplica la animación de cambio de precio
    if (priceElement) {
      void priceElement.offsetWidth; // fuerza reflow para reiniciar animación
      priceElement.classList.add('price-change');
    }
  }

  /** 👜 Simular agregar al carrito */
  addToCart(product: any) {
    console.log('🛒 Producto agregado:', {
      producto: product.name,
      talla: this.selectedSize,
      precio: product.price
    });
    alert(`✅ "${product.name}" (Talla ${this.selectedSize}) agregado a la bolsa.`);
  }
}
