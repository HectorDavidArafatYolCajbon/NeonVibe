export interface Categoria {
  id_categoria: number;
  nombre: string;
  productos?: any[]; // Si necesitas tipar los productos, puedes importar la interfaz Producto
}
