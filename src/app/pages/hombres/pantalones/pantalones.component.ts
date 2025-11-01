import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

@Component({
  selector: 'app-pantalones',
  templateUrl: './pantalones.component.html',
  styleUrls: ['./pantalones.component.scss'],
})
export class PantalonesComponent implements AfterViewInit {
  pantsImages = [
    'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2018',
    'https://images.unsplash.com/photo-1551619873-fcaaf90f88b5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
    'https://videocdn.cdnpk.net/videos/0921bbe6-6707-5916-b133-b195791106ef/horizontal/thumbnails/large.jpg?semt=ais_hybrid&item_id=3444985&w=740&q=80'
  ];

products = [
    {
      name: 'Pantalón Cargo AE',
      price: 329.0,
      oldPrice: 420.0,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585065-1200-auto?v=638781048927000000&width=1200&height=auto&aspect=true',
      description:
        'Pantalón tipo cargo para hombre AE, con múltiples bolsillos y corte moderno. Ideal para un look casual o urbano.',
      gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585065-1200-auto?v=638781048927000000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585067-1200-auto?v=638781048930900000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585071-1200-auto?v=638781048940670000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585079-1200-auto?v=638781048950670000&width=1200&height=auto&aspect=true',
      ],
    },
  {
    name: 'Jeans Original Straight AE',
    price: 299.0,
    oldPrice: 389.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2288267-1200-auto?v=638832603562730000&width=1200&height=auto&aspect=true',
    description: 'Jeans Original Straight para hombre con un ajuste clásico y cómodo. Hechos de mezclilla duradera.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2288267-1200-auto?v=638832603562730000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2288269-1200-auto?v=638832603566000000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2288271-1200-auto?v=638832603569300000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2288274-1200-auto?v=638832603577600000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Pantalón Caterpillar Casual',
    price: 299.0,
    oldPrice: 389.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689644-1200-auto?v=638914033501730000&width=1200&height=auto&aspect=true',
    description: 'Diseño robusto inspirado en el trabajo industrial, fabricado con materiales resistentes y cómodos.',
        gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689644-1200-auto?v=638914033501730000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689647-1200-auto?v=638914033506100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689648-1200-auto?v=638914033509430000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689650-1200-auto?v=638914033513030000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Pantalón Jogger Urbano',
    price: 315.0,
    oldPrice: 420.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/443934-1200-auto?v=638724876824570000&width=1200&height=auto&aspect=true',
    description: 'Jogger moderno con diseño urbano y materiales suaves. Perfecto para uso diario o actividades casuales.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/443934-1200-auto?v=638724876824570000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/443935-1200-auto?v=638724876826600000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/443936-1200-auto?v=638724876829230000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/443938-1200-auto?v=638724876835730000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Jean Athletic con Stretch Hombre AE',
    price: 289.0,
    oldPrice: 399.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1281507-1200-auto?v=638768784853130000&width=1200&height=auto&aspect=true',
    description: 'Pantalón cargo color verde oliva, estilo relajado con múltiples bolsillos funcionales.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1281507-1200-auto?v=638768784853130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1281509-1200-auto?v=638768784857200000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1281512-1200-auto?v=638768784860500000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1281519-1200-auto?v=638768784873470000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Jean Straight Recto de Hombre AE',
    price: 310.0,
    oldPrice: 430.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/448456-1200-auto?v=638739366434270000&width=1200&height=auto&aspect=true',
    description: 'Jeans azul con efecto roto moderno y corte slim. Confeccionado con mezclilla stretch premium.',
        gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/448456-1200-auto?v=638739366434270000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/448457-1200-auto?v=638739366437700000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/448458-1200-auto?v=638739366442530000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/448459-1200-auto?v=638739366446730000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Jean Skinny Athletic Clásico Hombre AE',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2123867-1200-auto?v=638828793378700000&width=1200&height=auto&aspect=true',
    description: 'Pantalón deportivo de compresión ligera, ideal para entrenamiento o uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2123867-1200-auto?v=638828793378700000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2123873-1200-auto?v=638828793392500000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2123884-1200-auto?v=638828793411130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2123886-1200-auto?v=638828793416930000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Pantalón AE Baggy x Manuel Turizo de Hombre',
    price: 339.0,
    oldPrice: 459.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3718510-1200-auto?v=638937405606230000&width=1200&height=auto&aspect=true',
    description: 'Pantalón elegante de vestir con corte ajustado y tela suave. Perfecto para ocasiones formales o de trabajo.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3718510-1200-auto?v=638937405606230000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3718511-1200-auto?v=638937405608900000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3718512-1200-auto?v=638937405612330000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3718513-1200-auto?v=638937405615770000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3718514-1200-auto?v=638937405617800000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Jean Skinny Athletic con Stretch Hombre AE',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/979099-1200-auto?v=638760532402400000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/979099-1200-auto?v=638760532402400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/979101-1200-auto?v=638760532405070000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/979103-1200-auto?v=638760532407870000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/979107-1200-auto?v=638760532411770000&width=1200&height=auto&aspect=true',
    ],
  },
    {
    name: 'Pantalón Cargo Ae Flexible Hombre',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3708681-1200-auto?v=638919199558100000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3708681-1200-auto?v=638919199558100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3708683-1200-auto?v=638919199562000000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3708685-1200-auto?v=638919199564030000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3708688-1200-auto?v=638919199567170000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Pantalón Cargo Ae Flexible Hombre',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585254-1200-auto?v=638781049287200000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585254-1200-auto?v=638781049287200000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585257-1200-auto?v=638781049292670000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585259-1200-auto?v=638781049297030000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1585261-1200-auto?v=638781049301300000&width=1200&height=auto&aspect=true',
    ],
  },
    {
    name: 'Jean Tipo Carpintero Holgado Hombre AE',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454900-1200-auto?v=638748981312000000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454900-1200-auto?v=638748981312000000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454902-1200-auto?v=638748981314670000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454906-1200-auto?v=638748981316530000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454909-1200-auto?v=638748981318730000&width=1200&height=auto&aspect=true',
    ],
  },

];
 selectedProduct: any = null;
  activeImage: string = ''; // ✅ controla la imagen actual del modal

  ngAfterViewInit(): void {
    new Swiper('.main-swiper', {
      modules: [Autoplay, Pagination, Navigation],
      slidesPerView: 1,
      loop: true,
      autoplay: { delay: 3500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }

  openModal(product: any) {
    this.selectedProduct = product;
    this.activeImage = product.gallery ? product.gallery[0] : product.image;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  selectImage(img: string) {
    this.activeImage = img;
  }

  nextImage() {
    if (this.selectedProduct?.gallery) {
      const i = this.selectedProduct.gallery.indexOf(this.activeImage);
      const next = (i + 1) % this.selectedProduct.gallery.length;
      this.activeImage = this.selectedProduct.gallery[next];
    }
  }

  prevImage() {
    if (this.selectedProduct?.gallery) {
      const i = this.selectedProduct.gallery.indexOf(this.activeImage);
      const prev =
        (i - 1 + this.selectedProduct.gallery.length) %
        this.selectedProduct.gallery.length;
      this.activeImage = this.selectedProduct.gallery[prev];
    }
  }
}
