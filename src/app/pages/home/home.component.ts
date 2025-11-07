import { Component, AfterViewInit, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ProductosService } from 'src/app/services/productos.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnInit {
  bannerImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGllbmRhJTIwZGUlMjByb3BhfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvbmRvJTIwZGUlMjBwYW50YWxsYSUyMGRlJTIwbmlrZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1700433770684-6a8f69dd28ba?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWRpZGFzJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww'
  ];

  weekly = [
    {
      title: 'DISEÑOS SPORT',
      img: 'https://img1.wallspic.com/crops/7/1/2/0/20217/20217-pantalones-3840x2160.jpg',
      link: '/diseno-sport'
    },
    {
      title: 'ACCESORIOS SPORT',
      img: 'https://img2.wallspic.com/crops/6/0/9/5/3/135906/135906-arranque-bota_de_ftbol-listn-3840x2160.jpg',
      link: '/accesorios-sport'
    },
    {
      title: 'DE LO NUEVO EN MODA',
      img: 'https://img2.wallspic.com/crops/7/0/1/8/3/138107/138107-gema-3840x2160.jpg',
      link: '/de-lo-nuevo-en-moda'
    },
    {
      title: 'VÍSTETE A TU ESTILO',
      img: 'https://img.freepik.com/fotos-premium/hermosas-chicas-jovenes-moda-ropa-vintage-elegante-abrigos-pantalones-vaqueros-cintura-alta-trajes-pie-cerca-columnas-retro-ciudad_338491-15017.jpg',
      link: '/vistete-a-tu-estilo'
    }
  ];

  // 🔹 Inicialización del carrusel principal
  ngAfterViewInit(): void {
    new Swiper('.main-swiper', {
      modules: [Autoplay, Pagination, Navigation],
      slidesPerView: 1,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // ===== Featured products =====
  featured: any[] = [];

  constructor(private productosService: ProductosService, private cartService: CartService) {}

  ngOnInit(): void {
    // Obtener variantes y construir lista de productos únicos con imagen válida
    this.productosService.getVariantes().subscribe({
      next: (data: any[]) => {
        const unique: Record<string, any> = {};

        // Primero, agrupar todas las variantes por producto
        const productVariants: Record<string, any[]> = {};

        // Agrupar variantes por producto
        for (const v of data) {
          const idProducto = v.producto?.id_producto;
          if (!idProducto) continue;

          if (!productVariants[idProducto]) {
            productVariants[idProducto] = [];
          }
          productVariants[idProducto].push(v);
        }

        // Procesar cada producto y sus variantes
        for (const [idProducto, variants] of Object.entries(productVariants)) {
          // Buscar una imagen válida entre todas las variantes
          let img = '';
          for (const v of variants) {
            if (v.imagen_url && !v.imagen_url.includes('Sin+Imagen')) {
              img = v.imagen_url;
              break;
            }
            if (Array.isArray(v.imagenes) && v.imagenes.length) {
              const found = v.imagenes.find((i: any) => i?.url && !i.url.includes('Sin+Imagen'));
              if (found) {
                img = found.url;
                break;
              }
            }
          }

          if (!img) continue; // saltar productos sin imagen

          // Crear objeto de producto con todas sus variantes con stock
          const variantesConStock = variants.filter(v => (v.stock?.stock ?? 0) > 0);
          if (variantesConStock.length === 0) continue; // saltar si no hay variantes con stock

          unique[idProducto] = {
            id_producto: idProducto,
            name: variants[0].producto?.nombre || variants[0].modelo,
            image: img,
            precio_final: parseFloat(variantesConStock[0].precio_final ?? variantesConStock[0].precio_venta ?? 0),
            sizes: [],
            selectedSize: '',
            variants: []
          };

          // Procesar todas las variantes con stock
          for (const v of variantesConStock) {
            // Guardar variante
            unique[idProducto].variants.push({
              id_variante: v.id_variante,
              talla: v.talla || 'Única',
              stock: v.stock?.stock ?? 0,
              precio_final: parseFloat(v.precio_final ?? v.precio_venta ?? 0)
            });

            // Agregar talla si no está en la lista
            if (v.talla && !unique[idProducto].sizes.includes(v.talla)) {
              unique[idProducto].sizes.push(v.talla);
            }
          }

          // Ordenar tallas
          if (unique[idProducto].sizes.length > 0) {
            unique[idProducto].sizes.sort((a: string, b: string) => {
              // Convertir tallas numéricas para ordenar correctamente
              const numA = parseInt(a);
              const numB = parseInt(b);
              if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
              return a.localeCompare(b);
            });
          }
        }

        // Filtrar primero los productos que tengan al menos una talla con stock
        const productsWithStock = Object.values(unique).filter(p => p.sizes.length > 0);

        this.featured = productsWithStock.slice(0, 4).map((f: any) => ({
          ...f,
          selectedSize: f.sizes[0] // Seleccionar primera talla disponible
        }));
      },
      error: (err) => {
        console.error('Error al cargar variantes para featured:', err);
      }
    });
  }

  addFeaturedToCart(item: any) {
    // Buscar la variante que coincida con la talla seleccionada
    if (!item.selectedSize || !item.variants) {
      alert('⚠️ Por favor selecciona una talla');
      return;
    }

    // Buscar la variante que corresponde a la talla seleccionada
    const selectedVariant = item.variants.find((v: any) => v.talla === item.selectedSize);
    if (!selectedVariant) {
      alert('⚠️ Talla no disponible');
      return;
    }

    // Usar los datos de la variante seleccionada
    const varianteId = selectedVariant.id_variante;
    const precio = selectedVariant.precio_final;
    const stock = selectedVariant.stock;

    const productToAdd = {
      id_variante: varianteId,
      name: item.name,
      talla: item.selectedSize,
      image: item.image,
      precio_final: precio,
      stock: stock,
      cantidad: 1
    };

    this.cartService.addToCart(productToAdd);
    alert(`✅ ${item.name} (talla ${item.selectedSize}) Agregar al Carrito`);
  }
}
