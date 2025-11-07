import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  // Usa el mismo host que AuthService
  private apiBase = 'https://proyectoropa-ijsq.onrender.com/api';
  private usuariosUrl = `${this.apiBase}/usuarios`;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || ''; // 👈 clave correcta
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /** Lista todos los usuarios (requiere admin) */
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usuariosUrl, { headers: this.headers() });
  }

  /** Crea usuario usando /register del backend */
  crearUsuario(data: {
    nombre: string; email: string; password: string; direccion?: string; id_rol: number;
  }): Observable<any> {
    return this.http.post(`${this.usuariosUrl}/register`, data, { headers: this.headers() });
  }

  /** Activar/Desactivar usuario (si tu backend ya expone PATCH /:id) */
  cambiarEstado(id_usuario: number, estado: boolean): Observable<any> {
    return this.http.patch(`${this.usuariosUrl}/${id_usuario}`, { estado }, { headers: this.headers() });
  }
}
