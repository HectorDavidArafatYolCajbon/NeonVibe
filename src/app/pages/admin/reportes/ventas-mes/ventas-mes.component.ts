import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../../services/reportes.service';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-ventas-mes',
  templateUrl: './ventas-mes.component.html',
  styleUrls: ['./ventas-mes.component.scss']
})
export class VentasMesComponent implements OnInit {
  private chart: Chart | null = null;

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Ventas Totales (Q)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'Q' + value;
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Ventas Totales por Mes'
      }
    }
  };

  cargando = true;
  error = '';

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarVentasPorMes();
  }

  cargarVentasPorMes(): void {
    this.cargando = true;
    this.reportesService.ventasTotalesPorMes().subscribe({
      next: (data) => {
        if (this.chart) {
          this.chart.destroy();
        }

        const canvas = document.getElementById('ventasMesChart') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          this.chart = new Chart(ctx, {
            type: this.barChartType,
            data: {
              labels: data.meses,
              datasets: [{
                data: data.ventas,
                label: 'Ventas Totales (Q)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            },
            options: this.barChartOptions
          });
        }

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas por mes:', error);
        this.error = 'Error al cargar los datos';
        this.cargando = false;
      }
    });
  }
}
