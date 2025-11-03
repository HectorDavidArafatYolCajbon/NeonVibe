export interface Product {
  id?: number;                // ID de la variante o producto
  name: string;               // Nombre del producto o modelo
  price: number;              // Precio actual (con descuento aplicado si lo hay)
  oldPrice?: number;          // Precio original antes del descuento
  image: string;              // Imagen principal
  description?: string;       // Descripción del producto
  images?: string[];          // Galería de imágenes
  sizes?: string[];           // Tallas disponibles
  color?: string;             // Color de la variante
  talla?: string;             // Talla específica
  descuento?: number;         // Descuento en porcentaje
  precio_final?: number;      // Precio calculado con el descuento
}
