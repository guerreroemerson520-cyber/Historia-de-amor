# Nuestra Historia ❤️ — Video Romántico Interactivo

## Cómo verlo
Abre `index.html` directamente en tu navegador (doble clic). No necesita servidor ni instalación.

## Estructura del proyecto
```
historia-de-amor/
├── index.html      → estructura de la página
├── style.css       → todas las animaciones y estilos
├── script.js       → CONFIG editable + lógica de la experiencia
├── img/            → tus fotografías (foto1.jpg, foto2.jpg, foto3.jpg, foto4.jpg)
└── music/          → tu canción (cancion.mp3)
```

## Personalizar en 3 pasos

1. **Fotos**: copia tus imágenes dentro de `/img` con los nombres indicados en
   `img/LEEME.txt` (o cambia las rutas en `script.js`).
2. **Música**: copia tu canción como `music/cancion.mp3` (o cambia la ruta en `script.js`).
3. **Textos y fecha**: abre `script.js` y edita el objeto `CONFIG` al principio del archivo:
   - `startDate`: la fecha desde la que se cuenta la historia.
   - `finalMessage` / `finalSub`: el mensaje gigante del final.
   - `scenes`: el arreglo con cada escena (título, fotos, frases). Puedes
     agregar, quitar o reordenar escenas libremente — cada objeto tiene su
     propio `duration` en milisegundos.

Ese es el único archivo que necesitas tocar para personalizar todo el contenido;
`style.css` y `index.html` no requieren cambios salvo que quieras ajustar colores
o tipografías (variables al inicio de `style.css`, sección `:root`).

## Qué incluye
- Pantalla de bienvenida que resuelve el bloqueo de autoplay de los navegadores.
- Fondo animado: cielo estrellado en canvas, degradado en movimiento, niebla,
  luces bokeh y parallax con el mouse / giroscopio en móvil.
- Corazones flotantes, pétalos cayendo y chispas doradas continuas.
- Marcos con efecto cristal (glassmorphism), reflejo, brillo recorriendo el
  borde y efecto Ken Burns (zoom lento) en cada fotografía.
- Textos animados: máquina de escribir, aparición palabra por palabra y brillo pulsante.
- Escena "clímax" con explosión de corazones y anillo de destellos alrededor de la foto.
- Contador permanente de días/horas/minutos/segundos desde `startDate`.
- Escena final con mensaje gigante, lluvia de corazones y botón "Ver de nuevo".
- Totalmente responsive (móvil y escritorio) y sin librerías externas
  (solo las tipografías de Google Fonts vía `<link>`).
