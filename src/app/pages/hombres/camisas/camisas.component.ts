import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


@Component({
  selector: 'app-camisas',
  templateUrl: './camisas.component.html',
  styleUrls: ['./camisas.component.scss']
})
export class CamisasComponent {
  products = [
    {
      name: 'Camisa Casual Azul',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588289-1200-auto?v=638798959184600000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588289-1200-auto?v=638798959184600000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588290-1200-auto?v=638798959193600000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588296-1200-auto?v=638798959208570000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588302-1200-auto?v=638798959217700000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588306-1200-auto?v=638798959226400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588308-1200-auto?v=638798959234000000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
    {
      name: 'Camisa escocesa estilo chamarra AE',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588062-1200-auto?v=638798957544100000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588062-1200-auto?v=638798957544100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588070-1200-auto?v=638798957572500000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588075-1200-auto?v=638798957584500000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588085-1200-auto?v=638798957611770000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588089-1200-auto?v=638798957645100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/1588093-1200-auto?v=638798957665030000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
      {
      name: 'Camisa de Cuadros Manga Larga Hombre AE',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424194-1200-auto?v=638653020182800000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424194-1200-auto?v=638653020182800000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424195-1200-auto?v=638653020187170000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424197-1200-auto?v=638653020191070000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424198-1200-auto?v=638653020194830000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camisa en Denim Manga Larga Hombre AE',
      price: 199,
      oldPrice: 259,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424293-1200-auto?v=638653023082600000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424293-1200-auto?v=638653023082600000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424301-1200-auto?v=638653023107130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424305-1200-auto?v=638653023117130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/424308-1200-auto?v=638653023127270000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camisa manga corta Ae con estampados',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414039-1200-auto?v=638567625552130000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414039-1200-auto?v=638567625552130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414074-1200-auto?v=638567625582730000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414084-1200-auto?v=638567625593330000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414105-1200-auto?v=638567625615330000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414119-1200-auto?v=638567625639370000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414230-1200-auto?v=638567625710670000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camisa manga corta Ae con rayas',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3696380-1200-auto?v=638914101099130000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3696380-1200-auto?v=638914101099130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3696382-1200-auto?v=638914101103670000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3696383-1200-auto?v=638914101107570000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3696384-1200-auto?v=638914101111900000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camisa manga corta Ae con estampados',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414221-1200-auto?v=638567625708000000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414221-1200-auto?v=638567625708000000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414234-1200-auto?v=638567625711730000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414248-1200-auto?v=638567625716130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414254-1200-auto?v=638567625719100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414261-1200-auto?v=638567625722300000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414267-1200-auto?v=638567625725270000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camisa manga corta Ae con estampados',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414300-1200-auto?v=638567625740730000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414300-1200-auto?v=638567625740730000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414305-1200-auto?v=638567625743770000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414313-1200-auto?v=638567625747070000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414320-1200-auto?v=638567625750030000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414330-1200-auto?v=638567625753430000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/414342-1200-auto?v=638567625759270000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Polo Slim Fit para Hombre',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3699976-1200-auto?v=638914340245430000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3699976-1200-auto?v=638914340245430000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3699978-1200-auto?v=638914340248400000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3699981-1200-auto?v=638914340251070000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3699984-1200-auto?v=638914340253870000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Polo en Tejido Piqué Slim Fit para Hombre',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702757-1200-auto?v=638914392453070000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702757-1200-auto?v=638914392453070000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702761-1200-auto?v=638914392457130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702767-1200-auto?v=638914392460270000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702771-1200-auto?v=638914392462900000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Polo en Tejido Piqué Slim Fit para Hombre',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3701764-1200-auto?v=638914388940670000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3701764-1200-auto?v=638914388940670000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3701767-1200-auto?v=638914388942700000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3701771-1200-auto?v=638914388944270000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3701772-1200-auto?v=638914388945830000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Polo en Tejido Piqué Slim Fit para Hombre',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702730-1200-auto?v=638914392426930000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702730-1200-auto?v=638914392426930000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702733-1200-auto?v=638914392430370000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702737-1200-auto?v=638914392433200000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702740-1200-auto?v=638914392436000000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Polo en Tejido Piqué Slim Fit para Hombre Roja',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702379-1200-auto?v=638914390750100000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702379-1200-auto?v=638914390750100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702386-1200-auto?v=638914390755570000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702389-1200-auto?v=638914390757930000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3702393-1200-auto?v=638914390760600000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camiseta Ae con gráfico doseño circular',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/416170-1200-auto?v=638598813320000000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/416170-1200-auto?v=638598813320000000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/416172-1200-auto?v=638598813323130000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/416173-1200-auto?v=638598813326570000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/416175-1200-auto?v=638598813328300000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/416177-1200-auto?v=638598813330200000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camisa AE Slim fit con botones Verde',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/382134-1200-auto?v=638458852137570000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/382134-1200-auto?v=638458852137570000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/382135-1200-auto?v=638458852142100000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/382138-1200-auto?v=638458852146300000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/382142-1200-auto?v=638458852151300000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camiseta Negra con Gráfico Manga Corta Hombre AE ',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/435787-1200-auto?v=638666088895870000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/435787-1200-auto?v=638666088895870000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/435791-1200-auto?v=638666088900170000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/435793-1200-auto?v=638666088903930000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/435799-1200-auto?v=638666088908170000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camiseta Gris Gráfica con Logo Ae',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3296014-1200-auto?v=638860344445470000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3296014-1200-auto?v=638860344445470000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3296015-1200-auto?v=638860344449030000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3296016-1200-auto?v=638860344453270000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3296017-1200-auto?v=638860344457530000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3296018-1200-auto?v=638860344460030000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/3296020-1200-auto?v=638860344467800000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
        {
      name: 'Camiseta gráfica con logotipo aplicado de AE',
      price: 199,
      oldPrice: 249,
      image: 'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2376014-1200-auto?v=638834154391770000&width=1200&height=auto&aspect=true',
      description: 'Camisa casual para hombre, cómoda y elegante para cualquier ocasión.',
      images: [
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2376014-1200-auto?v=638834154391770000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2376015-1200-auto?v=638834154401600000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2376017-1200-auto?v=638834154403600000&width=1200&height=auto&aspect=true',
        'https://americaneagleguatemala.vtexassets.com/arquivos/ids/2376019-1200-auto?v=638834154405030000&width=1200&height=auto&aspect=true',
      ],
      sizes: ['S', 'M', 'L']
    },
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
