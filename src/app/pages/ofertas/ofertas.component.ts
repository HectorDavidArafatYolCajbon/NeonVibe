import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.scss']
})
export class OfertasComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  private userSubscription!: Subscription;
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  selectedVarianteId: number | null = null;
  loading = true;

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  /** 🔥 Cargar productos en oferta */
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

          const imgs: string[] = [];
          const agregarImagen = (url: string | undefined) => {
            if (url && url.trim() !== '' && !url.includes('Sin+Imagen')) imgs.push(url);
          };

          agregarImagen(v.imagen_url);
          v.imagenes?.forEach((i: any) => agregarImagen(i?.url));
          v.producto?.imagenes?.forEach((i: any) => agregarImagen(i?.url));

          imgs.forEach((img) => {
            if (!agrupadas[idProducto].images.includes(img)) {
              agrupadas[idProducto].images.push(img);
            }
          });

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

        const ofertas = Object.values(agrupadas).filter(
          (p: any) => p.descuentos.some((d: number) => d > 0)
        );

        this.products = ofertas.map((p: any) => {
          const maxDesc = Math.max(...p.descuentos);
          const precioNormal = Math.max(...p.preciosVenta);
          let precioConDescuento = Math.max(...p.preciosFinales);

          if (!precioConDescuento || precioConDescuento === precioNormal) {
            precioConDescuento = parseFloat(
              (precioNormal * (1 - maxDesc / 100)).toFixed(2)
            );
          }

          const imagenesValidas = (p.images || []).filter(
            (img: string) => img && !img.includes('Sin+Imagen')
          );
          const primeraImagen =
            imagenesValidas[0] ||
            'https://via.placeholder.com/400x400?text=Sin+Imagen';

          return {
            ...p,
            image: primeraImagen,
            images: imagenesValidas.length ? imagenesValidas : [primeraImagen],
            descuento: maxDesc,
            price: precioConDescuento,
            oldPrice: precioNormal
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
  // 🔹 Modal
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
    this.selectedSize = '';
    this.selectedVarianteId = null;
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

  selectSize(size: any) {
  if (!this.selectedProduct) return;

  // ✅ Guardar talla y resetear variante
  this.selectedSize = size.talla || '';
  this.selectedVarianteId = null;

  const basePrice = (this.selectedProduct as any).basePrice ?? 0;
  const baseOld = (this.selectedProduct as any).baseOldPrice ?? 0;
  const baseDesc = (this.selectedProduct as any).baseDescuento ?? 0;

  // ✅ Buscar variante exacta por talla
  const variante = (this.productosService.cachedVariantes || []).find(
    (v: any) =>
      v.producto?.id_producto === this.selectedProduct?.id &&
      (v.talla || 'Única') === size.talla
  );

  if (variante) {
    this.selectedVarianteId = variante.id_variante; // 💡 activa el botón

    const pv = parseFloat(variante.precio_venta ?? baseOld);
    const desc = parseFloat(variante.descuento ?? baseDesc);
    let pf = parseFloat(variante.precio_final ?? '0');

    if (!desc || desc <= 0) {
      this.selectedProduct.price = pv;
      this.selectedProduct.oldPrice = 0;
      this.selectedProduct.descuento = 0;
    } else {
      if (!pf || pf === pv) pf = parseFloat((pv * (1 - desc / 100)).toFixed(2));
      this.selectedProduct.price = pf;
      this.selectedProduct.oldPrice = pv;
      this.selectedProduct.descuento = desc;
    }

    // ✅ Forzar refresco para que Angular reactive el botón
    setTimeout(() => {}, 0);
  } else {
    // Si no hay variante, volver a valores base y bloquear el botón
    this.selectedProduct.price = basePrice;
    this.selectedProduct.oldPrice = baseOld;
    this.selectedProduct.descuento = baseDesc;
    this.selectedVarianteId = null;
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

    if (!selectedSizeData) {
      this.toastModal('Error: talla no encontrada', 'error');
      return;
    }

    const stockDisponible = selectedSizeData.stock ?? 0;
    if (stockDisponible <= 0) {
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
      if (existing.cantidad >= stockDisponible) {
        this.toastModal(`Solo hay ${stockDisponible} unidades disponibles`, 'info');
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

    this.toastModal(`${this.selectedProduct.name} Agregar al Carrito 🛍️`, 'success');
    this.closeModal();
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
