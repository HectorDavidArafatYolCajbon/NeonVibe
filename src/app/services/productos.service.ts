import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://proyectoropa-ijsq.onrender.com/api/variantes';

  // 🟢 Caché local de variantes
  cachedVariantes: any[] = [];

  constructor(private http: HttpClient) {}

  // ✅ Método para obtener variantes con caché actualizada
  getVariantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data: any[]) => {
        // ✅ Guardamos variantes localmente para poder usarlas en selectSize()
        this.cachedVariantes = data;
      })
    );
  }
}
