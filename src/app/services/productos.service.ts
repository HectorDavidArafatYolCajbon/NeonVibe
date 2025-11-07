import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://proyectoropa-ijsq.onrender.com/api/variantes';

  // 🟢 Caché local de variantes
  private cachedVariantes: any[] = [];

  constructor(private http: HttpClient) {}

  // Getter público para acceder a las variantes cacheadas
  get getCachedVariantes(): any[] {
    return this.cachedVariantes;
  }

  // ✅ Método para obtener variantes con caché actualizada
  getVariantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data: any[]) => {
        this.cachedVariantes = data;
      })
    );
  }

  // ✅ Método para obtener productos con variantes
  getProductoVariante(): Observable<any[]> {
    return this.http.get<any[]>('https://proyectoropa-ijsq.onrender.com/api/variantes');
  }

  // Actualizar stock de una variante
  updateVarianteStock(id_variante: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id_variante}/stock`, { cantidad });
  }

  // Obtener productos por marca
  getProductosByMarca(id_marca: string): Observable<any[]> {
    return this.http.get<any[]>('https://proyectoropa-ijsq.onrender.com/api/variantes').pipe(
      tap((data: any[]) => {
        this.cachedVariantes = data;
      }),
      map((variantes: any[]) => {
        return variantes.filter((v: any) => {
          const marcaIdProducto = v.producto?.id_marca || 
                                v.producto?.marca?.id_marca ||
                                v.producto?.marca?.id;
          return String(marcaIdProducto) === String(id_marca);
        });
      })
    );
  }
}
