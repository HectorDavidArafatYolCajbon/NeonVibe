import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://proyectoropa-ijsq.onrender.com/api/variantes';

  // 🔹 Añadir cache local de variantes
  cachedVariantes: any[] = [];

  constructor(private http: HttpClient) {}

  getVariantes(): Observable<any[]> {
    return new Observable((observer) => {
      this.http.get<any[]>(this.apiUrl).subscribe({
        next: (data) => {
          this.cachedVariantes = data; // ✅ Guardamos variantes para usar en selectSize()
          observer.next(data);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}

