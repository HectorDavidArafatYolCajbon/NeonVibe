export interface Product {
  id?: number;
  name?: string;
  price?: number;
  oldPrice?: number;
  descuento?: number;
  description?: string;
  image?: string;
  images?: string[];
  color?: string;
  talla?: string;

  // 🔹 Para las tallas con stock
  sizes?: {
    talla: string;
    stock: number;
    descuento?: number;
    precio?: number;
  }[];

  // 🔹 Indicador de rango de precios (para mostrar “Desde Q...”)
  tieneRango?: boolean;

  // 🔹 Precios base (para restaurar cuando cambias talla)
  basePrice?: number;
  baseOldPrice?: number;
  baseDescuento?: number;
}
