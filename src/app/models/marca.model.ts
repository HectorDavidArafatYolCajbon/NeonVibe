export interface Marca {
  id_marca: number;
  nombre: string;
  imagen?: string;
  descripcion?: string; // Descripción de la marca
  destacada?: boolean; // Indica si la marca debe destacarse en la UI
  categorias?: string[]; // Opcional, para filtrar marcas por categorías
  productos?: any[]; // Opcional, para cuando se incluyen los productos relacionados
}
