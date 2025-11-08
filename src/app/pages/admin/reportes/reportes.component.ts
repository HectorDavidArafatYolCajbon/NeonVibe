import { Component } from '@angular/core';

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

  seleccionar(accion: string) {
    // Placeholder: posteriormente se conectará con carga de datos/gráficos
    console.log('Seleccionado reporte:', accion);
  }
}
