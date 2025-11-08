import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReportesService } from '../../../../services/reportes.service';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

interface MovimientoVenta {
  fecha: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  cliente: string;
  vendedor: string;
}

@Component({
  selector: 'app-movimientos-ventas',
  templateUrl: './movimientos-ventas.component.html',
  styleUrls: ['./movimientos-ventas.component.scss']
})
export class MovimientosVentasComponent implements OnInit {
  fechaDesde = new FormControl<Date | null>(new Date());
  fechaHasta = new FormControl<Date | null>(new Date());

  displayedColumns: string[] = [
    'fecha',
    'producto',
    'cantidad',
    'precioUnitario',
    'total',
    'cliente',
    'vendedor'
  ];

  cargando = false;
  movimientos: MatTableDataSource<MovimientoVenta>;

  constructor(private reportes: ReportesService) {
    this.movimientos = new MatTableDataSource<MovimientoVenta>([]);
  }

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  filtrar(): void {
    const fechaInicio = this.fechaDesde.value!.toJSON().split('T')[0];
    const fechaFin = this.fechaHasta.value!.toJSON().split('T')[0];

    console.log('Enviando filtros:', { fechaInicio, fechaFin });
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    const fechaInicio = this.fechaDesde.value!.toJSON().split('T')[0];
    const fechaFin = this.fechaHasta.value!.toJSON().split('T')[0];

    this.cargando = true;
    this.reportes.movimientosVentas(fechaInicio, fechaFin).subscribe({
      next: (data: any) => {
        this.movimientos.data = data.ventas.map((v: any) => ({
          fecha: v.fecha,
          producto: v.producto,
          cantidad: Number(v.cantidad) || 0,
          precioUnitario: Number(v.precio_unit || v.precioUnitario) || 0,
          total: (Number(v.cantidad) || 0) * (Number(v.precio_unit || v.precioUnitario) || 0),
          cliente: v.cliente || 'N/A',
          vendedor: v.vendedor
        }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.fechaDesde.setValue(new Date());
    this.fechaHasta.setValue(new Date());
    this.cargarMovimientos();
  }

  exportarExcel(): void {
    const data = this.movimientos.data.map(m => ({
      Fecha: new Date(m.fecha).toLocaleString(),
      Producto: m.producto,
      Cantidad: m.cantidad,
      'Precio Unitario': `Q${m.precioUnitario}`,
      Total: `Q${m.cantidad * m.precioUnitario}`,
      Cliente: m.cliente,
      Vendedor: m.vendedor
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

    const fileName = `movimientos_ventas_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
