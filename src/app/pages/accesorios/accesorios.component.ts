import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ProductosService } from 'src/app/services/productos.service';
import { CartService } from 'src/app/services/cart.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { Product } from 'src/app/models/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.scss']
})
export class AccesoriosComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  private userSubscription!: Subscription;
  selectedVarianteId: number | null = null;
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  // 🌀 Carrusel
  accesoriosImages: string[] = [
    'https://plus.unsplash.com/premium_photo-1661645449694-5bf9766205e1?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
    'https://images.pexels.com/photos/11926130/pexels-photo-11926130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170'
  ];

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.cargarAccesorios();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  ngAfterViewInit(): void {
    Swiper.use([Autoplay, Pagination, Navigation]);
    new Swiper('.main-swiper', {
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  /** 👜 Cargar accesorios */
  cargarAccesorios(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        const accesorios = data.filter(
          (v: any) =>
            String(v.producto?.id_categoria) === '7' ||
            v.producto?.nombre?.toLowerCase().includes('accesorio') ||
            v.modelo?.toLowerCase().includes('accesorio')
        );

        const agrupadas: any = {};
        for (const v of accesorios) {
          const idProducto = v.producto?.id_producto;
          if (!idProducto) continue;

          if (!agrupadas[idProducto]) {
            agrupadas[idProducto] = {
              id: idProducto,
              name: v.producto?.nombre || v.modelo,
              description: v.producto?.descripcion || 'Accesorio que complementa tu estilo.',
              images: [],
              sizes: [],
              descuentos: [],
              precios: []
            };
          }

          const nuevasImgs = [
            v.imagen_url,
            ...(v.imagenes?.map((img: any) => img.url) || [])
          ].filter(Boolean);

          for (const img of nuevasImgs) {
            if (!agrupadas[idProducto].images.includes(img)) {
              agrupadas[idProducto].images.push(img);
            }
          }

          agrupadas[idProducto].sizes.push({
            talla: v.talla || 'Única',
            stock: v.stock?.stock ?? 0,
            descuento: parseFloat(v.descuento ?? 0),
            precio: parseFloat(v.precio_final ?? v.precio_venta ?? 0)
          });

          agrupadas[idProducto].descuentos.push(parseFloat(v.descuento ?? 0));
          agrupadas[idProducto].precios.push(parseFloat(v.precio_venta ?? v.precio_final ?? 0));
        }

        this.products = Object.values(agrupadas).map((p: any) => {
          const maxPrecio = Math.max(...p.precios);
          const minPrecio = Math.min(...p.precios);
          const maxDesc = Math.max(...p.descuentos);

          const tieneDescuento = maxDesc > 0;
          const precioBase = maxPrecio;
          const precioConDescuento = tieneDescuento
            ? parseFloat((precioBase * (1 - maxDesc / 100)).toFixed(2))
            : minPrecio;

          return {
            ...p,
            image: p.images[0] || 'https://via.placeholder.com/400x400?text=Sin+Imagen',
            descuento: tieneDescuento ? maxDesc : 0,
            price: precioConDescuento,
            oldPrice: precioBase,
            tieneRango: maxPrecio !== minPrecio
          };
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar accesorios:', err);
        this.loading = false;
      }
    });
  }

  // =========================
  // 🪞 Modal
  // =========================
  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage = product.images?.[0] || product.image || 'https://via.placeholder.com/400x400?text=Sin+Imagen';
    this.selectedSize = '';
    (this.selectedProduct as any).basePrice = product.price;
    (this.selectedProduct as any).baseOldPrice = product.oldPrice;
    (this.selectedProduct as any).baseDescuento = product.descuento;
  }

  closeModal() {
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

  /** 🛍️ Agregar al carrito */
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

    this.toastModal(`${this.selectedProduct.name} Agregar al Carrito 🛍️`, 'success');
    this.closeModal();
  }

  /** ❤️ Agregar a favoritos */
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

    this.favoritesService.addToFavorites({
      id_variante: this.selectedVarianteId,
      name: this.selectedProduct?.name,
      talla: this.selectedSize,
      image: this.activeImage,
      precio_final: this.selectedProduct?.price
    });

    this.toastModal('Agregado a tus favoritos 💗', 'success');
    this.closeModal();
  }

  /** 💔 Quitar de favoritos */
  removeFromFavorites(): void {
    if (this.selectedVarianteId) {
      this.favoritesService.removeFromFavorites(this.selectedVarianteId, this.selectedSize);
      this.toastModal('Eliminado de favoritos 💔', 'info');
      this.closeModal();
    }
  }

  /** 🚪 Cerrar sesión */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastModal('Sesión cerrada correctamente', 'info');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        this.toastModal('Error al cerrar sesión', 'error');
      }
    });
  }

  isInFavorites(): boolean {
    if (!this.selectedVarianteId) return false;
    return this.favoritesService.isInFavorites(this.selectedVarianteId, this.selectedSize);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
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
