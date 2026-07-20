/* ============================================================================
   NUESTRA HISTORIA — SCRIPT PRINCIPAL
   Todo el contenido editable vive en el objeto CONFIG de aquí abajo.
   No hace falta tocar el resto del archivo para personalizar la página.
   ============================================================================ */

/* ----------------------------------------------------------------------
   1. CONFIGURACIÓN — EDITA AQUÍ TUS DATOS
   ---------------------------------------------------------------------- */
const CONFIG = {

  // Fecha en la que "comenzó" la historia (formato AAAA-MM-DDTHH:MM:SS)
  startDate: "2025-10-10T00:00:00",

  // Ruta de la canción (colócala dentro de la carpeta /music)
  musicSrc: "music/cancion.mp3",

  // Mensaje gigante de la escena final
  finalMessage: "Te amo, hoy y siempre",
  finalSub: "Gracias por escribir esta historia conmigo ❤️",

  // Duración por defecto de cada escena (milisegundos)
  defaultDuration: 6000,

  // Secuencia de escenas de la "película".
  // type: "title" | "text" | "photo" | "climax"
  scenes: [
    {
      type: "title",
      title: "Nuestra Historia",
      text: "Una pequeña colección de momentos que se sienten enormes.",
      duration: 6500,
    },
    {
      type: "photo",
      src: "img/foto1.jpg",
      caption: "El comienzo",
      kenBurns: "kb-1",
      duration: 6000,
    },
    {
      type: "text",
      text: "Desde ese día, todo empezó a tener otro color.",
      style: "type", // type | fade | glow
      duration: 5200,
    },
    {
      type: "photo",
      src: "img/foto2.jpg",
      caption: "Risas que no se olvidan",
      kenBurns: "kb-2",
      duration: 6000,
    },
    {
      type: "photo",
      src: "img/foto3.jpg",
      caption: "Pequeños momentos, grandes recuerdos",
      kenBurns: "kb-3",
      duration: 6000,
    },
    {
      type: "text",
      text: "Cada instante contigo se convirtió en mi favorito.",
      style: "fade",
      duration: 5000,
    },
    {
      type: "climax",
      src: "img/foto4.jpg",
      caption: "Este momento, para siempre",
      duration: 7000,
    },
    {
      type: "text",
      text: "Y hoy, sigo eligiéndote a ti.",
      style: "glow",
      duration: 5000,
    },
  ],
};

/* ----------------------------------------------------------------------
   2. REFERENCIAS AL DOM
   ---------------------------------------------------------------------- */
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const stage = document.getElementById("scene-stage");
const counterWidget = document.getElementById("counter-widget");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const particlesLayer = document.getElementById("particles-layer");
const starsCanvas = document.getElementById("stars-canvas");

let sceneIndex = 0;
let sceneTimer = null;
let ambientIntervals = [];

/* ----------------------------------------------------------------------
   3. INICIO — pantalla de bienvenida (resuelve el bloqueo de autoplay)
   ---------------------------------------------------------------------- */
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden-start");
  startAmbientEffects();
  startMusic();
  counterWidget.classList.remove("hidden");
  musicToggle.classList.remove("hidden");
  startExperience();
});

function startMusic() {
  music.volume = 0.75;
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // El navegador bloqueó el audio: se deja pausado, el usuario
      // puede activarlo manualmente con el botón de música.
      musicToggle.classList.add("muted");
    });
  }
}

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicToggle.classList.remove("muted");
    musicIcon.textContent = "♪";
  } else {
    music.pause();
    musicToggle.classList.add("muted");
    musicIcon.textContent = "𝄽";
  }
});

/* ----------------------------------------------------------------------
   4. CONSTRUCCIÓN DE ESCENAS
   ---------------------------------------------------------------------- */
