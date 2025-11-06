# TODO: Integrar Login y Register con Backend

## Pasos del Plan

- [x] Editar `src/app/services/auth.service.ts`:
  - Actualizar login para usar /api/usuarios/login.
  - Agregar register para POST /api/usuarios/register.

- [x] Editar `src/app/pages/login/login.component.ts`:
  - Inyectar AuthService y Router.
  - En onSubmit: Llamar auth.login(email, password), on success: navigate to /carrito, on error: alert mensaje.

- [ ] Editar `src/app/pages/crear-usuario-dialog/crear-usuario-dialog.component.ts`:
  - Inyectar AuthService, Router, MatDialogRef.
  - En submitForm: Llamar auth.register(nombre, email, password, direccion, id_rol=2), on success: close dialog, optional auto-login or navigate to /login, on error: alert.

- [ ] Verificar cambios: Asegurar imports (HttpClientModule, RouterModule), error handling, y navegación.

- [ ] Pasos siguientes: Ejecutar ng serve, test register/login, verificar token stored, navigate to carrito, pre-fill en checkout.

## Notas
- Backend endpoints: /api/usuarios/register y /api/usuarios/login.
- id_rol default 2 (user).
- No tocar HTML.
- Después de cada edit, confirmar éxito.
