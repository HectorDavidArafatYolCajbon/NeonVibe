import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardElement') cardContainer!: ElementRef;

  cartItems: any[] = [];
  total = 0;
  cliente = { nombre: '', email: '', telefono: '', direccion: '', nit: '' };
  loading = false;
  success = false;
  idVenta!: number;
  clientSecret!: string;
  stripe: any;
  elements: any;
  cardElement: any;
  private authSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.actualizarCarrito();

    const pending = localStorage.getItem('pending_checkout');
    if (pending) {
      const data = JSON.parse(pending);
      this.cliente = data.cliente || this.cliente;

      const restoredCart: any[] = data.cart || [];
      if (restoredCart.length > 0) {
        const currentCart = this.cartService.getCart();
        const merged = [
          ...currentCart,
          ...restoredCart.filter(
            (rc: any) =>
              !currentCart.some(
                (cc: any) =>
                  cc.id_variante === rc.id_variante && cc.talla === rc.talla
              )
          )
        ];
        this.cartService.saveCart(merged);
        this.cartItems = merged;
        this.calcularTotal();
      }

      localStorage.removeItem('pending_checkout');
    }

    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.cliente.nombre = user.nombre || '';
        this.cliente.email = user.email || '';
        this.cliente.telefono = user.telefono || '';
        this.cliente.direccion = user.direccion || '';
        this.cliente.nit = user.nit || '';
      }
    });
  }

  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
  }

  // =========================
  // 🧮 Carrito
  // =========================
  actualizarCarrito() {
    const raw = this.cartService.getCart();
    this.cartItems = raw.map((item: any) => {
      item.precio_final = parseFloat(item.precio_final) || 0;
      item.descuento = parseFloat(item.descuento) || 0;

      if (item.descuento > 0 && (item.oldPrice === undefined || item.oldPrice === null)) {
        const factor = 1 - item.descuento / 100;
        item.oldPrice = factor > 0 ? parseFloat((item.precio_final / factor).toFixed(2)) : item.precio_final;
      }

      return item;
    });
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.precio_final * item.cantidad,
      0
    );
  }

  aumentar(item: any) {
    const cart = this.cartService.getCart();
    const producto = cart.find(
      (p) => p.id_variante === item.id_variante && p.talla === item.talla
    );
    if (producto) {
      if (producto.cantidad >= producto.stock) {
        this.alertNeon('Stock insuficiente', `Solo hay ${producto.stock} unidades disponibles.`, 'warning');
        return;
      }
      producto.cantidad++;
      this.cartService.saveCart(cart);
      this.cartItems = cart;
      this.calcularTotal();
    }
  }

  disminuir(item: any) {
    const cart = this.cartService.getCart();
    const producto = cart.find(
      (p) => p.id_variante === item.id_variante && p.talla === item.talla
    );
    if (producto && producto.cantidad > 1) {
      producto.cantidad--;
      this.cartService.saveCart(cart);
      this.cartItems = cart;
      this.calcularTotal();
    }
  }

  eliminar(item: any) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Deseas quitar "${item.name}" del carrito?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1b0034',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-confirm-btn',
        cancelButton: 'neon-cancel-btn'
      }
    }).then((res) => {
      if (res.isConfirmed) {
        this.cartService.removeFromCart(item.id_variante);
        this.actualizarCarrito();
        this.alertNeon('Producto eliminado', 'Se quitó del carrito 🗑️', 'success');
      }
    });
  }

  vaciarCarrito() {
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      background: '#1b0034',
      color: '#fff',
      customClass: {
        popup: 'neon-popup',
        confirmButton: 'neon-confirm-btn',
        cancelButton: 'neon-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        this.actualizarCarrito();
        this.alertNeon('Carrito vacío', 'Todos los productos fueron eliminados.', 'success');
      }
    });
  }

  continuarComprando() {
    this.router.navigate(['/']);
  }

  // =========================
  // 💳 Pago
  // =========================
  async crearVentaYInitStripe() {
    if (this.total <= 0) {
      this.alertNeon('Carrito vacío', 'Agrega productos antes de continuar.', 'info');
      return;
    }

    if (!this.cliente.nombre || !this.cliente.email || !this.cliente.direccion) {
      this.alertNeon('Campos incompletos', 'Por favor completa los datos del cliente.', 'warning');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      localStorage.setItem(
        'pending_checkout',
        JSON.stringify({
          cliente: this.cliente,
          cart: this.cartService.getCart()
        })
      );

      await Swal.fire({
        title: '🔐 ¡Inicia sesión para continuar!',
        html: `<p style="font-size: 16px; color: #eee; margin-top: 8px;">
          Para finalizar tu compra, por favor inicia sesión con tu cuenta NeonVibe.
        </p>`,
        background: '#1b0034',
        color: '#fff',
        icon: 'info',
        iconColor: '#fff',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'neon-popup',
          confirmButton: 'neon-confirm-btn',
          cancelButton: 'neon-cancel-btn'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login'], { queryParams: { redirectTo: '/carrito' } });
        }
      });
      return;
    }

    try {
      this.loading = true;

      // Loader simple
      Swal.fire({
        title: 'Procesando tu pago...',
        html: `
          <div class="simple-loader"></div>
          <p style="margin-top: 15px; font-weight: 500; color: #fff;">Conectando con Stripe</p>
        `,
        background: '#1b0034',
        color: '#fff',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: { popup: 'neon-popup' }
      });

      // Buscar o crear cliente
      let cliente = await this.clienteService.findClienteByEmailOrNIT({ email: this.cliente.email }).toPromise();
      if (!cliente) cliente = await this.clienteService.createCliente(this.cliente).toPromise();

      const usuario = this.authService.getCurrentUser();
      const venta = await this.cartService.createVenta({
        canal: 'ONLINE',
        id_cliente: cliente.id_cliente,
        id_usuario: usuario.id_usuario,
        estado: 'PENDING'
      }).toPromise();

      this.idVenta = venta.id_venta;
      const intentResponse = await this.cartService.createStripeIntent(this.idVenta, this.total).toPromise();
      this.clientSecret = intentResponse.client_secret;

      this.cdr.detectChanges();
      await this.initStripe();

      Swal.close();
      this.alertNeon('✨ ¡Listo!', 'Puedes ingresar los datos de tu tarjeta.', 'success');
    } catch (error) {
      console.error('Error al crear venta o intent:', error);
      Swal.close();
      this.alertNeon('Error', 'Ocurrió un problema al procesar la compra.', 'error');
    } finally {
      this.loading = false;
    }
  }

  async initStripe() {
    if (!this.clientSecret || !this.cardContainer) return;
    try {
      this.stripe = await loadStripe('pk_test_51SLDSq4TacvuglmvFbknk13NCCL13kULx3HXXCgMsVPvxt9lZz8J8B7tvhiQhBBq4HqdJn7xrCXwrnsNmdLAVOBB00QfxhUe9U');
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount(this.cardContainer.nativeElement);
    } catch {
      this.alertNeon('Error', 'No se pudo inicializar el pago.', 'error');
    }
  }

  async finalizarCompra() {
    if (!this.stripe || !this.cardElement) {
      this.alertNeon('Error', 'El formulario de pago no está listo.', 'error');
      return;
    }

    try {
      this.loading = true;
      const result = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.cliente.nombre,
            email: this.cliente.email
          }
        }
      });

      if (result.error) throw new Error(result.error.message);

      await this.cartService.confirmStripePayment(result.paymentIntent.id).toPromise();

      for (const item of this.cartItems) {
        await this.cartService.createVentaItem({
          id_venta: this.idVenta,
          id_variante: item.id_variante,
          cantidad: item.cantidad
        }).toPromise();
      }

      // ✅ Limpiar y mostrar la vista de éxito (NO navegar)
      this.cartService.clearCart();
      this.cartItems = [];
      this.total = 0;
      this.success = true;

      // Mensaje corto (sin navegar)
      this.alertNeon('✅ ¡Compra completada!', 'Tu pago fue procesado con éxito.', 'success');
    } catch (err: any) {
      this.alertNeon('Error', err?.message || 'Error al procesar la compra.', 'error');
    } finally {
      this.loading = false;
    }
  }

  // =========================
  // 💜 Alertas
  // =========================
  private alertNeon(title: string, text: string, icon: 'success' | 'error' | 'info' | 'warning') {
    Swal.fire({
      title,
      text,
      icon,
      background: '#1b0034',
      color: '#fff',
      iconColor: '#fff',
      confirmButtonText: 'Aceptar',
      customClass: { popup: 'neon-popup', confirmButton: 'neon-confirm-btn' }
    });
  }
}