function buildSceneElement(scene) {
  const el = document.createElement("section");
  el.className = "scene";

  if (scene.type === "title") {
    el.innerHTML = `
      <h1 class="scene-title">${scene.title}</h1>
      <p class="scene-text"></p>
    `;
    el.dataset.typeText = scene.text;
    el.dataset.textStyle = "type";
  }

  if (scene.type === "text") {
    el.classList.add("scene-text-only");
    el.innerHTML = `<p class="scene-text"></p>`;
    el.dataset.typeText = scene.text;
    el.dataset.textStyle = scene.style || "fade";
  }

  if (scene.type === "photo" || scene.type === "climax") {
    el.classList.add("scene-photo");
    const tilt = (Math.random() * 4 - 2).toFixed(1) + "deg";
    const kb = scene.kenBurns || "kb-1";
    el.innerHTML = `
      <div class="frame" style="--tilt:${tilt}">
        ${scene.type === "climax" ? '<div class="sparkle-ring"></div>' : ""}
        <img class="${kb}" src="${scene.src}" alt="${scene.caption || "foto"}"
             onerror="this.replaceWith(createPlaceholder('${scene.src}'))">
      </div>
      <div class="reflection" style="--tilt:${tilt}"></div>
      <p class="frame-caption">${scene.caption || ""}</p>
    `;
    if (scene.type === "climax") el.classList.add("scene-climax");
  }

  return el;
}

// Marcador de posición elegante cuando aún no existe la foto real
function createPlaceholder(originalSrc) {
  const div = document.createElement("div");
  div.className = "placeholder kb-1";
  div.innerHTML = `
    <span class="placeholder-icon">🤍</span>
    <span>Agrega tu foto en<br><strong>${originalSrc}</strong></span>
  `;
  return div;
}
window.createPlaceholder = createPlaceholder; // usado por el onerror inline

/* ----------------------------------------------------------------------
   5. ANIMACIONES DE TEXTO (máquina de escribir / fade / glow)
   ---------------------------------------------------------------------- */
function animateText(container, text, style) {
  const target = container.querySelector(".scene-text") || container;

  if (style === "type") {
    target.classList.add("type-text");
    target.innerHTML = "";
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    let i = 0;
    const chars = text.split("");
    const typing = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(typing);
        return;
      }
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = chars[i];
      span.style.animationDelay = "0s";
      target.appendChild(span);
      requestAnimationFrame(() => (span.style.opacity = "1"));
      i++;
    }, 45);
    target.appendChild(cursor);
  }

  if (style === "fade") {
    target.classList.add("fade-in-words");
    target.innerHTML = text
      .split(" ")
      .map(
        (word, idx) =>
          `<span class="fade-word" style="animation-delay:${idx * 0.12}s">${word}&nbsp;</span>`
      )
      .join("");
  }

  if (style === "glow") {
    target.classList.add("glow-text");
    target.textContent = text;
  }
}

/* ----------------------------------------------------------------------
   6. SECUENCIADOR PRINCIPAL DE ESCENAS
   ---------------------------------------------------------------------- */
function startExperience() {
  sceneIndex = 0;
  stage.innerHTML = "";
  showScene(sceneIndex);
}

function showScene(index) {
  const scenes = CONFIG.scenes;

  if (index >= scenes.length) {
    showFinalScene();
    return;
  }

  const sceneData = scenes[index];
  const el = buildSceneElement(sceneData);
  stage.innerHTML = "";
  stage.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.add("active");

    if (sceneData.type === "title" || sceneData.type === "text") {
      animateText(el, el.dataset.typeText, el.dataset.textStyle);
    }

    if (sceneData.type === "climax") {
      burstHeartsFrom(window.innerWidth / 2, window.innerHeight / 2);
      buildSparkleRing(el.querySelector(".sparkle-ring"));
    }
  });

  clearTimeout(sceneTimer);
  sceneTimer = setTimeout(() => {
    showScene(index + 1);
  }, sceneData.duration || CONFIG.defaultDuration);
}

/* ----------------------------------------------------------------------
   7. ESCENA FINAL — clímax + lluvia de corazones + reinicio
   ---------------------------------------------------------------------- */
function showFinalScene() {
  const el = document.createElement("section");
  el.className = "scene scene-final";
  el.innerHTML = `
    <p class="final-message">${CONFIG.finalMessage}</p>
    <p class="final-sub">${CONFIG.finalSub}</p>
    <button id="replay-btn" class="replay-btn">Ver de nuevo ↻</button>
  `;
  stage.innerHTML = "";
  stage.appendChild(el);
  requestAnimationFrame(() => el.classList.add("active"));

  // Lluvia intensa de corazones durante el final
  const heartRain = setInterval(() => spawnHeart(), 180);
  ambientIntervals.push(heartRain);

  document.getElementById("replay-btn").addEventListener("click", () => {
    clearInterval(heartRain);
    stage.innerHTML = "";
    startExperience();
  });
}

