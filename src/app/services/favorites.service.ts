import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private guestFavKey = 'guest_favorites';
  private userFavKey = 'user_favorites';
  private favoritesSubject = new BehaviorSubject<any[]>(this.getFavorites());
  public favorites = this.favoritesSubject.asObservable();

  constructor(private authService: AuthService) {
    // Suscribirse a cambios de usuario para manejar migración de favoritos
    this.authService.currentUser.subscribe(user => {
      if (user) {
        // Si hay login, migrar favoritos de invitado
        this.migrateGuestFavorites();
      }
    });
  }

  private getFavKey(): string {
    return this.authService.isLoggedIn() ? this.userFavKey : this.guestFavKey;
  }

  /** Obtener lista de favoritos */
  getFavorites(): any[] {
    const stored = localStorage.getItem(this.getFavKey());
    return stored ? JSON.parse(stored) : [];
  }

  /** Guardar lista de favoritos */
  private saveFavorites(favorites: any[]): void {
    localStorage.setItem(this.getFavKey(), JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  /** Agregar a favoritos */
  addToFavorites(product: any): void {
    const favorites = this.getFavorites();
    // Verificar si ya existe
    const exists = favorites.some(f =>
      f.id_variante === product.id_variante && f.talla === product.talla
    );

    if (!exists) {
      favorites.push({
        id_variante: product.id_variante,
        talla: product.talla,
        name: product.name,
        image: product.image,
        precio_final: product.precio_final
      });
      this.saveFavorites(favorites);
    }
  }

  /** Quitar de favoritos */
  removeFromFavorites(id_variante: number, talla?: string): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(f =>
      !(f.id_variante === id_variante && (!talla || f.talla === talla))
    );
    this.saveFavorites(favorites);
  }

  /** Verificar si un producto está en favoritos */
  isInFavorites(id_variante: number, talla?: string): boolean {
    return this.getFavorites().some(f =>
      f.id_variante === id_variante && (!talla || f.talla === talla)
    );
  }

  /** Migrar favoritos de invitado a usuario */
  private migrateGuestFavorites(): void {
    const guestFavorites = localStorage.getItem(this.guestFavKey);
    if (guestFavorites) {
      localStorage.setItem(this.userFavKey, guestFavorites);
      localStorage.removeItem(this.guestFavKey);
      this.favoritesSubject.next(JSON.parse(guestFavorites));
    }
  }

  /** Limpiar todos los favoritos */
  clearAllFavorites(): void {
    localStorage.removeItem(this.guestFavKey);
    localStorage.removeItem(this.userFavKey);
    this.favoritesSubject.next([]);
  }
}
