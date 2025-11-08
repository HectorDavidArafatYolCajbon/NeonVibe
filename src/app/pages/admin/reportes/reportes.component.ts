import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  acciones = [
    {
      key: 'ventas-mes',
      titulo: 'Ventas totales por mes',
      descripcion: 'Ver gráfico de volumen de ventas mensual',
      icono: 'bar_chart'
    },
    {
      key: 'ganancias-mes',
      titulo: 'Ganancias totales por mes',
      descripcion: 'Margen / utilidad consolidada mensual',
      icono: 'stacked_line_chart'
    },
    {
      key: 'ventas-dia',
      titulo: 'Ventas del día',
      descripcion: 'Resumen y detalle de las ventas de hoy',
      icono: 'today'
    },
    {
      key: 'mov-inventario',
      titulo: 'Movimientos de inventario',
      descripcion: 'Entradas, salidas y ajustes de stock',
      icono: 'inventory_2'
    },
    {
      key: 'mov-ventas',
      titulo: 'Movimientos de ventas',
      descripcion: 'Transacciones individuales y estados',
      icono: 'receipt_long'
    }
  ];

  constructor(private router: Router) {}

  seleccionar(accion: string) {
    switch (accion) {
      case 'ventas-mes':
        this.router.navigate(['/admin/reportes/ventas-mes']);
        break;
      case 'ganancias-mes':
        this.router.navigate(['/admin/reportes/ganancias-mes']);
        break;
        this.router.navigate(['/admin/reportes/ganancias-mes']);
        break;
      case 'ventas-dia':
        this.router.navigate(['/admin/reportes/ventas-dia']);
        break;
      case 'mov-inventario':
        this.router.navigate(['/admin/reportes/movimientos-inventario']);
        break;
      case 'mov-ventas':
        this.router.navigate(['/admin/reportes/ventas-mes']);
        break;
      // Otros reportes podrán navegar a sus respectivas rutas en el futuro
    }
  }
}
