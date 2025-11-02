import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'https://proyectoropa-ijsq.onrender.com/api/variantes';

  constructor(private http: HttpClient) {}

  getVariantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
