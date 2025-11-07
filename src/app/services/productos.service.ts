import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // 🌐 URL base del backend en Render
  private baseUrl = 'https://proyectoropa-ijsq.onrender.com/api';
  private apiUrl = `${this.baseUrl}/variantes`;
  private productosUrl = `${this.baseUrl}/productos`;

  // 🟢 Caché local de variantes
  private cachedVariantes: any[] = [];

  // ✅ Getter público para acceder a las variantes en caché
  get getCachedVariantes(): any[] {
    return this.cachedVariantes;
  }

  constructor(private http: HttpClient) {}

  /* =====================================================
     VARIANTES
  ===================================================== */
  // ✅ Obtener variantes y mantener caché local
  getVariantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data: any[]) => {
        this.cachedVariantes = data;
      })
    );
  }

  // ✅ Actualizar stock de una variante
  updateVarianteStock(id_variante: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id_variante}/stock`, { cantidad });
  }

  /* =====================================================
     PRODUCTOS
  ===================================================== */
  // ✅ Obtener todos los productos del backend
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.productosUrl);
  }

  // ✅ Obtener productos por marca
  getProductosByMarca(id_marca: number): Observable<any[]> {
    console.log('🔍 Buscando productos para marca:', id_marca);

    return this.getVariantes().pipe(
      map(variantes => {
        console.log('Todas las variantes recibidas:', variantes.length);

        const filtradas = variantes.filter(v => {
          if (!v.producto) {
            console.log('Variante sin producto:', v);
            return false;
          }

          // Verificar si el producto tiene marca y coincide el ID
          if (!v.producto.id_marca) {
            console.log('Producto sin marca:', v.producto);
            return false;
          }

          const productoMarcaId = parseInt(v.producto.id_marca);
          const coincide = productoMarcaId === id_marca;

          if (coincide) {
            console.log('✅ Encontrada coincidencia:', {
              varianteId: v.id_variante,
              productoNombre: v.producto.nombre,
              marcaId: productoMarcaId
            });
          }

          return coincide;
        });

        console.log('📦 Variantes filtradas por marca:', filtradas);
        return filtradas;
      })
    );
  }

  // ✅ Crear un nuevo producto
  crearProducto(producto: any): Observable<any> {
    return this.http.post(this.productosUrl, producto);
  }

  // ✅ Cambiar el estado (activar/desactivar)
  cambiarEstado(id_producto: number, activo: boolean): Observable<any> {
    // usamos PUT porque tu backend usa update con req.body
    return this.http.put(`${this.productosUrl}/${id_producto}`, { activo });
  }
}
