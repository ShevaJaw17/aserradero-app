# Aserradero App

Aplicación móvil híbrida (Android/iOS) para la gestión de un aserradero, construida con **Angular + Ionic + Capacitor**.

## Módulos

- **Dashboard**: resumen de troncos, producción, pedidos, facturación y mantenimiento.
- **Troncos**: registro de troncos (especie, diámetro, longitud, volumen, proveedor, estado).
- **Producción**: tablas, vigas, viguetas, listones (dimensiones, cantidad, volumen, operador, turno).
- **Pedidos**: clientes, ítems, totales, estados.
- **Facturación**: facturas con subtotal, IVA y total; estados de pago.
- **Mantenimiento**: preventivo/correctivo por máquina, costos, próximo servicio.

## Usuarios demo

| Usuario   | Contraseña | Rol        |
|-----------|------------|------------|
| operador  | operador   | Operador   |
| jefe      | jefe       | Jefe       |
| admin     | admin      | Admin      |

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

## Estructura

```
src/app/
  models/        # interfaces de datos
  services/      # storage, auth, sync y servicios por módulo
  guards/        # auth guard
  pages/         # páginas (lazy loaded)
```
