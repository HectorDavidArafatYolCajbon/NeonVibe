import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';

export interface Marca {
  id_marca: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  categorias: string[];
  destacada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private apiUrl = 'https://proyectoropa-ijsq.onrender.com/api/marcas';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las marcas disponibles
   */
  getMarcas(): Observable<Marca[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        map(marcas => {
          return marcas.map(marca => ({
            ...marca,
            // Si no hay categorías, asignamos un array con 'General'
            categorias: Array.isArray(marca.categorias) ? marca.categorias : ['General'],
            // Aseguramos que el id_marca sea string
            id_marca: marca.id_marca.toString(),
            // Valores por defecto para campos opcionales
            descripcion: marca.descripcion || `Productos ${marca.nombre}`,
            destacada: !!marca.destacada
          }));
        }),
        tap((marcas: Marca[]) => {
          console.log('Marcas procesadas:', marcas);
        }),
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene una marca específica por su ID
   */
  getMarcaById(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene marcas filtradas por categoría
   */
  getMarcasByCategoria(categoria: string): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/categoria/${categoria}`)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * Manejo centralizado de errores HTTP
   */
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
