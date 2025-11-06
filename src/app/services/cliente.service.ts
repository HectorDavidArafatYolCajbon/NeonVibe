import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private baseUrl = 'https://proyectoropa-ijsq.onrender.com/api/clientes'; // URL base para tu backend

  constructor(private http: HttpClient) {}

  /** Crear un nuevo cliente */
  createCliente(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  /** Obtener todos los clientes */
  getClientes(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  /** Obtener cliente por ID */
  getClienteById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  /** Buscar cliente por email o NIT (nuevo método) */
  findClienteByEmailOrNIT(cliente: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/find-by-email-or-nit`, cliente);
  }

  /** Obtener cliente por ID de usuario (para auth) */
  getClienteByUser(id_usuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${id_usuario}`);
  }

  /** Actualizar cliente */
  updateCliente(id_cliente: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id_cliente}`, data);
  }
}
