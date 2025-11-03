import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-camisas',
  templateUrl: './camisas.component.html',
  styleUrls: ['./camisas.component.scss']
})
export class CamisasComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  activeImage: string = '';
  selectedSize: string = '';
  loading = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarCamisas();
  }

  cargarCamisas(): void {
    this.loading = true;
    this.productosService.getVariantes().subscribe({
      next: (data) => {
        // 🔹 Filtramos solo las variantes de tipo "camisa"
        const camisas = data.filter(
          (v: any) =>
            v.producto?.nombre?.toLowerCase().includes('camisa') ||
            v.modelo?.toLowerCase().includes('camisa')
        );

        // 🔹 Adaptamos el formato para el frontend
        this.products = camisas.map((v: any) => {
          // Unificamos todas las imágenes (la principal + las extra)
          const allImages = [
            v.imagen_url, // Imagen principal
            ...(v.imagenes?.map((img: any) => img.url) || [])
          ].filter(Boolean); // elimina null o undefined

          return {
            id: v.id_variante,
            name: v.modelo || v.producto?.nombre || 'Sin nombre',
            price: parseFloat(v.precio_final ?? v.precio_venta ?? 0),
            oldPrice: parseFloat(v.precio_venta ?? 0),
            image: allImages[0] || 'https://via.placeholder.com/400x400?text=Sin+Imagen',
            description: v.producto?.descripcion || 'Sin descripción disponible',
            images: allImages,
            sizes: [v.talla || 'Única'],
            descuento: parseFloat(v.descuento ?? 0),
            precio_final: parseFloat(v.precio_final ?? v.precio_venta ?? 0),
            color: v.color,
            talla: v.talla
          };
        });

        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error al cargar camisas:', err);
        this.loading = false;
      }
    });
  }

  // 🔹 Métodos del modal
  openModal(product: Product) {
    this.selectedProduct = product;
    this.activeImage = product.images?.[0] || ''; // siempre abre con la imagen principal
  }

  closeModal() {
    this.selectedProduct = null;
  }

  nextImage() {
    if (!this.selectedProduct?.images) return;
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[(idx + 1) % this.selectedProduct.images.length];
  }

  prevImage() {
    if (!this.selectedProduct?.images) return;
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[
        (idx - 1 + this.selectedProduct.images.length) % this.selectedProduct.images.length
      ];
  }
}
