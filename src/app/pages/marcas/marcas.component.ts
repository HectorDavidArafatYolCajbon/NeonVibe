import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription, finalize, catchError, of, switchMap } from 'rxjs';
import { MarcasService, Marca } from 'src/app/services/marcas.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Product } from 'src/app/models/product';

interface ProductoAgrupado {
  id: string;
  name: string;
  description: string;
  color: string;
  images: string[];
  sizes: Array<{
    talla: string;
    stock: number;
    descuento: number;
    precio: number;
  }>;
  descuentos: number[];
  precios: number[];
  image: string;
  descuento?: number;
  price: number;
  oldPrice?: number;
  tieneRango: boolean;
}

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss']
})
export class MarcasComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  private userSubscription?: Subscription;
  private marcasSubscription?: Subscription;
  private productosSubscription?: Subscription;
  loading = true;
  error: string | null = null;

  // Lista de marcas y productos
  marcas: Marca[] = [];
  productos: ProductoAgrupado[] = [];
  marcaSeleccionada: Marca | null = null;
  loadingProducts = false;

  // Categorías para filtrar
  categorias: string[] = ['Todas'];
  categoriaSeleccionada = 'Todas';

  constructor(
    private authService: AuthService,
    private marcasService: MarcasService,
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    this.cargarMarcas();
  }

  cargarMarcas(): void {
    this.loading = true;
    this.error = null;
    this.marcasSubscription = this.marcasService.getMarcas()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (marcas) => {
          console.log('Marcas cargadas:', marcas);
          if (!marcas || !Array.isArray(marcas)) {
            console.error('No se recibieron marcas válidas del servidor');
            this.error = 'Error al cargar las marcas. Formato de datos incorrecto.';
            return;
          }

          this.marcas = marcas;
          // Extraer categorías únicas de las marcas
          const categoriasSet = new Set<string>();
          categoriasSet.add('Todas');

          marcas.forEach(marca => {
            if (marca && Array.isArray(marca.categorias)) {
              marca.categorias.forEach(cat => {
                if (cat) categoriasSet.add(cat);
              });
            } else {
              console.warn('Marca con categorías inválidas:', marca);
            }
          });

          this.categorias = Array.from(categoriasSet);
        },
        error: (err) => {
          console.error('Error al cargar las marcas:', err);
          this.error = 'Error al cargar las marcas. Por favor, intente más tarde.';
        }
      });
  }

  /** Filtrar marcas por categoría */
  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }

  /** Obtener marcas filtradas */
  get marcasFiltradas(): Marca[] {
    if (this.categoriaSeleccionada === 'Todas') {
      return this.marcas;
    }
    return this.marcas.filter(marca =>
      marca.categorias && Array.isArray(marca.categorias) &&
      marca.categorias.includes(this.categoriaSeleccionada)
    );
  }

  /** Ver detalle de marca */
  verDetalle(marca: Marca): void {
    console.log('Viendo detalle de marca:', marca);
    this.marcaSeleccionada = marca;
    this.loadingProducts = true;
    this.error = null;
    this.productos = [];

    if (!marca.id_marca) {
      console.error('ID de marca no válido:', marca.id_marca);
      this.error = 'Error al cargar productos: ID de marca no válido';
      this.loadingProducts = false;
      return;
    }

    // Asegurarnos de que el ID sea un número válido
    const idMarca = typeof marca.id_marca === 'string' ?
                   parseInt(marca.id_marca) :
                   (typeof marca.id_marca === 'number' ? marca.id_marca : null);

    if (!idMarca || isNaN(idMarca)) {
      console.error('ID de marca inválido:', marca.id_marca);
      this.error = 'Error al cargar productos: ID de marca inválido';
      this.loadingProducts = false;
      return;
    }

    console.log('🏷️ Procesando marca:', marca.nombre, 'con ID:', idMarca);

    // Cargar los productos
    this.productosSubscription?.unsubscribe();
    this.productosSubscription = this.productosService.getProductosByMarca(idMarca).pipe(
      catchError(error => {
        console.error('Error al cargar productos:', error);
        this.error = 'Error al cargar los productos. Por favor, intente más tarde.';
        this.loadingProducts = false;
        return of([]);
      })
    ).subscribe({
      next: (variantes) => {
        if (!variantes || variantes.length === 0) {
          console.warn('⚠️ No se encontraron productos para esta marca');
          this.productos = [];
          this.loadingProducts = false;
          return;
        }

        console.log('✅ Variantes recibidas:', variantes);

        // Agrupar variantes por producto
        const agrupadas: Record<string, {
          id: string;
          name: string;
          description: string;
          color: string;
          images: string[];
          sizes: Array<{
            talla: string;
            stock: number;
            descuento: number;
            precio: number;
          }>;
          descuentos: number[];
          precios: number[];
        }> = {};

        for (const v of variantes) {
          const idProducto = v.producto?.id_producto;
          if (!idProducto) continue;

          if (!agrupadas[idProducto]) {
            agrupadas[idProducto] = {
              id: idProducto,
              name: v.producto?.nombre || v.modelo || 'Producto sin nombre',
              description: v.producto?.descripcion || 'Sin descripción disponible',
              color: v.color || '',
              images: [],
              sizes: [],
              descuentos: [],
              precios: []
            };
          }

          // Agregar imágenes
          const nuevasImgs = [
            v.imagen_url,
            ...(v.imagenes?.map((img: { url: string }) => img.url) || [])
          ].filter((img): img is string => !!img);

          nuevasImgs.forEach(img => {
            if (!agrupadas[idProducto].images.includes(img)) {
              agrupadas[idProducto].images.push(img);
            }
          });

          // Agregar tallas y precios
          const descuento = parseFloat((v.descuento ?? '0').toString());
          const precio = parseFloat((v.precio_final ?? v.precio_venta ?? '0').toString());

          agrupadas[idProducto].sizes.push({
            talla: v.talla || 'N/A',
            stock: v.stock?.stock ?? 0,
            descuento,
            precio
          });

          agrupadas[idProducto].descuentos.push(descuento);
          agrupadas[idProducto].precios.push(precio);
        }

        // Convertir a array de productos con tipo
        this.productos = Object.values(agrupadas).map(p => {
          const maxPrecio = Math.max(...p.precios);
          const maxDesc = Math.max(...p.descuentos);
          const minPrecio = Math.min(...p.precios);

          return {
            ...p,
            image: p.images[0] || 'https://via.placeholder.com/400x400?text=Sin+Imagen',
            descuento: maxDesc > 0 ? maxDesc : undefined,
            price: minPrecio || 0,
            oldPrice: maxDesc > 0 ? maxPrecio : undefined,
            tieneRango: maxPrecio !== minPrecio
          };
        });

        console.log('Productos procesados:', this.productos);
        this.loadingProducts = false;
      },
      error: (err: any) => {
        console.error('Error al cargar los productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intente más tarde.';
        this.loadingProducts = false;
      }
    });
  }

  /** Cerrar sesión */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.marcasSubscription?.unsubscribe();
    this.productosSubscription?.unsubscribe();
  }
}
