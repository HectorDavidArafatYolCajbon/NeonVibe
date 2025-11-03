import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'https://proyectoropa-ijsq.onrender.com/api/variantes';

  // 🟢 Caché de variantes
  cachedVariantes: any[] = [];

  constructor(private http: HttpClient) {}

  // ✅ Método único y corregido
  getVariantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data: any[]) => {
        this.cachedVariantes = data; // guarda todas las variantes localmente
      })
    );
  }
}
