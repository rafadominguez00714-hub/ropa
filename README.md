# Atelier Minimal - Catálogo de Moda & Precios

Página estática minimalista para catálogo de indumentaria en **Pesos Argentinos (ARS)** con galería de imágenes interactiva y panel administrativo conectado a **Firebase Firestore**.

Optimizada para ser alojada en **Cloudflare Pages** sin consumir cuota de Cloudflare Workers (0 invocaciones de Workers).

---

## 🚀 Guía de Despliegue: GitHub y Cloudflare Pages

### Paso 1: Subir el proyecto a GitHub

1. En tu terminal o consola en la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Versión lista para producción"
   ```

2. Crea un nuevo repositorio en tu cuenta de [GitHub](https://github.com/new).

3. Vincula y sube el código:
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```

---

### Paso 2: Conectar con Cloudflare Pages

1. Inicia sesión en tu cuenta de [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. En el menú lateral, dirígete a **Workers & Pages** > haz clic en **Create application**.
3. Selecciona la pestaña **Pages** > **Connect to Git**.
4. Selecciona tu cuenta de GitHub y el repositorio que acabas de subir.
5. Configura los parámetros de compilación:
   - **Framework preset**: `Vite`
   - **Build command** (Comando de compilación): `npm run build`
   - **Build output directory** (Directorio de salida): `dist`
   - **Environment variables** (Variables de entorno opcionales):
     - `NODE_VERSION`: `20`
6. Haz clic en **Save and Deploy** (Guardar y Desplegar).

¡Listo! En menos de 1 minuto tendrás tu dominio gratis `https://tu-catalogo.pages.dev` funcionando con SSL global automático.

---

## ⚡ Optimizaciones para 0 Uso de Cloudflare Workers

Para evitar costos y límites de peticiones de Cloudflare Workers:

1. **SPA Estático Puro**: La aplicación se compila a HTML, CSS y JS puro en `dist/`. No requiere Node.js en el servidor ni funciones serverless para servir la web.
2. **`public/_redirects`**: Configurado con `/* /index.html 200` para que el enrutamiento lo resuelva Cloudflare CDN de forma nativa sin ejecutar código en Workers.
3. **`public/_headers`**: Cabeceras de caché inmutable (`Cache-Control: public, max-age=31536000, immutable`) para todos los archivos compilados (`/assets/*`). El 99% de las peticiones se sirven desde la caché de borde de Cloudflare sin gastar recursos.
4. **Caché en el Navegador**: Los datos del catálogo se almacenan en `localStorage` del cliente, permitiendo renderizado instantáneo (0ms) incluso sin conexión.
5. **Base de Datos Firebase Directa**: Las lecturas y escrituras del panel administrativo van directamente desde el navegador a Google Firebase Firestore mediante WebSockets seguros, sin necesidad de proxys ni Workers intermedios.

---

## 🔑 Contraseña del Panel de Administración

Puedes modificar la contraseña en el archivo:
`src/config/adminSecurity.ts`
```typescript
export const ADMIN_PASSWORD = 'tu_nueva_contraseña';
```
