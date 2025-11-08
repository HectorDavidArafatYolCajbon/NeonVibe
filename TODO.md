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

# Task: Fix Admin Products Table Design (Arreglar diseño de tabla de productos admin)

## Steps:
- [x] Clean up duplicate and conflicting styles in src/app/pages/admin/productos/productos.component.scss (remove unused sections like .form-crear, consolidate table rules).
- [x] Adjust column widths to sum 100%: ID 4%, Nombre 15%, Descripción 18%, Género 7%, Stock 12%, P.Venta 9%, P.Costo 9%, Descuento 6%, Estado 8%, Acción 12%. Add min-width where needed.
- [x] Standardize alignments and padding: Left for text columns, center/right as specified; uniform 0.75rem horizontal padding.
- [x] Enhance truncation for Nombre/Descripción: Set max-width calc(100% - 1rem), remove extra padding.
- [x] Style stock display: Inline-flex no-wrap, smaller font, max 2 lines.
- [x] Refine prices/discounts: Right-align, monospace, 'Q' prefix via ::before.
- [x] Improve badges/buttons: Better contrast, hovers.
- [x] Enhance responsive: @media max-width 768px adjustments for font/padding/min-width.
- [x] Add general enhancements: Row hovers, sticky header, borders.
- [ ] Optional: Add placeholders in HTML for empty fields (e.g., 'N/A' for prices/stock).
- [ ] Test changes: Run ng serve, browser verification.
- [x] Update TODO.md with completions.
