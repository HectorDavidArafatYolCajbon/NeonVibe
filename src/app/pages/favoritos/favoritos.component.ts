import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';

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
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscription = this.favoritesService.favorites.subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeFromFavorites(item: any): void {
    this.favoritesService.removeFromFavorites(item.id_variante, item.talla);
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item);
  }
}
