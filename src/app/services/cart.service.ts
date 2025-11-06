import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiBase = 'https://proyectoropa-ijsq.onrender.com/api'; // ✅ tu backend Render
  private guestCartKey = 'guest_cart';
  private userCartKey = 'user_cart';

  constructor(private http: HttpClient) {}

  /** � Obtener la key correcta del carrito según el estado de login */
  private getCartKey(): string {
    const token = localStorage.getItem('auth_token');
    return token ? this.userCartKey : this.guestCartKey;
  }

  /** �🛒 Obtener carrito completo */
  getCart(): any[] {
    const stored = localStorage.getItem(this.getCartKey());
    return stored ? JSON.parse(stored) : [];
  }

  /** 💾 Guardar carrito */
  saveCart(cart: any[]): void {
    localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
  }

  /** 🧮 Calcular total */
  getTotal(): number {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.precio_final * item.cantidad, 0);
  }

  /** 🔄 Migrar carrito de invitado a usuario */
  migrateGuestCart(): void {
    const guestCart = localStorage.getItem(this.guestCartKey);
    if (guestCart) {
      localStorage.setItem(this.userCartKey, guestCart);
      localStorage.removeItem(this.guestCartKey);
    }
  }

  /** 🧹 Limpiar todos los carritos */
  clearAllCarts(): void {
    localStorage.removeItem(this.guestCartKey);
    localStorage.removeItem(this.userCartKey);
  }

  /** 🧩 Agregar producto al carrito con validación de stock */
  addToCart(product: any): void {
    const cart = this.getCart();
    const existing = cart.find(
      (p) => p.id_variante === product.id_variante && p.talla === product.talla
    );

    if (existing) {
      // Validar stock
      if (existing.cantidad >= (product.stock ?? 0)) {
        alert(`⚠️ Solo hay ${product.stock} unidades disponibles de ${product.name}.`);
        return;
      }
      existing.cantidad++;
    } else {
      // Validar stock inicial
      if (product.stock <= 0) {
        alert(`🚫 ${product.name} está agotado.`);
        return;
      }
      cart.push({ ...product, cantidad: 1 });
    }

    this.saveCart(cart);
  }

  /** ➖ Eliminar un producto del carrito */
  removeFromCart(id_variante: number): void {
    let cart = this.getCart();
    cart = cart.filter((p) => p.id_variante !== id_variante);
    this.saveCart(cart);
  }

  /** 🚮 Vaciar carrito actual */
  clearCart(): void {
    localStorage.removeItem(this.getCartKey());
  }

  /** 🔄 Devolver stock de productos */
  returnStock(cart: any[]): Observable<any> {
    // Crear un array de promesas para cada actualización de stock
    const promises = cart.map(item => {
      // Por cada producto en el carrito, incrementamos el stock en la cantidad que había
      return this.http.put(`${this.apiBase}/variantes/${item.id_variante}/stock`, {
        cantidad: item.cantidad // Cantidad a devolver al stock
      }).toPromise();
    });

    // Esperar a que todas las actualizaciones terminen
    return new Observable(observer => {
      Promise.all(promises)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // ================================
  // 🔹 API CONEXIÓN BACKEND (Render)
  // ================================

  /** Crear la venta en el backend */
  createVenta(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/ventas/create`, data);
  }

  /** Crear PaymentIntent para Stripe (backend -> /api/pagos/stripe/create-intent) */
  createStripeIntent(id_venta: number, total: number): Observable<any> {
    return this.http.post(`${this.apiBase}/pagos/stripe/create-payment-intent`, {
      id_venta: id_venta,
      amount: total.toFixed(2),
      currency: 'USD'
    });
  }

  /** Confirmar pago Stripe */
  confirmStripePayment(paymentIntent: string): Observable<any> {
    return this.http.post(`${this.apiBase}/pagos/stripe/confirm-payment`, {
      payment_intent_id: paymentIntent
    });
  }

  /** Crear item de venta */
  createVentaItem(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/venta-items/create`, data);
  }
}
