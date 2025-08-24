// Reproductor de Video - Lógica básica sin edición (sin control de velocidad personalizado)

// Elementos del DOM
let videoPlayer;
const uploadArea = document.getElementById('uploadArea');
const uploadBtn = document.getElementById('uploadBtn');
const videoInput = document.getElementById('videoInput');
const videoSection = document.getElementById('videoSection');
const playPauseBtn = document.getElementById('playPauseBtn');
const frameBackBtn = document.getElementById('frameBackBtn');
const frameForwardBtn = document.getElementById('frameForwardBtn');
const timeline = document.getElementById('timeline');
const playhead = document.getElementById('playhead');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');

let isPlaying = false;

// Stepping adaptativo: tamaño de paso en segundos (fallback 30fps)
let frameStepSeconds = 1 / 30;
let frameStepCalibrated = false;

// Opcional: encajar el tiempo al grid de frames para mayor precisión
let snapToFrameGrid = true;
let snapMode = 'nearest'; // 'nearest' | 'directional'

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
  videoPlayer = document.getElementById('videoPlayer');
  initializeEventListeners();
});

function initializeEventListeners() {
  // Subida de video
  uploadBtn.addEventListener('click', () => videoInput.click());
  videoInput.addEventListener('change', handleVideoUpload);

  // Drag & Drop en el área de subida
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);

  // Eventos del video
  videoPlayer.addEventListener('loadedmetadata', onVideoLoaded);
  videoPlayer.addEventListener('timeupdate', updatePlayhead);
  videoPlayer.addEventListener('ended', onVideoEnded);

  // Controles de reproducción
  playPauseBtn.addEventListener('click', togglePlayPause);
  frameBackBtn.addEventListener('click', frameBackward);
  frameForwardBtn.addEventListener('click', frameForward);

  // Timeline (seek)
  timeline.addEventListener('click', seekToPosition);
  if (videoPlayer) videoPlayer.addEventListener('wheel', handleWheel, { passive: false });
  if (timeline) timeline.addEventListener('wheel', handleWheel, { passive: false });

  // Atajos de teclado
  document.addEventListener('keydown', handleShortcuts, { passive: false });

  // Prevenir comportamiento por defecto global en drag & drop
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => e.preventDefault());

  // UI de snap
  const snapToggleEl = document.getElementById('snapToggle');
  const snapModeEl = document.getElementById('snapMode');
  if (snapToggleEl) {
    snapToggleEl.checked = !!snapToFrameGrid;
    snapToggleEl.addEventListener('change', () => {
      snapToFrameGrid = snapToggleEl.checked;
    });
  }
  if (snapModeEl) {
    snapModeEl.value = snapMode;
    snapModeEl.addEventListener('change', () => {
      snapMode = snapModeEl.value;
    });
  }
}

// Carga de video
function handleVideoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type !== 'video/mp4') {
    alert('Por favor, selecciona un archivo MP4 válido.');
    return;
  }
  loadVideo(file);
}

function handleDragOver(event) {
  event.preventDefault();
  uploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
  event.preventDefault();
  uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
  event.preventDefault();
  uploadArea.classList.remove('dragover');
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'video/mp4') {
      loadVideo(file);
    } else {
      alert('Por favor, arrastra un archivo MP4 válido.');
    }
  }
}

function loadVideo(file) {
  const url = URL.createObjectURL(file);
  videoPlayer.src = url;
  videoSection.style.display = 'block';
  // Reset estado de UI
  playPauseBtn.textContent = '▶️';
  isPlaying = false;
  videoPlayer.playbackRate = 1; // usar menú nativo del reproductor para cambiar velocidad
  currentTimeSpan.textContent = '00:00';
  totalTimeSpan.textContent = '00:00';
}

// Eventos del video
function onVideoLoaded() {
  const duration = videoPlayer.duration;
  totalTimeSpan.textContent = formatTime(duration);
  updateTimeline();
  // Intentar calibrar el paso de frame usando requestVideoFrameCallback
  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    calibrateFrameStep().catch(() => {/* fallback silencioso */});
  } else {
    frameStepSeconds = 1 / 30;
    frameStepCalibrated = false;
  }
}

function onVideoEnded() {
  playPauseBtn.textContent = '▶️';
  isPlaying = false;
}

// Controles
function togglePlayPause() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playPauseBtn.textContent = '⏸️';
    isPlaying = true;
  } else {
    videoPlayer.pause();
    playPauseBtn.textContent = '▶️';
    isPlaying = false;
  }
}

function frameBackward() {
  if (!videoPlayer.duration) return;
  const step = frameStepSeconds || (1 / 30);
  let newTime = Math.max(0, videoPlayer.currentTime - step);
  if (snapToFrameGrid) {
    newTime = snapMode === 'directional' ? snapTimeToGridDirectional(newTime, -1) : snapTimeToGrid(newTime);
  }
  videoPlayer.currentTime = newTime;
}

function frameForward() {
  if (!videoPlayer.duration) return;
  const step = frameStepSeconds || (1 / 30);
  let newTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + step);
  if (snapToFrameGrid) {
    newTime = snapMode === 'directional' ? snapTimeToGridDirectional(newTime, +1) : snapTimeToGrid(newTime);
  }
  videoPlayer.currentTime = newTime;
}

// Timeline
function updateTimeline() {
  updatePlayhead();
}

function updatePlayhead() {
  if (!videoPlayer.duration) return;
  const progress = videoPlayer.currentTime / videoPlayer.duration;
  playhead.style.left = progress * 100 + '%';
  currentTimeSpan.textContent = formatTime(videoPlayer.currentTime);
}

function seekToPosition(event) {
  if (!videoPlayer.duration) return;
  const rect = timeline.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const progress = clickX / rect.width;
  videoPlayer.currentTime = progress * videoPlayer.duration;
}

