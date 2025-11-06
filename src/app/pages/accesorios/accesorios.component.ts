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

  // 🌀 Imágenes del carrusel
  accesoriosImages: string[] = [
    'https://plus.unsplash.com/premium_photo-1661645449694-5bf9766205e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.pexels.com/photos/11926130/pexels-photo-11926130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
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

  /** 🌀 Inicializar carrusel Swiper */
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

  /** 💜 Cargar accesorios agrupando variantes */
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

          // Combinar imágenes de producto y variante
          const nuevasImgs = [
            v.imagen_url,
            ...(v.imagenes?.map((img: any) => img.url) || [])
          ].filter(Boolean);

          for (const img of nuevasImgs) {
            if (!agrupadas[idProducto].images.includes(img)) {
              agrupadas[idProducto].images.push(img);
            }
          }

          // Añadir tallas y precios
          agrupadas[idProducto].sizes.push({
            talla: v.talla || 'Única',
            stock: v.stock?.stock ?? 0,
            descuento: parseFloat(v.descuento ?? 0),
            precio: parseFloat(v.precio_final ?? v.precio_venta ?? 0)
          });

          agrupadas[idProducto].descuentos.push(parseFloat(v.descuento ?? 0));
          agrupadas[idProducto].precios.push(parseFloat(v.precio_venta ?? v.precio_final ?? 0));
        }

        // ✅ Lógica correcta de precios (ya la tenías bien)
        this.products = Object.values(agrupadas).map((p: any) => {
          const maxPrecio = Math.max(...p.precios); // precio original
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
            price: precioConDescuento, // 🔴 precio con descuento
            oldPrice: precioBase,      // ⚫ precio original tachado
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

  // ==========================
  // 🔹 Modal y selección
  // ==========================
  openModal(product: Product) {
    this.selectedProduct = { ...product };
    this.activeImage = product.images?.[0] || '';
    this.selectedSize = '';

    (this.selectedProduct as any).basePrice = product.price;
    (this.selectedProduct as any).baseOldPrice = product.oldPrice;
    (this.selectedProduct as any).baseDescuento = product.descuento;
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

  /** 🔹 Al seleccionar una talla */
  selectSize(size: any) {
    if (!this.selectedProduct) return;
    this.selectedSize = size.talla;

    const variante = (this.productosService.cachedVariantes || []).find(
      (v: any) =>
        v.producto?.id_producto === this.selectedProduct?.id &&
        v.talla === size.talla
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
    } else {
      this.selectedVarianteId = null;
      this.selectedProduct.price = (this.selectedProduct as any).basePrice ?? 0;
      this.selectedProduct.oldPrice = (this.selectedProduct as any).baseOldPrice ?? 0;
      this.selectedProduct.descuento = (this.selectedProduct as any).baseDescuento ?? 0;
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

  // Métodos para favoritos
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
