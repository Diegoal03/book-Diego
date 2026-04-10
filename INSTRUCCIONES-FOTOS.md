# Sistema Automático de Inventario de Fotos

Este sistema detecta automáticamente las carpetas con fotos y las muestra en la página web. **No necesitas actualizar números manualmente.**

## ¿Cómo funciona?

1. **Detecta carpetas**: Escanea la carpeta `/fotografias` y busca subcarpetas
2. **Solo muestra carpetas con fotos**: Las carpetas vacías se ignoran automáticamente
3. **Reconoce fotos nuevas**: Cuando agregas fotos a una carpeta existente, el sistema las detecta

## Instrucciones para agregar fotos nuevas

### Opción 1: Usando Python (Recomendado)

Si tienes Python 3 instalado:

```bash
python3 generate-inventory.py
```

Esto escanea automáticamente todas las carpetas y genera el archivo `inventario-auto.js`.

**Ejecuta este comando cada vez que:**
- Agregues fotos nuevas a una carpeta existente
- Crees una carpeta nueva con fotos
- Elimines fotos de una carpeta

### Opción 2: Edición manual

Si prefieres editar manualmente, abre `inventario-auto.js` y agrega tu categoría:

```javascript
{
    "cat": "tu-categoria",
    "archivos": [
        "foto (1).jpg",
        "foto (2).jpg",
        "foto (3).jpg"
        // ... más fotos
    ]
}
```

## Estructura de carpetas esperada

```
fotografias/
├── motor/
│   ├── foto (1).jpg
│   ├── foto (2).jpg
│   └── ...
├── retrato/
│   ├── foto (1).jpg
│   ├── foto (2).jpg
│   └── ...
├── naturaleza/
│   ├── foto (1).png
│   ├── foto (2).png
│   └── ...
└── urbano/
    ├── foto (1).jpg
    ├── foto (2).jpg
    └── ...
```

## Formatos soportados

El sistema reconoce automáticamente estos formatos:
- `*.jpg` / `*.jpeg`
- `*.png`
- `*.gif`
- `*.webp`

## Ejemplos de nombres de archivo

El sistema es flexible con los nombres:
- `foto (1).jpg` ✅
- `foto1.jpg` ✅
- `imagen-1.png` ✅
- `vacation.jpg` ✅

## Filtros automáticos

Las categorías detectadas aparecen automáticamente en los filtros:
- Si creas una carpeta "viajes" y agregas fotos, aparecerá un botón "Viajes" en el sitio
- Si eliminas todas las fotos de una carpeta, desaparece de los filtros

## Troubleshooting

**P: Agregué fotos pero no aparecen**
R: Ejecuta `python3 generate-inventory.py` para actualizar el inventario

**P: Python no está instalado**
R: Ve a https://www.python.org/downloads/ e instala Python 3

**P: Tengo una carpeta vacía que no quiero mostrar**
R: El sistema ignora automáticamente las carpetas sin imágenes. No necesitas hacer nada.

**P: ¿Cómo creo una categoría nueva?**
R: Simplemente crea una carpeta en `/fotografias/` con un nombre (ej: `viajes/`), agrega fotos, y ejecuta `python3 generate-inventory.py`

## Archivos del sistema

- `generate-inventory.py` - Script que escanea carpetas y genera el inventario
- `inventario-auto.js` - Archivo generado automáticamente (NO EDITAR si usas Python)
- `script.js` - Lógica principal (no necesitas tocar)
- `index.html` - Incluye automáticamente `inventario-auto.js`

---

**Última actualización**: El inventario se genera automáticamente desde Python. Siempre ejecuta `python3 generate-inventory.py` después de agregar/eliminar fotos.