// Rueda del ratón con SHIFT: avanzar/retroceder un frame por paso
function handleWheel(event) {
  if (!videoPlayer || !videoPlayer.duration) return;
  // Sólo actuar si SHIFT está presionado; si no, dejar el scroll normal
  if (!event.shiftKey) return;
  // Evitar scroll de la página y hacer stepping limpio
  event.preventDefault();
  // Pausar para que el stepping sea preciso
  if (!videoPlayer.paused) {
    videoPlayer.pause();
    if (typeof playPauseBtn !== 'undefined') playPauseBtn.textContent = '▶️';
    if (typeof isPlaying !== 'undefined') isPlaying = false;
  }
  if (event.deltaY < 0) {
    // Rueda hacia arriba: siguiente frame
    frameForward();
  } else if (event.deltaY > 0) {
    // Rueda hacia abajo: frame anterior
    frameBackward();
  }
}

// Atajos de teclado
function handleShortcuts(event) {
  if (!videoPlayer || !videoPlayer.src) return;
  const code = event.code || '';

  // Prevenir scroll/acciones nativas y evitar auto-repetición para stepping
  const isFrameKey = code === 'Period' || code === 'Comma' || code === 'ArrowLeft' || code === 'ArrowRight' || event.key === '.' || event.key === ',';
  if (isFrameKey || code === 'Space' || event.key === ' ') {
    event.preventDefault();
  }
  if (isFrameKey && event.repeat) {
    return; // evita múltiples pasos por auto-repeat
  }
  // Pausar antes del stepping para mayor precisión (igual que rueda/click)
  if (isFrameKey && !videoPlayer.paused) {
    videoPlayer.pause();
    if (typeof playPauseBtn !== 'undefined') playPauseBtn.textContent = '▶️';
    if (typeof isPlaying !== 'undefined') isPlaying = false;
  }

  switch (code) {
    case 'Space':
      togglePlayPause();
      break;
    case 'ArrowRight':
      frameForward();
      break;
    case 'ArrowLeft':
      frameBackward();
      break;
    case 'Period': // '.'
      frameForward();
      break;
    case 'Comma': // ','
      frameBackward();
      break;
    default:
      // Soporte por key como fallback
      if (event.key === '.') frameForward();
      if (event.key === ',') frameBackward();
  }
}

// Utilidades
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Calibración del tamaño de frame usando requestVideoFrameCallback
async function calibrateFrameStep() {
  if (frameStepCalibrated) return;
  const supportsRVFC = typeof videoPlayer.requestVideoFrameCallback === 'function';
  if (!supportsRVFC) return;

  // Guardar estado actual
  const wasPaused = videoPlayer.paused;
  const prevTime = videoPlayer.currentTime;
  const prevMuted = videoPlayer.muted;
  const prevRate = videoPlayer.playbackRate;

  // Preparar para muestrear unos frames
  videoPlayer.muted = true;
  videoPlayer.playbackRate = 1;

  const samples = [];
  let lastMediaTime = null;
  let framesCollected = 0;
  const MAX_FRAMES = 12; // recoger ~10-12 intervalos
  const TIMEOUT_MS = 500; // evitar bloquear si no llegan frames

  let timeoutId;
  await new Promise((resolve) => {
    const onFrame = (_now, metadata) => {
      if (lastMediaTime != null) {
        const dt = metadata.mediaTime - lastMediaTime;
        if (dt > 0 && dt < 0.2) { // filtrar saltos grandes
          samples.push(dt);
        }
      }
      lastMediaTime = metadata.mediaTime;
      framesCollected++;
      if (framesCollected >= MAX_FRAMES) {
        clearTimeout(timeoutId);
        resolve();
        return;
      }
      videoPlayer.requestVideoFrameCallback(onFrame);
    };

    // Iniciar reproducción si estaba pausado
    if (videoPlayer.paused) {
      videoPlayer.play().catch(() => {/* ignorar */});
    }
    videoPlayer.requestVideoFrameCallback(onFrame);
    timeoutId = setTimeout(() => resolve(), TIMEOUT_MS);
  });

  // Restaurar estado
  if (wasPaused) {
    videoPlayer.pause();
  }
  videoPlayer.currentTime = prevTime;
  videoPlayer.muted = prevMuted;
  videoPlayer.playbackRate = prevRate;

  if (samples.length > 0) {
    // Usar mediana para robustez
    samples.sort((a, b) => a - b);
    const median = samples[Math.floor(samples.length / 2)];
    // Limitar a rango razonable
    frameStepSeconds = Math.min(Math.max(median, 1 / 120), 1 / 10);
    frameStepCalibrated = true;
  } else {
    frameStepSeconds = 1 / 30;
    frameStepCalibrated = false;
  }
}

// Encajar un tiempo al grid de frames estimado
function snapTimeToGrid(t) {
  const step = frameStepSeconds || (1 / 30);
  const clamped = Math.min(videoPlayer.duration, Math.max(0, t));
  // Redondeo al múltiplo más cercano del tamaño de frame
  const snapped = Math.round(clamped / step) * step;
  // Evitar errores de coma flotante
  return Number(Math.min(videoPlayer.duration, Math.max(0, snapped)).toFixed(6));
}

// Encaje direccional: floor para atrás, ceil para adelante
function snapTimeToGridDirectional(t, direction) {
  const step = frameStepSeconds || (1 / 30);
  const clamped = Math.min(videoPlayer.duration, Math.max(0, t));
  const ratio = clamped / step;
  const snapped = direction < 0 ? Math.floor(ratio) * step : Math.ceil(ratio) * step;
  return Number(Math.min(videoPlayer.duration, Math.max(0, snapped)).toFixed(6));
}
