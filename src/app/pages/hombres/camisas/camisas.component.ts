import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { CartService } from 'src/app/services/cart.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-camisas',
  templateUrl: './camisas.component.html',
  styleUrls: ['./camisas.component.scss']
})
export class CamisasComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  private userSubscription!: Subscription;
  selectedVarianteId: number | null = null;
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.cargarCamisas();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

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
          if (!idProducto) continue;

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
    (this.selectedProduct as any).basePrice = product.price;
    (this.selectedProduct as any).baseOldPrice = product.oldPrice;
    (this.selectedProduct as any).baseDescuento = product.descuento;
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
    this.selectedVarianteId = variante.id_variante;
    // Actualiza precio y descuento según talla
    this.selectedProduct.price = parseFloat(variante.precio_final ?? variante.precio_venta ?? (this.selectedProduct as any).basePrice);
    this.selectedProduct.oldPrice = parseFloat(variante.precio_venta ?? (this.selectedProduct as any).baseOldPrice);
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
    this.selectedVarianteId = null;
    // Restaurar valores base
    this.selectedProduct.price = (this.selectedProduct as any).basePrice;
    this.selectedProduct.oldPrice = (this.selectedProduct as any).baseOldPrice;
    this.selectedProduct.descuento = (this.selectedProduct as any).baseDescuento;
  }
}

  /** 🛒 Agregar producto al carrito */
  addToCart(selectedProduct: any): void {
    if (!this.selectedProduct) {
      alert('Error: no hay producto seleccionado.');
      return;
    }

    if (!this.selectedSize || !this.selectedVarianteId) {
      alert('Por favor selecciona una talla antes de agregar al carrito.');
      return;
    }

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /** Agregar a favoritos */
  addToFavorites(): void {
    if (!this.isLoggedIn) {
      alert('Debes iniciar sesión para agregar productos a favoritos.');
      return;
    }

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
