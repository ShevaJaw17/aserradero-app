# Aserradero App

Aplicación móvil híbrida (Android/iOS) para la gestión de un aserradero, construida con **Angular + Ionic + Capacitor**.

## Módulos

- **Dashboard**: resumen de troncos, producción, pedidos, facturación y mantenimiento.
- **Troncos**: registro de troncos (especie, diámetro, longitud, volumen, proveedor, estado).
- **Producción**: tablas, vigas, viguetas, listones (dimensiones, cantidad, volumen, operador, turno).
- **Pedidos**: clientes, ítems, totales, estados.
- **Facturación**: facturas con subtotal, IVA y total; estados de pago.
- **Mantenimiento**: preventivo/correctivo por máquina, costos, próximo servicio.

## Autenticación

La autenticación se delega al backend (`POST /auth/login`). No existen usuarios demo locales. Los usuarios y roles se administran en el backend.

## Ejecutar en navegador

```bash
npm install
ionic serve
```

## Compilar para móvil

```bash
ionic build
npx cap sync
# Android
npx cap open android
# iOS (requiere macOS + Xcode)
npx cap open ios
```

## Sincronización en la nube

Los datos se guardan localmente (localStorage) para trabajo offline. El punto de integración con la nube está en `src/app/services/sync.service.ts` (`syncPending`) y en el método `sincronizar()` del Dashboard. Reemplaza la función de push por llamadas HTTP a tu backend (Firebase, Supabase, REST) y marca los registros sincronizados con `marcarSincronizados`.

## Backend REST (nube)

El backend está en el repositorio hermano `aserradero-backend` (Node.js + Express).

```bash
# En otra terminal
cd ../aserradero-backend
npm install
npm start   # http://localhost:3000
```

Configura la URL del API en `src/environments/environment.ts` (`apiUrl`).
En producción (`environment.prod.ts`) apunta a tu backend desplegado.

La sincronización se dispara desde el botón de nube en el Dashboard (`CloudSyncService.syncAll`).

## Estructura

```
src/app/
  models/        # interfaces de datos
  services/      # storage, auth, sync y servicios por módulo
  guards/        # auth guard
  pages/         # páginas (lazy loaded)
```
