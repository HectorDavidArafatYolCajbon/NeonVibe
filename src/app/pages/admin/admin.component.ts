import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // ✅ Nueva variable que controla si se muestra el menú principal
  mostrarMenu: boolean = true;

  constructor(private router: Router) {
    // Detectar los cambios de ruta y actualizar visibilidad del menú
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Ocultar menú si estamos en usuarios, productos o reportes
        this.mostrarMenu = !(
          event.url.includes('/admin/usuarios') ||
          event.url.includes('/admin/productos') ||
          event.url.includes('/admin/reportes')
        );
      });
  }

  // 👇 Navegar a las vistas
  irAUsuarios() {
    this.router.navigate(['/admin/usuarios']);
  }

  irAProductos() {
    this.router.navigate(['/admin/productos']);
  }

  irAReportes() {
    this.router.navigate(['/admin/reportes']);
  }
}
