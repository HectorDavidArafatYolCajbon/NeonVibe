import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: any = null;
  isAdminView = false; // 👈 Modo “navbar reducido” del admin
  private userSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    // 🧠 Suscripción al usuario logueado
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.checkIfAdminView();
    });

    // 🧠 Suscripción a los cambios de ruta
    this.routeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.checkIfAdminView());
  }

  // 🔍 Detectar si el usuario es admin y está en /admin
  private checkIfAdminView(): void {
    const user = this.currentUser;
    const isAdminUser =
      user &&
      (user.id_rol === 1 ||
        user.id_usuario === 1 ||
        user.role === 'admin' ||
        (typeof user.rol === 'string' && user.rol.toLowerCase() === 'admin') ||
        (typeof user.rol === 'object' && user.rol.nombre_rol?.toLowerCase() === 'admin'));

    const isAdminRoute = this.router.url.startsWith('/admin');
    this.isAdminView = isAdminUser && isAdminRoute;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']).then(() => window.location.reload());
      },
      error: (error) => {
        console.error('Error durante el logout:', error);
        this.router.navigate(['/']).then(() => window.location.reload());
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }
}
