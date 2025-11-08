import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private baseUrl = environment.apiUrl + '/api/reportes';

  constructor(private http: HttpClient) {}

  ventasTotalesPorMes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ventas-mes`);
  }

  gananciasTotalesPorMes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ganancias-mes`);
  }

  // Llamada real al backend para ventas del día
  ventasDelDia(fecha: string, tz: string): Observable<any> {
    const params = new HttpParams().set('fecha', fecha).set('tz', tz);
    return this.http.get(`${this.baseUrl}/ventas-dia`, { params });
  }

  movimientosInventario(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get(`${environment.apiUrl}/api/inventario/mov`, { params });
  }

  movimientosVentas(fechaInicio: string, fechaFin: string): Observable<any> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get(`${this.baseUrl}/movimientos-ventas`, { params });
  }
}
