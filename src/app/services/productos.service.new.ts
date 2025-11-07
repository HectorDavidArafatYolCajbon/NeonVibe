import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Product, Variante } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private baseUrl = 'https://proyectoropa-ijsq.onrender.com/api';
  private variantesUrl = `${this.baseUrl}/variantes`;
  private productosUrl = `${this.baseUrl}/productos`;

  // Caché local de variantes
  private cachedVariantes: Variante[] = [];

  constructor(private http: HttpClient) {}

  // Obtener todos los productos con sus variantes
  getProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productosUrl).pipe(
      map(productos => productos.map(producto => ({
        ...producto,
        tieneRango: this.calcularRangoPrecios(producto),
        precioMinimo: this.obtenerPrecioMinimo(producto),
        precioMaximo: this.obtenerPrecioMaximo(producto)
      })))
    );
  }

  // Obtener variantes con caché actualizada
  getVariantes(): Observable<Variante[]> {
    return this.http.get<Variante[]>(this.variantesUrl).pipe(
      tap(variantes => {
        this.cachedVariantes = variantes;
      })
    );
  }

  // Actualizar stock de una variante
  updateVarianteStock(id_variante: string, cantidad: number): Observable<any> {
    return this.http.put(`${this.variantesUrl}/${id_variante}/stock`, { cantidad });
  }

  // Métodos privados para cálculos de precios
  private calcularRangoPrecios(producto: Product): boolean {
    if (!producto.variantes || producto.variantes.length === 0) return false;
    const precios = producto.variantes.map(v => v.precio_final);
    return Math.min(...precios) !== Math.max(...precios);
  }

  private obtenerPrecioMinimo(producto: Product): number {
    if (!producto.variantes || producto.variantes.length === 0) return 0;
    return Math.min(...producto.variantes.map(v => v.precio_final));
  }

  private obtenerPrecioMaximo(producto: Product): number {
    if (!producto.variantes || producto.variantes.length === 0) return 0;
    return Math.max(...producto.variantes.map(v => v.precio_final));
  }
}
