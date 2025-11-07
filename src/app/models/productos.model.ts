export interface Marca {
    id_marca: string;
    nombre: string;
    imagen: string;
}

export interface Categoria {
    id_categoria: string;
    nombre: string;
}

export interface Variante {
    precio_final: number;
    id_variante: string;
    id_producto: string;
    sku: string;
    barcode: string;
    modelo: string;
    color: string;
    talla: string;
    precio_venta: string;
    precio_costo: string;
    descuento: string;
    imagen_url: string;
    activo: boolean;
    stock: number | null;
}

export interface Product {
    id_producto: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
    id_marca: string;
    genero: string;
    id_categoria: string;
    marca: Marca;
    categoria: Categoria;
    variantes: Variante[];

    // Campos adicionales para la UI
    tieneRango?: boolean;
    precioMinimo?: number;
    precioMaximo?: number;
}
