import { Component } from '@angular/core';

@Component({
  selector: 'app-vestidos',
  templateUrl: './vestidos.component.html',
  styleUrls: ['./vestidos.component.scss']
})
export class VestidosComponent {
  products = [
    {
      name: 'Falda corta Aesthetic',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694898-1200-auto?v=638914086237800000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694898-1200-auto?v=638914086237800000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694901-1200-auto?v=638914086244200000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694903-1200-auto?v=638914086246530000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694904-1200-auto?v=638914086251370000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Falda AE larga con botones para mujer',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425531-1200-auto?v=638653092159900000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425531-1200-auto?v=638653092159900000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425538-1200-auto?v=638653092165430000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425540-1200-auto?v=638653092168570000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425542-1200-auto?v=638653092171370000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Falda AE larga con botones para mujer',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425489-1200-auto?v=638653092093170000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425489-1200-auto?v=638653092093170000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425495-1200-auto?v=638653092101970000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425501-1200-auto?v=638653092110130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/425509-1200-auto?v=638653092117730000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Falda corta Ae',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694365-1200-auto?v=638914079004630000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694365-1200-auto?v=638914079004630000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694367-1200-auto?v=638914079008400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694369-1200-auto?v=638914079010900000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3694372-1200-auto?v=638914079013400000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
      {
      name: 'Falda de cuero vegano Talle Alto Mujer AE',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689562-1200-auto?v=638914032203030000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689562-1200-auto?v=638914032203030000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689563-1200-auto?v=638914032206800000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689564-1200-auto?v=638914032210770000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689566-1200-auto?v=638914032214500000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3689567-1200-auto?v=638914032218900000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
      {
      name: 'Falda Negra Bubble Aesthetic',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3728009-1200-auto?v=638943625957230000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3728009-1200-auto?v=638943625957230000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3728018-1200-auto?v=638943625982970000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3728031-1200-auto?v=638943626033770000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3728035-1200-auto?v=638943626041370000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3728042-1200-auto?v=638943626061600000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Falda Maxi de Tiro Alto con efecto Globo para Mujer AE',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1839472-1200-auto?v=638814501196500000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1839472-1200-auto?v=638814501196500000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1839491-1200-auto?v=638814501216530000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1839499-1200-auto?v=638814501229970000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1839506-1200-auto?v=638814501236300000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Vestido Largo manga larga Mujer AE',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/437234-1200-auto?v=638666934789770000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/437234-1200-auto?v=638666934789770000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/437235-1200-auto?v=638666934795330000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/437236-1200-auto?v=638666934800030000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/437237-1200-auto?v=638666934815500000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Vestido AE largo de Mujer',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417204-1200-auto?v=638598837101070000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417204-1200-auto?v=638598837101070000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417207-1200-auto?v=638598837104200000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417210-1200-auto?v=638598837108730000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417221-1200-auto?v=638598837128300000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Vestido Camisero Midi Manga Corta para Mujer',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2527737-1200-auto?v=638837595373300000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2527737-1200-auto?v=638837595373300000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2527739-1200-auto?v=638837595375630000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2527741-1200-auto?v=638837595377100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2527744-1200-auto?v=638837595380070000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Vestido Bordado en frente Manga Larga Mujer AE',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3692385-1200-auto?v=638914061231400000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3692385-1200-auto?v=638914061231400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3692386-1200-auto?v=638914061236000000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3692388-1200-auto?v=638914061240500000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3692394-1200-auto?v=638914061253700000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    },
    {
      name: 'Vestido AE corto de Mujer',
      price: 219,
      oldPrice: 289,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417198-1200-auto?v=638598837086930000&width=1200&height=auto&aspect=true',
      description: 'Camisa formal con botones finos y corte moderno.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417198-1200-auto?v=638598837086930000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417201-1200-auto?v=638598837091600000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417203-1200-auto?v=638598837097630000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/417205-1200-auto?v=638598837103270000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['XS', 'S', 'M']
    }
  ];

  selectedProduct: any = null;
  activeImage: string = '';
  selectedSize: string = '';

  openModal(product: any) {
    this.selectedProduct = product;
    this.activeImage = product.images[0];
  }

  closeModal() {
    this.selectedProduct = null;
  }

  nextImage() {
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[(idx + 1) % this.selectedProduct.images.length];
  }

  prevImage() {
    const idx = this.selectedProduct.images.indexOf(this.activeImage);
    this.activeImage =
      this.selectedProduct.images[
        (idx - 1 + this.selectedProduct.images.length) % this.selectedProduct.images.length
      ];
  }
}
