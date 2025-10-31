import { Component } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.scss']
})
export class AccesoriosComponent {
  pantsImages = [
    'https://plus.unsplash.com/premium_photo-1661645449694-5bf9766205e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.pexels.com/photos/11926130/pexels-photo-11926130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
  ];

products = [
    {
      name: 'Bolso tipo Bandolera Mujer AE',
      price: 329.0,
      oldPrice: 420.0,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/426465-1200-auto?v=638653113089800000&width=1200&height=auto&aspect=true',
      description:
        'Pantalón tipo cargo para hombre AE, con múltiples bolsillos y corte moderno. Ideal para un look casual o urbano.',
      gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/426465-1200-auto?v=638653113089800000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/426469-1200-auto?v=638653113100430000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/426480-1200-auto?v=638653113120430000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/426485-1200-auto?v=638653113133770000&width=1200&height=auto&aspect=true',
      ],
    },
  {
    name: 'Paquete de 3 Calcetines Ae Clásicos',
    price: 299.0,
    oldPrice: 389.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732304-1200-auto?v=638968260756300000&width=1200&height=auto&aspect=true',
    description: 'Jeans Original Straight para hombre con un ajuste clásico y cómodo. Hechos de mezclilla duradera.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732304-1200-auto?v=638968260756300000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Gorra beisbolera con gráfico de mujer AE',
    price: 299.0,
    oldPrice: 389.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/961972-1200-auto?v=638760120117430000&width=1200&height=auto&aspect=true',
    description: 'Diseño robusto inspirado en el trabajo industrial, fabricado con materiales resistentes y cómodos.',
        gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/961972-1200-auto?v=638760120117430000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/961977-1200-auto?v=638760120125700000&width=1200&height=auto&aspect=true',
    ]
  },
  {
    name: 'Sandalias Ae acolchadas',
    price: 315.0,
    oldPrice: 420.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1841873-1200-auto?v=638814516174970000&width=1200&height=auto&aspect=true',
    description: 'Jogger moderno con diseño urbano y materiales suaves. Perfecto para uso diario o actividades casuales.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1841873-1200-auto?v=638814516174970000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1841879-1200-auto?v=638814516188400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1841889-1200-auto?v=638814516218370000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Gorro mujer AE Vintage',
    price: 289.0,
    oldPrice: 399.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/450365-1200-auto?v=638742978199230000&width=1200&height=auto&aspect=true',
    description: 'Pantalón cargo color verde oliva, estilo relajado con múltiples bolsillos funcionales.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/450365-1200-auto?v=638742978199230000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/450375-1200-auto?v=638742978219000000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Mini Bolso Safari Tipo Slouch para Mujer',
    price: 310.0,
    oldPrice: 430.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3691146-1200-auto?v=638914044705800000&width=1200&height=auto&aspect=true',
    description: 'Jeans azul con efecto roto moderno y corte slim. Confeccionado con mezclilla stretch premium.',
        gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3691146-1200-auto?v=638914044705800000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3691150-1200-auto?v=638914044721400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3691168-1200-auto?v=638914044744470000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Cinturón Trenzado para Hombre AE',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2701017-1200-auto?v=638841426340400000&width=1200&height=auto&aspect=true',
    description: 'Pantalón deportivo de compresión ligera, ideal para entrenamiento o uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2701017-1200-auto?v=638841426340400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2701019-1200-auto?v=638841426349930000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Gorra tipo Beisbolera ajustada Hombre AE',
    price: 339.0,
    oldPrice: 459.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454718-1200-auto?v=638748981144100000&width=1200&height=auto&aspect=true',
    description: 'Pantalón elegante de vestir con corte ajustado y tela suave. Perfecto para ocasiones formales o de trabajo.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454718-1200-auto?v=638748981144100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/454736-1200-auto?v=638748981161500000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Ae x tru Kolors Gorro de Doble Capa Acanalado',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732311-1200-auto?v=638968287705100000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732311-1200-auto?v=638968287705100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732315-1200-auto?v=638968287732230000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732316-1200-auto?v=638968287744400000&width=1200&height=auto&aspect=true',
    ],
  },
    {
    name: 'Bufanda de punto con diseño de pata de gallo Ae x tru Kolors',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732308-1200-auto?v=638968285913230000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732308-1200-auto?v=638968285913230000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732309-1200-auto?v=638968285935300000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3732310-1200-auto?v=638968285944670000&width=1200&height=auto&aspect=true',
    ],
  },
  {
    name: 'Gorra AE x Manuel Turizo de Hombre',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/442272-1200-auto?v=638677260245170000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/442272-1200-auto?v=638677260245170000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/442273-1200-auto?v=638677260268530000&width=1200&height=auto&aspect=true',
    ],
  },
    {
    name: 'Pack de 5 medias tobilleras Aeo',
    price: 275.0,
    oldPrice: 370.0,
    image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3726994-1200-auto?v=638943473449900000&width=1200&height=auto&aspect=true',
    description: 'Pantalón de compresión ligera, uso casual con total comodidad.',
    gallery: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3726994-1200-auto?v=638943473449900000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3726996-1200-auto?v=638943473468700000&width=1200&height=auto&aspect=true',
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
