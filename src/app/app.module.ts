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
import { LoginComponent } from './pages/login/login.component';

import { FormsModule } from '@angular/forms';
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
import { CrearUsuarioDialogComponent } from './pages/crear-usuario-dialog/crear-usuario-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './pages/admin/admin.component';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios.component';
import { ProductosComponent } from './pages/admin/productos/productos.component';


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
    AdminComponent,
    UsuariosComponent,
    ProductosComponent,

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
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,  // Agregar MatDialogModule aquí
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
