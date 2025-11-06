import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { CartService } from 'src/app/services/cart.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { Product } from 'src/app/models/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faldas-vestidos',
  templateUrl: './vestidos.component.html',
  styleUrls: ['./vestidos.component.scss']
})
export class VestidosComponent implements OnInit, OnDestroy {
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

  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.cargarFaldasVestidos();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  /** 🩷 Cargar vestidos y faldas */
  cargarFaldasVestidos(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        const prendas = data.filter(
          (v: any) =>
            v.producto?.nombre?.toLowerCase().includes('vestido') ||
            v.producto?.nombre?.toLowerCase().includes('falda') ||
            v.modelo?.toLowerCase().includes('vestido') ||
            v.modelo?.toLowerCase().includes('falda')
        );

        const agrupadas: any = {};

        for (const v of prendas) {
          const idProducto = v.producto?.id_producto;
          if (!idProducto) continue;

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
              images: [],
              sizes: [],
              descuentos: [],
              precios: []
            };
          }

          const nuevasImgs = [
            v.imagen_url,
            ...(v.imagenes?.map((i: any) => i.url) || [])
          ].filter(Boolean);

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

        this.products = Object.values(agrupadas).map((p: any) => {
          const maxPrecio = Math.max(...p.precios);
          const maxDesc = Math.max(...p.descuentos);
          const minPrecio = Math.min(...p.precios);
          return {
            ...p,
            image: p.images[0],
            descuento: maxDesc > 0 ? maxDesc : 0,
            price: minPrecio,
            oldPrice: maxDesc > 0 ? maxPrecio : minPrecio,
            tieneRango: maxPrecio !== minPrecio
          };
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar vestidos:', err);
        this.loading = false;
      }
    });
  }

  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage = product.images?.[0] || product.image || 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    this.selectedSize = '';
    this.selectedVarianteId = null;
    this.modalVisible = true;

    (this.selectedProduct as any).basePrice = product.price;
    (this.selectedProduct as any).baseOldPrice = product.oldPrice;
    (this.selectedProduct as any).baseDescuento = product.descuento;
    (this.selectedProduct as any).baseImages = [...(product.images || [])];
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedProduct = null;
    this.selectedSize = '';
    this.selectedVarianteId = null;
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
        (v.talla || 'Única') === size.talla
    );
    if (variante) {
      this.selectedVarianteId = variante.id_variante;
      this.selectedProduct.price = parseFloat(
        variante.precio_final ?? variante.precio_venta ?? (this.selectedProduct as any).basePrice
      );
      this.selectedProduct.oldPrice = parseFloat(
        variante.precio_venta ?? (this.selectedProduct as any).baseOldPrice
      );
      this.selectedProduct.descuento = parseFloat(variante.descuento ?? 0);
      const priceEl = document.querySelector('.modal-details .price') as HTMLElement;
      if (priceEl) {
        priceEl.classList.remove('price-change');
        void priceEl.offsetWidth;
        priceEl.classList.add('price-change');
      }
    }
  }

  /** 🛒 Agregar al carrito */
  addToCart(): void {
    if (!this.selectedProduct) return;
    if (!this.selectedSize || !this.selectedVarianteId) {
      this.toastModal('Selecciona una talla antes de agregar al carrito', 'warning');
      return;
    }

    const selectedSizeData = this.selectedProduct.sizes?.find(
      (s: any) => s.talla === this.selectedSize
    );
    if (!selectedSizeData || selectedSizeData.stock <= 0) {
      this.toastModal('🚫 Este producto está agotado', 'error');
      return;
    }

    const currentCart = this.cartService.getCart();
    const existing = currentCart.find(
      (item: any) =>
        item.id_variante === this.selectedVarianteId &&
        item.talla === this.selectedSize
    );

    if (existing) {
      if (existing.cantidad >= selectedSizeData.stock) {
        this.toastModal(`Solo hay ${selectedSizeData.stock} unidades disponibles`, 'warning');
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
        stock: selectedSizeData.stock
      };
      this.cartService.addToCart(productToAdd);
    }

    this.toastModal(`${this.selectedProduct.name} Agregar al Carrito 👗`, 'success');
    this.closeModal();
  }

  /** ❤️ Favoritos */
  addToFavorites(): void {
    if (!this.isLoggedIn) {
      this.toastModal('Debes iniciar sesión para agregar a favoritos', 'info');
      return;
    }

    if (!this.selectedSize || !this.selectedVarianteId) {
      this.closeModal();
      this.toastModal('Selecciona una talla antes de agregar a favoritos', 'warning');
      return;
    }

    if (!this.selectedProduct) return;

    this.favoritesService.addToFavorites({
      id_variante: this.selectedVarianteId,
      name: this.selectedProduct.name,
      talla: this.selectedSize,
      image: this.activeImage,
      precio_final: this.selectedProduct.price
    });

    this.toastModal('Agregado a tus favoritos 💕', 'success');
    this.closeModal();
  }

  removeFromFavorites(): void {
    if (this.selectedVarianteId) {
      this.favoritesService.removeFromFavorites(this.selectedVarianteId, this.selectedSize);
      this.toastModal('Eliminado de favoritos 💔', 'info');
      this.closeModal();
    }
  }

  isInFavorites(): boolean {
    if (!this.selectedVarianteId) return false;
    return this.favoritesService.isInFavorites(this.selectedVarianteId, this.selectedSize);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /** 🌑 Toast oscuro NeonVibe */
  private toastModal(title: string, icon: 'success' | 'error' | 'info' | 'warning') {
    Swal.fire({
      icon,
      title,
      position: 'top',
      toast: true,
      background: '#000',
      color: '#fff',
      showConfirmButton: false,
      timer: 1900,
      backdrop: false,
      customClass: { popup: 'neon-toast-dark' }
    });
  }
}
