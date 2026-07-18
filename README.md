# 🎁 Web de Ánimo para Maria

Esta es una aplicación web especial diseñada para ser instalada como una App en su iPhone.

## ✨ Qué tiene la app

- **Pantalla de bienvenida** con animación al abrirla.
- **Contador de días juntos** (desde el 1 de enero de 2026 — se puede cambiar en `src/components/DaysCounter.tsx`).
- **Galería de recuerdos** con dos modos: fotos de Marii y fotos de Baby FranVi, con frases de ánimo.
- **Mensaje del día**: una frase distinta cada día, escrita por Fran.
- **Reproductor de música** estilo Spotify: elegir canción, pausar, saltar, barra de progreso, y enlace a Salistre en Spotify.
- **Enlaces a Instagram** de los dos.

## 📸 Cómo añadir fotos

1. Guarda las fotos que quieras mostrar en la carpeta `public/images` (fotos de Marii) o `public/bebes` (fotos de bebé).
2. Asegúrate de que los nombres sean sencillos (ej: `foto1.jpg`, `viaje.png`).
3. Sube los cambios a GitHub (commit y push). Vercel actualizará la web automáticamente.

> **Nota:** Las carpetas ya están creadas. Solo tienes que arrastrar ahí los archivos.

## 🎵 Cómo añadir canciones

1. Arrastra el archivo de la canción (`.mp3`, `.m4a`, `.wav` u `.ogg`) a la carpeta `public/music`.
2. Nombra el archivo como `Artista - Título.mp3` (ej: `Salistre - Contigo.mp3`) para que el reproductor muestre bien el artista y el título.
3. Sube los cambios a GitHub (commit y push). La canción aparecerá sola en la lista del reproductor — no hay que tocar código.

## 🚀 Cómo publicar en Internet (Vercel)

Si aún no lo has hecho:
1. Sube este código a tu GitHub.
2. Ve a [Vercel.com](https://vercel.com) y crea una cuenta nueva ("Hobby" es gratis).
3. Dale a **"Add New Project"** y selecciona este repositorio de GitHub.
4. Dale a **"Deploy"**. ¡Listo!
5. Vercel te dará un enlace (algo como `maria-animo.vercel.app`).

## 📱 Cómo instalar en su iPhone

Para que quede como una App real:
1. Abre el enlace de Vercel en **Safari** en su iPhone.
2. Toca el botón **Compartir** (el cuadrado con la flecha hacia arriba).
3. Busca y selecciona **"Añadir a pantalla de inicio"**.
4. ¡Aparecerá el icono en su menú como una app más!

## 🛠️ Desarrollo Local (Opcional)

Si quieres probarla en tu ordenador antes (necesitas Node.js):

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Arranca el servidor:
   ```bash
   npm run dev
   ```
3. Entra en `http://localhost:3000`.
