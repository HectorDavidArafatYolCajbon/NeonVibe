import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private baseUrl = environment.apiUrl + '/reportes';

  constructor(private http: HttpClient) {}

  ventasTotalesPorMes(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/ventas-mes`);
    return of([]); // placeholder
  }

  gananciasTotalesPorMes(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/ganancias-mes`);
    return of([]);
  }

  ventasDelDia(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/ventas-dia`);
    return of([]);
  }

  movimientosInventario(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/movimientos-inventario`);
    return of([]);
  }

  movimientosVentas(): Observable<any> {
    // return this.http.get(`${this.baseUrl}/movimientos-ventas`);
    return of([]);
  }
}
