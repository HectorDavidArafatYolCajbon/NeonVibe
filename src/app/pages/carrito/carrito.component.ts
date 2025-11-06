import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { AuthService } from 'src/app/services/auth.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardElement') cardContainer!: ElementRef;
  cartItems: any[] = [];
  total = 0;
  cliente = { nombre: '', email: '', telefono: '', direccion: '', nit: '' };
  loading = false;
  success = false;
  idVenta!: number;  // Para almacenar la ID de la venta generada
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

    // Auto-fill client form with logged-in user data
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.cliente.nombre = user.nombre || '';
        this.cliente.email = user.email || '';
        this.cliente.telefono = user.telefono || '';
        this.cliente.direccion = user.direccion || '';
        this.cliente.nit = user.nit || '';
      }
    });
  }

  ngAfterViewInit(): void {
    // Stripe will be initialized after creating the intent
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /** 🛍️ Actualiza el carrito y recalcula total */
  actualizarCarrito() {
    this.cartItems = this.cartService.getCart();
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.precio_final * item.cantidad,
      0
    );
  }

  /** ➕ Aumentar cantidad con validación de stock */
  aumentar(item: any) {
    const cart = this.cartService.getCart();
    const producto = cart.find(
      (p) => p.id_variante === item.id_variante && p.talla === item.talla
    );

    if (producto) {
      if (producto.cantidad >= producto.stock) {
        alert(`⚠️ Solo hay ${producto.stock} unidades disponibles de ${producto.name}.`);
        return;
      }
      producto.cantidad++;
      this.cartService.saveCart(cart);
      this.cartItems = cart;
      this.calcularTotal();
    }
  }

  /** ➖ Disminuir cantidad */
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

  /** 🗑️ Eliminar un producto del carrito */
  eliminar(item: any) {
    this.cartService.removeFromCart(item.id_variante);
    this.actualizarCarrito();
  }

  /** 🚮 Vaciar carrito */
  vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
      this.actualizarCarrito();
    }
  }

  /** 🛒 Continuar comprando */
  continuarComprando() {
    this.router.navigate(['/']);
  }

  /** 💳 Crear venta y inicializar Stripe */
  async crearVentaYInitStripe() {
    if (this.total <= 0) {
      alert('El carrito está vacío.');
      return;
    }

    // Validar datos del cliente
    if (!this.cliente.nombre || !this.cliente.email || !this.cliente.direccion) {
      alert('Por favor completa los datos del cliente.');
      return;
    }

    try {
      this.loading = true;

      // Buscar cliente existente por email
      let cliente = await this.clienteService.findClienteByEmailOrNIT({ email: this.cliente.email }).toPromise();

      // Si el cliente no existe, crearlo
      if (!cliente) {
        cliente = await this.clienteService.createCliente(this.cliente).toPromise();
      }

      const venta = await this.cartService.createVenta({
        canal: 'ONLINE',
        id_cliente: cliente.id_cliente,
        id_usuario: 1, // ⚙️ luego se enlazará al usuario logueado
        estado: 'PENDING',
      }).toPromise();

      this.idVenta = venta.id_venta; // Guardamos la ID de la venta

      // Crear PaymentIntent para Stripe
      const intentResponse = await this.cartService.createStripeIntent(this.idVenta, this.total).toPromise();
      this.clientSecret = intentResponse.client_secret;

      // Force change detection to render the #card-element in DOM
      this.cdr.detectChanges();

      // Inicializar Stripe
      await this.initStripe();
    } catch (error) {
      console.error('Error al crear venta o intent:', error);
      alert('Error al procesar la compra. Intenta de nuevo.');
    } finally {
      this.loading = false;
    }
  }

  /** 💳 Inicializar Stripe Elements */
  async initStripe() {
    if (!this.clientSecret || !this.cardContainer) return;

    try {
      this.stripe = await loadStripe('pk_test_51SLDSq4TacvuglmvFbknk13NCCL13kULx3HXXCgMsVPvxt9lZz8J8B7tvhiQhBBq4HqdJn7xrCXwrnsNmdLAVOBB00QfxhUe9U');
      this.elements = this.stripe.elements();

      // Create and mount card element to the ViewChild reference
      this.cardElement = this.elements.create('card');
      this.cardElement.mount(this.cardContainer.nativeElement);
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      alert('Error al inicializar el pago. Intenta de nuevo.');
    }
  }

  /** ✅ Finalizar compra con Stripe */
  async finalizarCompra() {
    if (!this.stripe || !this.cardElement) {
      alert('Error: El formulario de pago no está listo.');
      return;
    }

    try {
      this.loading = true;

      // Confirmar el pago con Stripe
      const result = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.cliente.nombre,
            email: this.cliente.email
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Si el pago fue exitoso, confirmar en nuestro backend
      await this.cartService.confirmStripePayment(result.paymentIntent.id).toPromise();

      // Crear los items de venta en el backend
      for (const item of this.cartItems) {
        await this.cartService.createVentaItem({
          id_venta: this.idVenta,
          id_variante: item.id_variante,
          cantidad: item.cantidad,
        }).toPromise();
      }

      // Limpiar el carrito y marcar la compra como exitosa
      this.cartService.clearCart();
      this.success = true;
      this.cartItems = [];
      this.total = 0;

      console.log('✅ Compra finalizada exitosamente');
      alert('✅ ¡Compra completada con éxito!');
    } catch (err) {
      console.error('❌ Error al finalizar compra:', err);
      alert(err instanceof Error ? err.message : '❌ Error al procesar la compra. Contacta soporte.');
    } finally {
      this.loading = false;
    }
  }
}
