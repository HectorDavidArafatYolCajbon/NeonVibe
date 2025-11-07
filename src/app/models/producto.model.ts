import { Marca } from './marca.model';
import { Categoria } from './categoria.model';

export type TipoMovimiento = 'IN' | 'OUT' | 'ADJUST';

export interface InventarioMovimiento {
  id_mov: number;
  id_variante: number;
  tipo: TipoMovimiento;
  cantidad: number;
  costo_unit?: number;
  motivo?: string;
  ref_tipo?: string;
  ref_id?: number;
  created_at: Date;

  // Relación con la variante
  variante?: ProductoVariante;
}

export interface InventarioStock {
  id_variante: number;
  stock: number;
  updated_at: Date;

  // Relación con la variante
  variante?: ProductoVariante;
}

export interface ProductoImagen {
  id_imagen: number;
  id_variante: number;
  url: string;
  orden: number;  // 1 = imagen principal

  // Relación con la variante
  variante?: ProductoVariante;
}

export interface ProductoVariante {
  id_variante: number;
  id_producto: number;
  sku: string;
  barcode: string;
  modelo: string;
  color?: string;
  talla?: string;
  precio_venta: number;
  precio_costo: number;
  descuento: number;
  imagen_url?: string;
  activo: boolean;
  precio_final?: number; // Campo virtual calculado

  // Relaciones
  producto?: Producto;
  stock?: InventarioStock;
  imagenes?: ProductoImagen[];
}

export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  id_marca: number;
  id_categoria: number;
  genero?: 'HOMBRE' | 'MUJER';

  // Relaciones
  marca?: Marca;
  categoria?: Categoria;
  variantes?: ProductoVariante[];

  // Campos auxiliares para UI
  image?: string;        // Imagen principal para mostrar
  images?: string[];     // Todas las imágenes del producto
  tieneRango?: boolean;  // Indica si hay variación de precios entre variantes
  precioBase?: number;   // Precio más bajo entre todas las variantes
}
