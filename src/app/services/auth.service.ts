import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBase = 'https://proyectoropa-ijsq.onrender.com/api'; // Same as cart service
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUserFromStorage());
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  /** 🔐 Login - POST /api/usuarios/login */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBase}/usuarios/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Respuesta del login:', response); // Para debugging

        // Verificar el estado del usuario
        if (response.estado === false) {
          throw new Error('CUENTA_DESACTIVADA');
        }

        // Solo guardar token si la cuenta está activa
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }

        // Migrar carrito de invitado si existe
        this.cartService.migrateGuestCart();

        let userStored = false;
        if (response.user) {
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          userStored = true;
        } else if (response.id_usuario) {
          // Assume response is user object
          localStorage.setItem(this.userKey, JSON.stringify(response));
          this.currentUserSubject.next(response);
          userStored = true;
        }
        // If no user stored, auto-fetch with validateToken
        if (!userStored) {
          this.validateToken().subscribe({
            next: (user) => {
              if (user) {
                localStorage.setItem(this.userKey, JSON.stringify(user));
                this.currentUserSubject.next(user);
              }
            },
            error: (err) => {
              console.error('Auto-fetch user failed:', err);
            }
          });
        }
      })
    );
  }

  /** 📝 Register - POST /api/usuarios/register */
  register(nombre: string, email: string, password: string, direccion: string, id_rol: number = 2): Observable<any> {
    return this.http.post(`${this.apiBase}/usuarios/register`, { nombre, email, password, direccion, id_rol }).pipe(
      tap((response: any) => {
        // Opcional: Auto-login después de register
        if (response.id) {
          console.log('Usuario registrado, ID:', response.id);
        }
        if (response.token && response.user) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        } else if (response.id_usuario) {
          localStorage.setItem(this.userKey, JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  /** 🚪 Logout - Clear localStorage and return stock */
  logout(): Observable<boolean> {
    return new Observable(observer => {
      // Get cart before clearing
      const cart = this.cartService.getCart();

      // Si hay productos en el carrito, devolver el stock
      if (cart && cart.length > 0) {
        this.cartService.returnStock(cart).subscribe({
          next: () => {
            console.log('✅ Stock devuelto exitosamente');
            this.clearSessionAndCart();
            observer.next(true);
            observer.complete();
          },
          error: (error: any) => {
            console.error('❌ Error al devolver stock:', error);
            // Aún así limpiamos la sesión y carrito en caso de error
            this.clearSessionAndCart();
            observer.next(true);
            observer.complete();
          }
        });
      } else {
        // Si no hay productos, solo limpiar sesión
        this.clearSessionAndCart();
        observer.next(true);
        observer.complete();
      }
    });
  }

  private clearSessionAndCart(): void {
    // Limpiar ambos carritos
    this.cartService.clearAllCarts();

    // Limpiar sesión
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  /** ✅ Check if logged in */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /** 👤 Get current user from localStorage */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  private getCurrentUserFromStorage(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /** 🔍 Validate token and fetch user if needed */
  validateToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.log('No token found for validateToken');
      return new Observable(); // Empty observable
    }
    console.log('Calling /me with token:', token.substring(0, 20) + '...'); // Log partial token for security
    return this.http.get(`${this.apiBase}/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap((user: any) => {
        console.log('Fetched user from /me:', user);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError((err: any) => {
        console.log('/me error status:', err.status, 'message:', err.error);
        return throwError(() => err);
      })
    );
  }

  /** 🔑 Get token */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