/* ----------------------------------------------------------------------
   8. PARTÍCULAS: corazones flotantes, pétalos, chispas, explosiones
   ---------------------------------------------------------------------- */
function spawnHeart() {
  const heart = document.createElement("span");
  heart.className = "particle-heart";
  heart.textContent = Math.random() > 0.5 ? "❤" : "♥";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
  heart.style.fontSize = 14 + Math.random() * 18 + "px";
  const duration = 7 + Math.random() * 6;
  heart.style.animationDuration = duration + "s";
  particlesLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 200);
}

function spawnPetal() {
  const petal = document.createElement("span");
  petal.className = "particle-petal";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
  const duration = 8 + Math.random() * 6;
  petal.style.animationDuration = duration + "s";
  particlesLayer.appendChild(petal);
  setTimeout(() => petal.remove(), duration * 1000 + 200);
}

function burstHeartsFrom(x, y) {
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("span");
    h.className = "particle-explode-heart";
    h.textContent = "❤";
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 140;
    h.style.setProperty("--sx", Math.cos(angle) * dist + "px");
    h.style.setProperty("--sy", Math.sin(angle) * dist + "px");
    h.style.left = x + "px";
    h.style.top = y + "px";
    particlesLayer.appendChild(h);
    setTimeout(() => h.remove(), 1200);
  }
  // chispas doradas junto con los corazones
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "particle-spark";
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 100;
    s.style.setProperty("--sx", Math.cos(angle) * dist + "px");
    s.style.setProperty("--sy", Math.sin(angle) * dist + "px");
    s.style.left = x + "px";
    s.style.top = y + "px";
    particlesLayer.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
}

function buildSparkleRing(container) {
  if (!container) return;
  container.innerHTML = "";
  const count = 10;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    const angle = (i / count) * Math.PI * 2;
    const radiusX = 55;
    const radiusY = 60;
    s.style.left = 50 + Math.cos(angle) * radiusX + "%";
    s.style.top = 50 + Math.sin(angle) * radiusY + "%";
    s.style.animationDelay = i * 0.15 + "s";
    container.appendChild(s);
  }
}

// Generadores ambientales: corazones y pétalos flotando durante toda la experiencia
function startAmbientEffects() {
  const heartInt = setInterval(spawnHeart, 1400);
  const petalInt = setInterval(spawnPetal, 2600);
  ambientIntervals.push(heartInt, petalInt);
  initStars();
  initParallax();
}

/* ----------------------------------------------------------------------
   9. CIELO ESTRELLADO (canvas)
   ---------------------------------------------------------------------- */
function initStars() {
  const ctx = starsCanvas.getContext("2d");
  let stars = [];

  function resize() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    stars.forEach((star) => {
      const twinkle = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248, 236, 217, ${0.25 + twinkle * 0.6})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}

/* ----------------------------------------------------------------------
   10. EFECTO PARALLAX SUAVE (fondo + bokeh se mueven con el puntero)
   ---------------------------------------------------------------------- */
function initParallax() {
  const bokeh = document.querySelector(".bokeh-layer");
  const fog = document.querySelector(".fog-layer");

  function applyShift(nx, ny) {
    bokeh.style.transform = `translate(${nx * 12}px, ${ny * 12}px)`;
    fog.style.transform = `translate(${nx * -8}px, ${ny * -8}px)`;
  }

  window.addEventListener("mousemove", (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    applyShift(nx, ny);
  });

  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma === null) return;
    const nx = Math.max(-0.5, Math.min(0.5, e.gamma / 60));
    const ny = Math.max(-0.5, Math.min(0.5, e.beta / 90));
    applyShift(nx, ny);
  });
}

/* ----------------------------------------------------------------------
   11. CONTADOR "HAN PASADO X DÍAS..." (días / horas / min / seg)
   ---------------------------------------------------------------------- */
function updateCounter() {
  const start = new Date(CONFIG.startDate).getTime();
  const now = Date.now();
  let diff = Math.max(0, now - start);

  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  diff -= days * day;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * 1000 * 60;
  const secs = Math.floor(diff / 1000);

  document.getElementById("c-days").textContent = days;
  document.getElementById("c-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("c-mins").textContent = String(mins).padStart(2, "0");
  document.getElementById("c-secs").textContent = String(secs).padStart(2, "0");
}
setInterval(updateCounter, 1000);
updateCounter();
