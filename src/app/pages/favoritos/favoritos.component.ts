import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit, OnDestroy {
  favorites: any[] = [];
  private subscription!: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    // Suscripción a favoritos guardados
    this.subscription = this.favoritesService.favorites.subscribe(
      (favorites) => (this.favorites = favorites)
    );

    // ✅ Actualizar stock desde backend/local cache
    this.actualizarStockFavoritos();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  /** 🔁 Verifica y actualiza el stock de los productos en favoritos */
  actualizarStockFavoritos(): void {
    this.productosService.getVariantes().subscribe({
      next: (variantes) => {
        this.favorites = this.favorites.map((fav) => {
          const variante = variantes.find(
            (v: any) =>
              v.id_variante === fav.id_variante && v.talla === fav.talla
          );
          return {
            ...fav,
            stock: variante?.stock?.stock ?? 0
          };
        });
      },
      error: (err) => console.error('❌ Error al obtener variantes:', err)
    });
  }

  /** ❤️ Eliminar de favoritos */
  removeFromFavorites(item: any): void {
    this.favoritesService.removeFromFavorites(item.id_variante, item.talla);
    this.toastModal(`${item.name} eliminado de tus favoritos 💔`, 'info');
  }

  /** 🛒 Agregar al carrito */
  addToCart(item: any): void {
    if (!item.stock || item.stock <= 0) {
      this.toastModal('🚫 Este producto está agotado', 'error');
      return;
    }

    const currentCart = this.cartService.getCart();
    const existente = currentCart.find(
      (c: any) =>
        c.id_variante === item.id_variante && c.talla === item.talla
    );

    if (existente) {
      if (existente.cantidad >= item.stock) {
        this.toastModal(`Solo hay ${item.stock} unidades disponibles`, 'warning');
        return;
      }
      existente.cantidad++;
      this.cartService.saveCart(currentCart);
    } else {
      const nuevo = {
        id_variante: item.id_variante,
        name: item.name,
        talla: item.talla,
        image: item.image,
        precio_final: item.precio_final,
        oldPrice: item.oldPrice,
        descuento: item.descuento,
        cantidad: 1,
        stock: item.stock
      };
      this.cartService.addToCart(nuevo);
    }

    this.toastModal(`${item.name} agregado al carrito 🛍️`, 'success');
  }

  /** 🌑 Toast personalizado tipo NeonVibe */
  private toastModal(title: string, icon: 'success' | 'error' | 'info' | 'warning') {
    Swal.fire({
      icon,
      title,
      position: 'top',
      toast: true,
      background: '#000',
      color: '#fff',
      showConfirmButton: false,
      timer: 1800,
      backdrop: false,
      customClass: { popup: 'neon-toast-dark' }
    });
  }
}
