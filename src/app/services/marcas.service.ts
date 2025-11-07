import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { Marca } from '../models/marca.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private apiUrl = `${environment.apiUrl}/api/marcas`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las marcas disponibles
   */
  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl).pipe(
      map((response: any[]) => {
        return response.map(item => ({
          id_marca: item.id_marca,
          nombre: item.nombre,
          imagen: item.imagen || null
        } as Marca));
      }),
      tap(marcas => console.log('Marcas cargadas:', marcas)),
      retry(3),
      catchError(this.handleError)
    );
  }

  // Obtener una marca por ID
  getMarcaById(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // Crear una nueva marca
  crearMarca(data: { nombre: string; imagen?: string }): Observable<Marca> {
    return this.http.post<Marca>(`${this.apiUrl}/create`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar una marca
  actualizarMarca(id: number, data: { nombre?: string; imagen?: string }): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/update/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una marca
  eliminarMarca(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del backend
      errorMessage = `Código de error: ${error.status}, ` +
                    `mensaje: ${error.error.message || error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
