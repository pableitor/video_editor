# Editor de Video Web

Una aplicación web para cargar, editar y reproducir videos MP4 con funcionalidades avanzadas de control de reproducción y edición básica.

## Características

### 🎥 Carga de Video
- Carga de archivos MP4 desde el equipo local
- Interfaz drag & drop intuitiva
- Soporte para selección manual de archivos

### ▶️ Controles de Reproducción
- **Play/Pause**: Control básico de reproducción
- **Frame by Frame**: Navegación cuadro por cuadro (adelante/atrás)
- **Control de Velocidad**: 0.25x, 0.5x, 1x, 1.5x, 2x
- **Timeline interactiva**: Navegación directa por clic

### ✂️ Funciones de Edición
- **Marcar Inicio/Final**: Selección de segmentos específicos
- **Vista previa del corte**: Visualización del segmento seleccionado
- **Timeline visual**: Indicador gráfico del segmento seleccionado
- **Resetear selección**: Limpiar marcadores

### ⌨️ Atajos de Teclado
- **Espacio**: Play/Pause
- **Flecha Izquierda**: Frame anterior
- **Flecha Derecha**: Frame siguiente  
- **Ctrl + I**: Marcar inicio
- **Ctrl + O**: Marcar final

## Estructura de Archivos

```
video_editor/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos y presentación
├── script.js       # Lógica y comportamiento
└── README.md       # Documentación
```

## Uso

1. **Abrir la aplicación**: Abre `index.html` en tu navegador web
2. **Cargar video**: Haz clic en "Seleccionar Video" o arrastra un archivo MP4
3. **Reproducir**: Usa los controles de reproducción para navegar por el video
4. **Editar**: 
   - Navega al punto de inicio deseado y haz clic en "Marcar Inicio"
   - Navega al punto final y haz clic en "Marcar Final"
   - El segmento se mostrará visualmente en la timeline
5. **Cortar**: Haz clic en "Cortar Segmento" para preparar la descarga

## Limitaciones Técnicas

- **Corte real de video**: La funcionalidad actual simula el corte. Para implementar corte real de segmentos se requiere:
  - Procesamiento en servidor con FFmpeg
  - O uso de FFmpeg.js en el cliente (librería adicional)
- **Formatos soportados**: Solo MP4 por simplicidad
- **Tamaño de archivo**: Limitado por la memoria del navegador

## Tecnologías Utilizadas

- **HTML5**: Estructura y elemento `<video>`
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript ES6+**: Lógica de la aplicación
- **Canvas API**: Para futuras mejoras de procesamiento

## Compatibilidad

- Navegadores modernos con soporte HTML5
- Chrome, Firefox, Safari, Edge (versiones recientes)
- Responsive design para dispositivos móviles

## Posibles Mejoras Futuras

1. **Corte real de video** con FFmpeg.js
2. **Múltiples formatos** de video (AVI, MOV, etc.)
3. **Efectos básicos** (filtros, transiciones)
4. **Exportación en diferentes calidades**
5. **Guardado de proyectos** en localStorage
6. **Vista de forma de onda** para audio
7. **Zoom en timeline** para mayor precisión
