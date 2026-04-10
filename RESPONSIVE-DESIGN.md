# 📱 PÁGINA RESPONSIVA - Guía de Dispositivos

Tu página ahora es completamente **responsive** y funciona perfectamente en cualquier dispositivo.

## 📊 Breakpoints (Tamaños de pantalla)

| Dispositivo | Ancho | Galería | Características |
|-----------|-------|---------|-----------------|
| **Desktop** | +1024px | 6 columnas | Experiencia completa |
| **Tablet** | 768-1024px | 4 columnas | Optimizado para tablet |
| **Móvil** | 480-768px | 3 columnas | Interface adaptada |
| **Móvil pequeño** | -480px | 2 columnas | Máxima compactación |
| **Muy pequeño** | -360px | 1 columna | Pantallas muy pequeñas |

---

## 🎯 Cambios por dispositivo

### 📱 MÓVIL (480px)
- ✅ Navegación compacta
- ✅ Hero section más pequeño (40vh)
- ✅ Galería en 2-3 columnas
- ✅ **Botones de carrusel más grandes** para fácil toque
- ✅ Formulario optimizado
- ✅ **Modo vertical (portrait)** perfecto
- ✅ Deslizar fotos con gestos (swipe)

### 📱 TABLET (768px)
- ✅ Galería en 3-4 columnas
- ✅ Secciones uno debajo del otro en pantalla pequeña
- ✅ Texto más legible
- ✅ Botones de navegación optimizados

### 🖥️ DESKTOP (1024px+)
- ✅ Galería en 6 columnas
- ✅ Experiencia completa original
- ✅ Todas las características activas

---

## 🎮 Controles por dispositivo

### Cambiar fotos en el carrusel

#### 🖥️ En Desktop/Tablet
- **Flechas laterales**: Click izquierdo o derecho
- **Teclado**: Flechas izq/dch del teclado
- **ESC**: Cerrar visor

#### 📱 En Móvil
- **Deslizar**: Toca la foto y desliza hacia izquierda/derecha ⬅️➡️
- **Botones**: Tap en los botones izq/dch
- **Teclado (si existe)**: Flechas del teclado
- **Cerrar**: Tap en X o ¡fuera de la foto!

---

## 📸 Galería - Comportamiento Responsive

### Modo "Todo" (vista general)
- **Desktop**: 3 fotos por categoría en 6 columnas
- **Tablet**: 3 fotos por categoría en 4 columnas
- **Móvil**: 3 fotos por categoría en 2-3 columnas

### Modo Categoría (una categoría seleccionada)
- Muestra **todas las fotos** de esa categoría
- Se adapta automáticamente al ancho de pantalla

---

## 🔧 Características Técnicas

### CSS Media Queries Implementadas
```
- 1024px (Tablet grande)
- 768px (Tablet)
- 480px (Móvil)
- 360px (Móvil muy pequeño)
```

### JavaScript Enhancements
- **Swipe detection**: Detecta deslizamientos en móvil
- **Touch support**: Compatible con pantallas táctiles
- **Responsive buttons**: Botones se adaptan al tamaño

---

## 📋 Testing en diferentes dispositivos

### Con Chrome DevTools (F12)
1. Abre: `Más herramientas` → `Herramientas para desarrolladores`
2. Click en el icono de móvil (arriba a la izquierda)
3. Elige: iPhone, iPad, Galaxy, etc.
4. Prueba el comportamiento

### Dispositivos reales
- Prueba en: Teléfono, Tablet, Laptop
- Gira la pantalla (portrait ↔ landscape)
- Cambia el zoom del navegador (Ctrl + +/-)

---

## 🎨 Ejemplo de responsividad

### Foto en Desktop (6 columnas)
```
[Foto] [Foto] [Foto] [Foto] [Foto] [Foto]
[Foto] [Foto] [Foto] [Foto] [Foto] [Foto]
[Foto] [Foto] [Foto] [Foto] [Foto] [Foto]
```

### Foto en Tablet (4 columnas)
```
[Foto]    [Foto]    [Foto]    [Foto]
[Foto]    [Foto]    [Foto]    [Foto]
[Foto]    [Foto]    [Foto]
```

### Foto en Móvil (2 columnas)
```
[Foto]  [Foto]
[Foto]  [Foto]
[Foto]  [Foto]
```

### Foto en Móvil pequeño (1 columna)
```
[Foto Completa]
[Foto Completa]
[Foto Completa]
```

---

## ✨ Ventajas de esta implementación

1. **Automático**: Se adapta sin hacer nada
2. **Rápido**: Sin JavaScript pesado para resize
3. **Offlline**: Funciona sin conexión (excepto fotos)
4. **Accesible**: Touch-friendly en móvil
5. **SEO**: Google lo detecta como responsive

---

## 🐛 Si algo no se ve bien

**En móvil el texto es muy pequeño:**
- Zoom: Pellizca la pantalla para agrandar (pinch-zoom)

**Las fotos se ven raras:**
- Refresca: Presiona F5 o swipe abajo

**Los botones del carrusel se ven pequeños:**
- En móvil son más grandes automáticamente
- Intenta en modo portrait (vertical)

---

¿Necesitas ajustar algo sobre la responsividad?
