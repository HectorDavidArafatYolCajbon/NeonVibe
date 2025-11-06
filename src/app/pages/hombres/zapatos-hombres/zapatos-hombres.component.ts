import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { CartService } from 'src/app/services/cart.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { Product } from 'src/app/models/product';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-zapatos',
  templateUrl: './zapatos-hombres.component.html',
  styleUrls: ['./zapatos-hombres.component.scss']
})
export class ZapatosHombresComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  private userSubscription!: Subscription;
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  selectedVarianteId: number | null = null;
  loading = true;
  modalVisible = false;
  currentVariante: any = null;

  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.cargarZapatos();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  /** 🟣 Cargar zapatillas agrupando variantes por producto/color */
  cargarZapatos(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        // 🔹 Filtrar productos tipo zapatillas o tenis para hombres
        const zapatos = data.filter(
          (v: any) => {
            const name = v.producto?.nombre?.toLowerCase() || '';
            const model = v.modelo?.toLowerCase() || '';
            const isShoe = name.includes('zapatilla') || name.includes('tenis') || model.includes('zapatilla') || model.includes('tenis');
            const isMen = name.includes('hombre') || name.includes('men') || model.includes('hombre') || model.includes('men');
            const isNotWomen = !name.includes('mujer') && !name.includes('woman') && !model.includes('mujer') && !model.includes('woman');
            return isShoe && isMen && isNotWomen;
          }
        );

        // 🔹 Agrupar por producto
        const agrupadas: any = {};

        for (const v of zapatos) {
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
        console.error('❌ Error al cargar zapatillas:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Abrir modal
  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage = product.images?.[0] || product.image || 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    this.selectedSize = '';
    this.selectedVarianteId = null;

    (this.selectedProduct as any).basePrice = product.price;
    (this.selectedProduct as any).baseOldPrice = product.oldPrice;
    (this.selectedProduct as any).baseDescuento = product.descuento;
    (this.selectedProduct as any).baseImages = [...(product.images || [])];
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

    const basePrice = (this.selectedProduct as any).basePrice ?? 0;
    const baseOld = (this.selectedProduct as any).baseOldPrice ?? 0;
    const baseDesc = (this.selectedProduct as any).baseDescuento ?? 0;

    const variante = (this.productosService.cachedVariantes || []).find(
      (v: any) =>
        v.producto?.id_producto === this.selectedProduct?.id &&
        (v.talla || 'Única') === size.talla
    );

    if (variante) {
      this.selectedVarianteId = variante.id_variante;

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
      this.selectedVarianteId = null;
    }
  }

  // 🔹 Agregar al carrito
  addToCart(): void {
    // 🧩 Validar que el producto y talla estén definidos
    if (!this.selectedProduct) {
      alert('Error: no hay producto seleccionado.');
      return;
    }

    if (!this.selectedSize || !this.selectedVarianteId) {
      alert('Por favor selecciona una talla antes de agregar al carrito.');
      return;
    }

    // 🧩 Validar que el arreglo sizes exista antes de buscar
    const selectedSizeData = this.selectedProduct.sizes?.find(
      (s: any) => s.talla === this.selectedSize
    );

    if (!selectedSizeData) {
      alert('Error: talla no encontrada o sin información de stock.');
      return;
    }

    const stockDisponible = selectedSizeData.stock ?? 0;
    if (stockDisponible <= 0) {
      alert('🚫 Este producto está agotado.');
      return;
    }

    // 🧩 Obtener carrito actual
    const currentCart = this.cartService.getCart();
    const existing = currentCart.find(
      (item: any) =>
        item.id_variante === this.selectedVarianteId &&
        item.talla === this.selectedSize
    );

    if (existing) {
      if (existing.cantidad >= stockDisponible) {
        alert(`⚠️ Solo hay ${stockDisponible} unidades disponibles.`);
        return;
      }
      existing.cantidad++;
      this.cartService.saveCart(currentCart);
    } else {
      const productToAdd = {
        id_variante: this.selectedVarianteId,
        name: this.selectedProduct.name,
        talla: this.selectedSize,
        image: this.activeImage,
        precio_final: this.selectedProduct.price,
        oldPrice: this.selectedProduct.oldPrice,
        descuento: this.selectedProduct.descuento,
        cantidad: 1,
        stock: stockDisponible
      };
      this.cartService.addToCart(productToAdd);
    }

    alert(`✅ ${this.selectedProduct.name} agregado a la bolsa`);
    this.closeModal();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /** 👕 Método de compatibilidad - usa openModal en su lugar */
  selectProduct(product: any): void {
    this.openModal(product);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /** Agregar a favoritos */
  addToFavorites(): void {
    if (!this.selectedProduct) return;
    if (!this.selectedSize || !this.selectedVarianteId) {
      alert('Por favor selecciona una talla');
      return;
    }

    this.favoritesService.addToFavorites({
      id_variante: this.selectedVarianteId,
      name: this.selectedProduct.name,
      talla: this.selectedSize,
      image: this.activeImage,
      precio_final: this.selectedProduct.price
    });
    alert('✅ Producto agregado a favoritos');
  }

  /** Quitar de favoritos */
  removeFromFavorites(): void {
    if (this.selectedVarianteId) {
      this.favoritesService.removeFromFavorites(this.selectedVarianteId, this.selectedSize);
      alert('✅ Producto removido de favoritos');
    }
  }

  /** Verificar si está en favoritos */
  isInFavorites(): boolean {
    return this.selectedVarianteId ?
      this.favoritesService.isInFavorites(this.selectedVarianteId, this.selectedSize) : false;
  }
}
