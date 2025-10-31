import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
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
}
