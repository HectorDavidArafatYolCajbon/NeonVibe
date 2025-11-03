export interface Product {
  id?: number;
  name?: string;
  price?: number;
  oldPrice?: number;
  image?: string;
  description?: string;
  images?: string[];
  sizes?: any[];
  descuento?: number;
  color?: string;
  talla?: string;

  // 🟢 Propiedades adicionales
  basePrice?: number;
  baseOldPrice?: number;
  baseDescuento?: number;

  // 🔹 Nueva propiedad para mostrar "Desde Q..."
  tieneRango?: boolean;
}
