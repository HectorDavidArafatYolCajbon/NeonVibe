import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioData {
  nombre: string;
  email: string;
  password?: string;
  telefono?: string;
  nit?: string;
  direccion?: string;
  id_rol: number;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiBase = 'https://proyectoropa-ijsq.onrender.com/api';
  private usuariosUrl = `${this.apiBase}/usuarios`;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /** Obtener lista de usuarios */
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usuariosUrl, { headers: this.headers() });
  }

  /** Obtener usuario por ID */
  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.usuariosUrl}/${id}`, { headers: this.headers() });
  }

  /** Crear nuevo usuario */
  crearUsuario(data: UsuarioData): Observable<any> {
    return this.http.post(`${this.usuariosUrl}/register`, data, { headers: this.headers() });
  }

  /** Actualizar usuario existente */
  actualizarUsuario(id: number, data: Partial<UsuarioData>): Observable<any> {
    return this.http.put(`${this.usuariosUrl}/${id}`, data, { headers: this.headers() });
  }

  /** Cambiar estado de usuario */
  cambiarEstado(id: number, estado: boolean): Observable<any> {
    return this.http.patch(`${this.usuariosUrl}/${id}`, { estado }, { headers: this.headers() });
  }
}
