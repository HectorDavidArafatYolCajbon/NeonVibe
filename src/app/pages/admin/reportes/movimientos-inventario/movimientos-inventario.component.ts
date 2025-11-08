import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReportesService } from '../../../../services/reportes.service';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

interface MovimientoInventario {
  fecha: string;
  cantidad: number;
  producto: string;
  usuario: string;
  tipo: string;
  descripcion: string;
  precioUnitario: number;
stockantes: number;
 stockdespues: number;
}

@Component({
  selector: 'app-movimientos-inventario',
  templateUrl: './movimientos-inventario.component.html',
  styleUrls: ['./movimientos-inventario.component.scss']
})
export class MovimientosInventarioComponent implements OnInit {
  fechaDesde = new FormControl<Date | null>(new Date());
  fechaHasta = new FormControl<Date | null>(new Date());
  tipoMovimiento = new FormControl('todos');

  displayedColumns: string[] = [
    'fecha',
    'cantidad',
    'producto',
    'usuario',
    'tipo',
    'descripcion',
    'precioUnitario',
    'stockantes',
   'stockdespues'
  ];

  cargando = false;
  movimientos: MatTableDataSource<MovimientoInventario>;

  constructor(private reportes: ReportesService) {
    this.movimientos = new MatTableDataSource<MovimientoInventario>([]);
  }

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  filtrar(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    if (!this.fechaDesde.value || !this.fechaHasta.value) return;

    // Formatear las fechas como strings YYYY-MM-DD
    const fechaInicio = this.fechaDesde.value!.toJSON().split('T')[0];
    const fechaFin = this.fechaHasta.value!.toJSON().split('T')[0];

    console.log('Enviando filtros:', { fechaInicio, fechaFin });

    this.cargando = true;
    this.reportes.movimientosInventario(fechaInicio, fechaFin).subscribe({
      next: (data: any) => {
        let movimientosFiltrados = data.movimientos || [];

        // Filtrar en el frontend por tipo
        const tipoFiltro = this.tipoMovimiento.value;
        if (tipoFiltro && tipoFiltro !== 'todos') {
          console.log('Datos recibidos antes del filtro:', data.movimientos);
          if (data.movimientos && data.movimientos.length > 0) {
            console.log('Estructura de un movimiento:', JSON.stringify(data.movimientos[0], null, 2));
          }
          movimientosFiltrados = data.movimientos.filter((m: any) => {
            const tipoMovimiento = m.tipo?.toLowerCase();
            const filtroAplicar = tipoFiltro.toLowerCase();
            console.log(`Comparando: ${tipoMovimiento} con ${filtroAplicar}`);

            switch (filtroAplicar) {
              case 'in':
                return tipoMovimiento === 'entrada';
              case 'out':
                return tipoMovimiento === 'salida';
              case 'adjust':
                return tipoMovimiento === 'ajuste';
              default:
                return true;
            }
          });
          console.log('Datos después del filtro:', movimientosFiltrados);
        }

        this.movimientos.data = movimientosFiltrados.map((m: any) => {
          console.log('Datos completos del movimiento:', m);

          return {
            fecha: m.fecha,
            cantidad: Number(m.cantidad) || 0,
            producto: m.producto,
            usuario: m.usuario,
            tipo: this.getTipoMovimiento(m.tipo),
            descripcion: m.descripcion,
            precioUnitario: Number(m.precioUnitario) || 0,
            stockantes: Number(m.stockantes) || 0,
            stockdespues: Number(m.stockdespues) || 0
          };
        });
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
    this.tipoMovimiento.setValue('todos');
    this.cargarMovimientos();
  }

  getTipoMovimiento(tipo: string): string {
    return tipo; // Backend ya retorna el tipo legible ('Entrada', 'Salida', 'Ajuste')
  }

  exportarExcel(): void {
    const data = this.movimientos.data.map(m => ({
      Fecha: new Date(m.fecha).toLocaleString(),
      Cantidad: m.cantidad,
      Producto: m.producto,
      Usuario: m.usuario,
      Movimiento: m.tipo,
      Descripción: m.descripcion,
      'Precio Unitario': `Q${m.precioUnitario}`,
      'Stock Antes': m.stockantes,
      'Stock Después': m.stockdespues
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');

    const fileName = `movimientos_inventario_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
