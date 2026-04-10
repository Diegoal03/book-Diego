# 🖼️ GUÍA SIMPLE - Sistema de Fotos

## ¿Qué pasa cuando abres la web?

```
Tu navegador abre: index.html
        ↓
Carga: inventario-auto.js  (lista de fotos)
        ↓
Carga: script.js  (muestra las fotos)
        ↓
¡Ves las fotos en la página!
```

---

## PASO 1️⃣ - Agregar fotos nuevas

### Ejemplo: Quiero agregar fotos en la carpeta "motor"

1. Abre esta carpeta en tu computadora:
   ```
   C:\Users\USER\Documents\portfolio-website-diegoalvarado\fotografias\motor
   ```

2. Agrega tus fotos aquí (cualquier nombre está bien):
   ```
   foto (16).jpg
   foto (17).jpg
   foto (18).jpg
   ```

---

## PASO 2️⃣ - Actualizar la lista (IMPORTANTE)

Después de agregar fotos, **DEBES** ejecutar un comando:

### En Windows (Línea de comandos):

1. Abre: `Inicio` → Escribe `cmd` → Presiona Enter

2. Copia y pega esto:
   ```
   cd C:\Users\USER\Documents\portfolio-website-diegoalvarado
   python3 generate-inventory.py
   ```

3. Presiona Enter

**Debería decir:**
```
✅ motor: 18 imágenes
✅ retrato: 11 imágenes
✅ naturaleza: 9 imágenes
✅ urbano: 7 imágenes

✅ Archivo generado: inventario-auto.js
```

---

## PASO 3️⃣ - ¡Listo!

Ahora:
1. Recarga la página web (F5)
2. ¡Las fotos nuevas aparecerán!

---

## Resumen en 3 pasos

| Paso | Qué hacer |
|------|-----------|
| 1 | Agrega fotos a una carpeta en `/fotografias/` |
| 2 | Abre `cmd` y ejecuta: `python3 generate-inventory.py` |
| 3 | Recarga la web (F5) |

---

## ❓ Respuestas rápidas

**P: ¿Qué pasa si no ejecuto el comando?**
R: Las fotos nuevas no aparecerán en la web. Siempre debes ejecutar el comando.

**P: ¿Puedo crear una carpeta nueva? (ej: "viajes")**
R: Sí, pero después ejecuta el comando para que aparezca en los filtros.

**P: ¿Qué pasa si borro una foto?**
R: Ejecuta el comando de nuevo para actualizar.

**P: No tengo Python instalado**
R: Descárgalo: https://www.python.org/downloads/

---

## El comando en detalle

```
python3 generate-inventory.py
```

Este comando:
- 📁 Busca todas las carpetas en `/fotografias/`
- 📸 Cuenta cuántas fotos hay en cada una
- ✍️ Actualiza automáticamente el archivo `inventario-auto.js`
- ✅ Listo para que la web muestre las fotos nuevas

---

## Ejemplo práctico completo

### Quiero agregar 5 fotos nuevas de "motor"

**Paso 1: Agregar fotos**
```
C:\Users\USER\Documents\portfolio-website-diegoalvarado\fotografias\motor\
├── foto (1).jpg    ← Already exists
├── ...
├── foto (15).jpg   ← Already exists
├── foto (16).jpg   ← NEW ✨
├── foto (17).jpg   ← NEW ✨
├── foto (18).jpg   ← NEW ✨
├── foto (19).jpg   ← NEW ✨
└── foto (20).jpg   ← NEW ✨
```

**Paso 2: Abrir Terminal**
```
Inicio → cmd → Enter
```

**Paso 3: Ejecutar comando**
```
cd C:\Users\USER\Documents\portfolio-website-diegoalvarado
python3 generate-inventory.py
```

**Verás:**
```
✅ motor: 20 imágenes
✅ retrato: 11 imágenes
✅ naturaleza: 9 imágenes
✅ urbano: 7 imágenes

✅ Archivo generado: inventario-auto.js
```

**Paso 4: Recargar web**
- Aprieta F5 en el navegador
- ¡Las 5 fotos nuevas aparecen!

---

¿Entendiste mejor? ¿Necesitas ayuda con algún paso?
