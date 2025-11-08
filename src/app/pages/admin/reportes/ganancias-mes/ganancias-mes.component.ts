import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../../services/reportes.service';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-ganancias-mes',
  templateUrl: './ganancias-mes.component.html',
  styleUrls: ['./ganancias-mes.component.scss']
})
export class GananciasMesComponent implements OnInit {
  private chart: Chart | null = null;

  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Ganancias (Q)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      tension: 0.1
    }]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
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
        text: 'Ganancias Totales por Mes'
      }
    }
  };

  cargando = true;
  error = '';

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarGananciasPorMes();
  }

  cargarGananciasPorMes(): void {
    this.cargando = true;
    this.reportesService.gananciasTotalesPorMes().subscribe({
      next: (data) => {
        if (this.chart) {
          this.chart.destroy();
        }

        const canvas = document.getElementById('gananciasMesChart') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          this.chart = new Chart(ctx, {
            type: this.lineChartType,
            data: {
              labels: data.meses,
              datasets: [{
                data: data.ganancias,
                label: 'Ganancias (Q)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1
              }]
            },
            options: this.lineChartOptions
          });
        }

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar ganancias por mes:', error);
        this.error = 'Error al cargar los datos';
        this.cargando = false;
      }
    });
  }
}
