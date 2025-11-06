import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  public favorites = this.favoritesSubject.asObservable();

  constructor(private authService: AuthService) {
    // Suscribirse a cambios de usuario autenticado
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.loadFavorites(user);
        this.migrateGuestToUser(user);
      } else {
        this.loadFavorites(null);
      }
    });
  }

  // 🔑 Generar clave de almacenamiento
  private getKey(user: any): string {
    if (!user || !user.id_usuario) {
      return 'guest_favorites';
    }
    return `user_favorites_${user.id_usuario}`;
  }

  // 🧩 Obtener favoritos desde localStorage
  private getFavorites(user: any): any[] {
    const key = this.getKey(user);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  // 💾 Guardar favoritos
  private saveFavorites(favorites: any[], user: any): void {
    const key = this.getKey(user);
    localStorage.setItem(key, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  // 🔁 Cargar favoritos al iniciar sesión o refrescar
  private loadFavorites(user: any): void {
    const favorites = this.getFavorites(user);
    this.favoritesSubject.next(favorites);
  }

  // ❤️ Agregar a favoritos
  addToFavorites(product: any): void {
    const user = this.authService.getCurrentUser();
    const keyUser = user || null;

    let favorites = this.getFavorites(keyUser);
    const exists = favorites.some(
      (f) => f.id_variante === product.id_variante && f.talla === product.talla
    );

    if (!exists) {
      favorites.push({
        id_variante: product.id_variante,
        talla: product.talla,
        name: product.name,
        image: product.image,
        precio_final: product.precio_final
      });
      this.saveFavorites(favorites, keyUser);
    }
  }

  // 💔 Quitar de favoritos
  removeFromFavorites(id_variante: number, talla?: string): void {
    const user = this.authService.getCurrentUser();
    const keyUser = user || null;

    let favorites = this.getFavorites(keyUser);
    favorites = favorites.filter(
      (f) => !(f.id_variante === id_variante && (!talla || f.talla === talla))
    );

    this.saveFavorites(favorites, keyUser);
  }

  // 🔍 Verificar si un producto está en favoritos
  isInFavorites(id_variante: number, talla?: string): boolean {
    const user = this.authService.getCurrentUser();
    const keyUser = user || null;

    return this.getFavorites(keyUser).some(
      (f) => f.id_variante === id_variante && (!talla || f.talla === talla)
    );
  }

  // 🔄 Migrar favoritos de invitado → usuario
  private migrateGuestToUser(user: any): void {
    const guestKey = this.getKey(null);
    const userKey = this.getKey(user);
    const guestData = localStorage.getItem(guestKey);

    if (guestData) {
      const guestFavs = JSON.parse(guestData);
      const userFavs = this.getFavorites(user);

      // Combinar evitando duplicados
      const merged = [
        ...userFavs,
        ...guestFavs.filter(
          (g: any) =>
            !userFavs.some(
              (u: any) =>
                u.id_variante === g.id_variante && u.talla === g.talla
            )
        )
      ];

      localStorage.setItem(userKey, JSON.stringify(merged));
      localStorage.removeItem(guestKey);
      this.favoritesSubject.next(merged);
    }
  }

  // 🧹 Limpiar todos los favoritos del usuario actual
  clearAllFavorites(): void {
    const user = this.authService.getCurrentUser();
    const key = this.getKey(user);
    localStorage.removeItem(key);
    this.loadFavorites(user);
  }
}
