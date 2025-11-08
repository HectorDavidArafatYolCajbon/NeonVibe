import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importa tus componentes
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { HeroComponent } from './home/hero/hero.component';
import { ProductsGridComponent } from './home/products-grid/products-grid.component';
import { HomeComponent } from './pages/home/home.component';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoginComponent } from './pages/login/login.component';
import { ModalProductoComponent } from './pages/admin/productos/modal-producto.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisenoSportComponent } from './pages/diseno-sport/diseno-sport.component';
import { AccesoriosSportComponent } from './pages/accesorios-sport/accesorios-sport.component';
import { DeLoNuevoEnModaComponent } from './pages/de-lo-nuevo-en-moda/de-lo-nuevo-en-moda.component';
import { VisteteATuEstiloComponent } from './pages/vistete-a-tu-estilo/vistete-a-tu-estilo.component';
import { HombresComponent } from './pages/hombres/hombres.component';
import { MujeresComponent } from './pages/mujeres/mujeres.component';
import { AccesoriosComponent } from './pages/accesorios/accesorios.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { CamisasComponent } from './pages/hombres/camisas/camisas.component';
import { PantalonesComponent } from './pages/hombres/pantalones/pantalones.component';
import { ZapatosHombresComponent } from './pages/hombres/zapatos-hombres/zapatos-hombres.component';
import { VestidosComponent } from './pages/mujeres/vestidos/vestidos.component';
import { BlusasComponent } from './pages/mujeres/blusas/blusas.component';
import { ZapatosMujeresComponent } from './pages/mujeres/zapatos-mujeres/zapatos-mujeres.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { CrearUsuarioDialogComponent } from './pages/admin/usuarios/crear-usuario-dialog/crear-usuario-dialog.component';
import { CrearUsuarioDialogComponent as CrearUsuarioDialogPublicComponent } from './pages/crear-usuario-dialog/crear-usuario-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminComponent } from './pages/admin/admin.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { ProductosComponent } from './pages/admin/productos/productos.component';
import { ReportesComponent } from './pages/admin/reportes/reportes.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    ProductsGridComponent,
    HomeComponent,
    LoginComponent,
    DisenoSportComponent,
    AccesoriosSportComponent,
    DeLoNuevoEnModaComponent,
    VisteteATuEstiloComponent,
    HombresComponent,
    MujeresComponent,
    AccesoriosComponent,
    OfertasComponent,
    MarcasComponent,
    CamisasComponent,
    PantalonesComponent,
    ZapatosHombresComponent,
    VestidosComponent,
    BlusasComponent,
    ZapatosMujeresComponent,
    CarritoComponent,
    FavoritosComponent,
    CrearUsuarioDialogComponent,
    CrearUsuarioDialogPublicComponent,
    AdminComponent,
    UsuariosComponent,
    ProductosComponent,
    ModalProductoComponent,
  ReportesComponent,

 ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
