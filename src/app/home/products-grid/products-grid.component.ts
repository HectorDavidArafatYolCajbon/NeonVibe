import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  color?: string;
  talla?: string;
  descuento?: number;
  precio_final?: number;
}

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.component.html',
  styleUrls: ['./products-grid.component.scss']
})
export class ProductsGridComponent implements OnInit {
  title = 'Nuevos Productos';
  products: Product[] = [];
  loading = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productosService.getVariantes(true).subscribe({
      next: (data) => {
        this.products = data.map((p: any) => ({
          id: p.id_variante,
          name: p.producto?.nombre || p.modelo || 'Producto sin nombre',
          image: p.imagen_url || p.imagenes?.[0]?.url || 'assets/no-image.jpg',
          price: parseFloat(p.precio_final ?? p.precio_venta ?? 0),
          oldPrice: parseFloat(p.precio_venta ?? 0),
          color: p.color,
          talla: p.talla,
          descuento: parseFloat(p.descuento ?? 0),
          precio_final: parseFloat(p.precio_final ?? p.precio_venta ?? 0)
        }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar productos:', err);
        this.loading = false;
      }
    });
  }
}
