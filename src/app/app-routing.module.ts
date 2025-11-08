import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DisenoSportComponent } from './pages/diseno-sport/diseno-sport.component';
import { AccesoriosSportComponent } from './pages/accesorios-sport/accesorios-sport.component';
import { DeLoNuevoEnModaComponent } from './pages/de-lo-nuevo-en-moda/de-lo-nuevo-en-moda.component';
import { VisteteATuEstiloComponent } from './pages/vistete-a-tu-estilo/vistete-a-tu-estilo.component';
import { HombresComponent } from './pages/hombres/hombres.component';
import { MujeresComponent } from './pages/mujeres/mujeres.component';
import { AccesoriosComponent } from './pages/accesorios/accesorios.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';

// 🔹 Sección Hombres
import { CamisasComponent } from './pages/hombres/camisas/camisas.component';
import { PantalonesComponent } from './pages/hombres/pantalones/pantalones.component';
import { ZapatosHombresComponent } from './pages/hombres/zapatos-hombres/zapatos-hombres.component';

// 🔹 Sección Mujeres
import { VestidosComponent } from './pages/mujeres/vestidos/vestidos.component';
import { BlusasComponent } from './pages/mujeres/blusas/blusas.component';
import { ZapatosMujeresComponent } from './pages/mujeres/zapatos-mujeres/zapatos-mujeres.component';

// 🔹 Admin
import { AdminComponent } from './pages/admin/admin.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component'; // 👈 agregado
import { ProductosComponent } from './pages/admin/productos/productos.component';
import { ReportesComponent } from './pages/admin/reportes/reportes.component';
import { VentasDiaComponent } from './pages/admin/reportes/ventas-dia/ventas-dia.component';
import { MovimientosInventarioComponent } from './pages/admin/reportes/movimientos-inventario/movimientos-inventario.component';
import { MovimientosVentasComponent } from './pages/admin/reportes/movimientos-ventas/movimientos-ventas.component';
import { VentasMesComponent } from './pages/admin/reportes/ventas-mes/ventas-mes.component';
import { GananciasMesComponent } from './pages/admin/reportes/ganancias-mes/ganancias-mes.component';

const routes: Routes = [
  // 🔹 Página de inicio
  { path: '', component: HomeComponent, title: 'MiTienda - Ropa' },

  // 🔹 Página de login
  { path: 'login', component: LoginComponent, title: 'Iniciar sesión' },

  // 🔹 Rutas de íconos
  { path: 'carrito', component: CarritoComponent, title: 'Carrito de compras' },
  { path: 'favoritos', component: FavoritosComponent, title: 'Favoritos' },

  // 🔹 Rutas de categorías principales
  { path: 'diseno-sport', component: DisenoSportComponent, title: 'Diseños Sport' },
  { path: 'accesorios-sport', component: AccesoriosSportComponent, title: 'Accesorios Sport' },
  { path: 'de-lo-nuevo-en-moda', component: DeLoNuevoEnModaComponent, title: 'De lo nuevo en moda' },
  { path: 'vistete-a-tu-estilo', component: VisteteATuEstiloComponent, title: 'Vístete a tu estilo' },

  // 🔹 Nuevas rutas del navbar
  { path: 'hombres', component: HombresComponent, title: 'Ropa para Hombres' },
  { path: 'mujeres', component: MujeresComponent, title: 'Ropa para Mujeres' },
  { path: 'accesorios', component: AccesoriosComponent, title: 'Accesorios' },

  // 🔹 HOMBRES
  { path: 'hombres/camisas', component: CamisasComponent, title: 'Camisas - Hombres' },
  { path: 'hombres/pantalones', component: PantalonesComponent, title: 'Pantalones - Hombres' },
  { path: 'hombres/zapatos', component: ZapatosHombresComponent, title: 'Zapatos - Hombres' },

  // 🔹 MUJERES
  { path: 'mujeres/vestidos', component: VestidosComponent, title: 'Vestidos - Mujeres' },
  { path: 'mujeres/blusas', component: BlusasComponent, title: 'Blusas - Mujeres' },
  { path: 'mujeres/zapatos', component: ZapatosMujeresComponent, title: 'Zapatos - Mujeres' },

  { path: 'ofertas', component: OfertasComponent, title: 'Ofertas' },
  { path: 'marcas', component: MarcasComponent, title: 'Marcas' },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/usuarios', component: UsuariosComponent },
  { path: 'admin/productos', component: ProductosComponent },

  // 🔹 ADMIN con subrutas
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'usuarios', component: UsuariosComponent, title: 'Gestión de Usuarios' },
      { path: 'reportes', component: ReportesComponent, title: 'Reportes' },
      { path: 'reportes/ventas-dia', component: VentasDiaComponent, title: 'Ventas del día' },
      { path: 'reportes/movimientos-inventario', component: MovimientosInventarioComponent, title: 'Movimientos de Inventario' },
      { path: 'reportes/movimientos-ventas', component: MovimientosVentasComponent, title: 'Movimientos de Ventas' },
      { path: 'reportes/ventas-mes', component: VentasMesComponent, title: 'Ventas por Mes' },
      { path: 'reportes/ganancias-mes', component: GananciasMesComponent, title: 'Ganancias por Mes' },
    ],
  },

  // 🔹 Cualquier otra ruta redirige al inicio
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
