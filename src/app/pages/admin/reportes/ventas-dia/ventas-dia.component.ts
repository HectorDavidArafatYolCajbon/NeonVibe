import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReportesService } from '../../../../services/reportes.service';

interface ByHour { hour: string; amount: number; orders: number; }

@Component({
  selector: 'app-ventas-dia',
  templateUrl: './ventas-dia.component.html',
  styleUrls: ['./ventas-dia.component.scss']
})
export class VentasDiaComponent implements OnInit {
  @Input() fecha?: string; // YYYY-MM-DD

  fechaControl = new FormControl<Date | null>(new Date());

  cargando = false;
  error?: string;
  data: any;
  lineasDia: Array<{ hora: string; usuario?: string; variante: string; talla?: string; cantidad: number; unit: number; total: number }>=[];
  usoMock = false;

  constructor(private reportes: ReportesService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const baseDate = this.fechaControl.value || new Date();
    const f = this.fecha || baseDate.toISOString().slice(0,10);
    this.cargando = true;
    this.error = undefined;
    this.usoMock = false;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Guatemala';
    this.reportes.ventasDelDia(f, tz).subscribe({
      next: (resp: any) => {
        this.data = resp;
        this.armarLineas();
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el reporte';
        this.cargando = false;
      }
    });
  }

  // Utilidades de UI
  maxByHour(): number {
    const arr: ByHour[] = this.data?.summary?.byHour || [];
    return arr.reduce((m, x) => Math.max(m, Number(x.amount)||0), 0) || 0;
  }

  filtrarPorFecha(): void {
    this.load();
  }

  private armarLineas(): void {
    const orders = this.data?.orders || [];
  const out: Array<{ hora: string; usuario?: string; variante: string; talla?: string; cantidad: number; unit: number; total: number }> = [];
    for (const o of orders) {
      console.log('Venta:', o); // Ver datos completos de la venta
      const hora = new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const usuarioStr = o.usuarioNombre;
      console.log('Items de la venta:', o.items); // Ver estructura completa de items
      for (const it of (o.items || [])) {
        console.log('Item individual:', it); // Ver campos de cada item
        const modelo = it.modelo;
        const talla = it.talla || '—'; // Usar el guión como valor por defecto si no hay talla
        const qty = Number(it.qty || 0);
        const unit = Number(it.unitPrice || 0);
        // Total de esta línea (qty * precio)
        const total = qty * unit;
        const variante = modelo;
        out.push({
          hora,
          usuario: usuarioStr,
          variante,
          talla,
          cantidad: qty,
          unit,
          total
        });
      }
    }
    this.lineasDia = out;
  }

  get totalDia(): number {
    return this.lineasDia.reduce((s, x) => s + (Number(x.total)||0), 0);
  }
}
