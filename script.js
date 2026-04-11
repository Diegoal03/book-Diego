// =========================================================
// 1. INVENTARIO DE FOTOGRAFÍAS - AUTO DETECTADO
// =========================================================
// INSTRUCCIONES:
// 1. Asegúrate que Node.js esté instalado
// 2. Ejecuta en terminal: node generate-inventory.js
// 3. Esto genera automáticamente inventario-auto.js
// 4. Cada vez que agregues fotos nuevas, ejecuta el comando de nuevo

const misFotos = [];

// Cargar inventario automático si existe, si no usar fallback
function cargarInventario() {
    // Intenta usar el inventario auto-generado
    if (typeof CATEGORIAS_ACTIVAS !== 'undefined') {
        console.log('✅ Usando inventario auto-generado');
        CATEGORIAS_ACTIVAS.forEach(categoria => {
            categoria.archivos.forEach(archivo => {
                misFotos.push({
                    src: `fotografias/${categoria.cat}/${archivo}`,
                    cat: categoria.cat
                });
            });
        });
    } else {
        console.warn('⚠️ Inventario automático no encontrado. Ejecuta: node generate-inventory.js');
    }
    return misFotos;
}

// Inicializar inventario
cargarInventario();

// =========================================================
// 2. DICCIONARIO BILINGÜE
// =========================================================
const traducciones = {
    es: {
        bio: "Diego Alvarado captura la energía pura de la vida a través del lente — desde la vulnerabilidad íntima del retrato hasta la libertad rugiente de la cultura del motor, el pulso de las calles urbanas hasta la poesía silenciosa de la naturaleza. Con un ojo cinematográfico y alma de artista, Diego crea imágenes que no solo documentan momentos — sino que los sienten. Cada fotograma es una narrativa compuesta de luz, sombra y emoción humana auténtica.",
    },
    en: {
        bio: "Diego Alvarado captures the raw energy of life through the lens — from the intimate vulnerability of portrait work to the roaring freedom of motorcycle culture, the pulse of urban streets to the silent poetry of nature. With a cinematic eye and an artist's soul, Diego crafts images that don't just document moments — they feel them. Every frame is a narrative composed of light, shadow, and authentic human emotion.",
    }
};

let idiomaActual = 'es';
let slideIndex = 1; // Para el carrusel
let fotosActualesFiltradas = []; // Almacena las fotos del carrusel según el filtro activo
let categoriaActual = 'all'; // Rastrear la categoría actual para resetear el modal

// =========================================================
// 2.5. GENERAR BOTONES DE FILTRO DINÁMICAMENTE
// =========================================================
function generarBotonesFiltro() {
    const contenedor = document.getElementById('filter-container');
    contenedor.innerHTML = '';

    // Crear botón "Todo"
    const btnTodo = document.createElement('button');
    btnTodo.className = 'filter-btn active';
    btnTodo.setAttribute('onclick', "filterSelection('all')");
    btnTodo.setAttribute('data-es', 'Todo');
    btnTodo.setAttribute('data-en', 'All');
    btnTodo.textContent = 'Todo';
    contenedor.appendChild(btnTodo);

    // Crear botones para cada categoría que tenga fotos
    if (typeof CATEGORIAS_ACTIVAS !== 'undefined') {
        CATEGORIAS_ACTIVAS.forEach(categoria => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('onclick', `filterSelection('${categoria.cat}')`);
            btn.setAttribute('data-es', categoria.cat.charAt(0).toUpperCase() + categoria.cat.slice(1));
            btn.setAttribute('data-en', categoria.cat.charAt(0).toUpperCase() + categoria.cat.slice(1));
            btn.textContent = categoria.cat.charAt(0).toUpperCase() + categoria.cat.slice(1);
            contenedor.appendChild(btn);
        });
    }
}

// =========================================================
// 3. CARGA DE GALERÍA Y VISOR (CARRUSEL)
// =========================================================
function cargarGaleria() {
    const contenedor = document.getElementById('main-gallery');
    contenedor.innerHTML = '';
    const modalContent = document.getElementById('slideshow-content');
    // Limpiar slides antiguos, pero mantener botones prev/next
    const oldSlides = modalContent.querySelectorAll('.mySlides');
    oldSlides.forEach(slide => slide.remove());

    misFotos.forEach((foto, index) => {
        // Generar la galería Grid
        const divGrid = document.createElement('div');
        divGrid.className = `gallery-item ${foto.cat}`;
        divGrid.innerHTML = `<img src="${foto.src}" alt="Diego Alvarado Photography" loading="lazy">`;
        contenedor.appendChild(divGrid);

        // Generar las diapositivas del carrusel (inicialmente ocultas)
        const divSlide = document.createElement('div');
        divSlide.className = `mySlides ${foto.cat}`;
        divSlide.innerHTML = `<img src="${foto.src}" alt="Diego Alvarado Slideshow">`;
        modalContent.insertBefore(divSlide, modalContent.firstChild);
    });
    
    // Al cargar por primera vez, mostramos "Todo" (3 de cada una)
    filterSelection('all');

    // Añadir el evento click a las imágenes del grid DESPUÉS de cargarlas
    const gridImgs = contenedor.querySelectorAll('.gallery-item img');
    gridImgs.forEach(img => {
        img.addEventListener('click', () => {
            const src = img.getAttribute('src');
            openViewer(src);
        });
    });
}

// =========================================================
// 4. FILTRADO LÓGICO (Todo: 3 fotos / Categoría: Todas)
// =========================================================
function filterSelection(c) {
    // Si el modal está abierto y cambia el filtro, cerrarlo
    const modal = document.getElementById("image-viewer");
    if (modal && modal.style.display === "flex") {
        closeViewer();
    }

    // Si la categoría cambió, reiniciar slideIndex
    if (categoriaActual !== c) {
        slideIndex = 1;
        categoriaActual = c;
    }

    const items = document.getElementsByClassName("gallery-item");
    const slides = document.getElementsByClassName("mySlides");
    const btns = document.getElementsByClassName("filter-btn");

    // Crear contadores dinámicos basados en categorías encontradas
    let conteoGrid = {};
    if (typeof CATEGORIAS_ACTIVAS !== 'undefined') {
        CATEGORIAS_ACTIVAS.forEach(cat => {
            conteoGrid[cat.cat] = 0;
        });
    }

    // Mostrar items según filtro
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("show");
        let catItem = items[i].className.split(' ')[1];

        if (c === 'all') {
            // En modo "Todo", mostrar 3 de cada categoría
            if (conteoGrid[catItem] !== undefined && conteoGrid[catItem] < 3) {
                items[i].classList.add("show");
                conteoGrid[catItem]++;
            }
        } else {
            // Mostrar todas las fotos de la categoría seleccionada
            if (items[i].classList.contains(c)) {
                items[i].classList.add("show");
            }
        }
    }

    // Filtrar también los Slides del Carrusel
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("filtrado-activo");
        if (c === 'all') {
            slides[i].classList.add("filtrado-activo");
        } else if (slides[i].classList.contains(c)) {
            slides[i].classList.add("filtrado-activo");
        }
    }

    // Actualizar estilo de botones
    for (let b of btns) {
        b.classList.remove("active");
        if (b.innerText.toLowerCase() === c.toLowerCase() || (c === 'all' && b.innerText.toLowerCase() === 'todo')) {
            b.classList.add("active");
        }
    }
}

// =========================================================
// 5. LÓGICA DEL VISOR (CARRUSEL SLIDER)
// =========================================================
function openViewer(src) {
    const modal = document.getElementById("image-viewer");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Bloquear scroll de fondo

    // Encontrar el índice de la foto que se hizo click dentro de los slides filtrados
    const currentSlides = document.querySelectorAll('.mySlides.filtrado-activo');
    let targetIndex = 1;
    currentSlides.forEach((slide, index) => {
        if (slide.querySelector('img').getAttribute('src') === src) {
            targetIndex = index + 1;
        }
    });

    // Reiniciar el slideIndex a la foto que se hizo click
    slideIndex = 1;
    currentSlide(targetIndex);
}

function closeViewer() {
    document.getElementById("image-viewer").style.display = "none";
    document.body.style.overflow = "auto"; // Restaurar scroll
}

// =========================================================
// SOPORTE PARA GESTOS DE SWIPE EN MÓVIL
// =========================================================
let touchStartX = 0;
let touchEndX = 0;

const modal = document.getElementById("image-viewer");

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    detectarSwipe();
}, false);

function detectarSwipe() {
    const diferencia = touchStartX - touchEndX;
    const umbral = 50; // Mínima distancia para detectar swipe

    if (diferencia > umbral) {
        // Swipe hacia la izquierda = siguiente foto
        plusSlides(1);
    } else if (diferencia < -umbral) {
        // Swipe hacia la derecha = foto anterior
        plusSlides(-1);
    }
}

// Controles del Carrusel
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    // Solo operamos sobre las diapositivas que pasaron el filtro activo
    const slides = document.querySelectorAll('.mySlides.filtrado-activo');
    if (slides.length === 0) return; // Si no hay fotos de esa categoría, no hacer nada

    // Validar y ajustar el índice
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Ocultar TODOS los slides primero (importante para evitar mostrar múltiples)
    const allSlides = document.querySelectorAll('.mySlides');
    for (i = 0; i < allSlides.length; i++) {
        allSlides[i].style.display = "none";
    }
    
    // Mostrar solo el slide actual filtrado
    if (slideIndex > 0 && slideIndex <= slides.length) {
        slides[slideIndex - 1].style.display = "block";
    }
}

// Soporte para flechas del teclado
document.addEventListener('keydown', (e) => {
    if (document.getElementById("image-viewer").style.display === "flex") {
        if (e.key === "ArrowLeft") plusSlides(-1);
        if (e.key === "ArrowRight") plusSlides(1);
        if (e.key === "Escape") closeViewer();
    }
});

// =========================================================
// 6. TRADUCCIÓN COMPLETA
// =========================================================
function cambiarIdioma() {
    idiomaActual = (idiomaActual === 'es') ? 'en' : 'es';
    document.getElementById('lang-switch').innerText = (idiomaActual === 'es') ? 'EN' : 'ES';

    document.querySelectorAll('[data-es]').forEach(el => {
        el.innerText = el.getAttribute(`data-${idiomaActual}`);
    });

    // Traducir Placeholders del Formulario
    document.querySelectorAll('input, textarea').forEach(el => {
        if (el.hasAttribute(`data-${idiomaActual}-placeholder`)) {
            el.placeholder = el.getAttribute(`data-${idiomaActual}-placeholder`);
        }
    });

    document.getElementById('bio-text').innerText = traducciones[idiomaActual].bio;
}

// =========================================================
// 7. INICIALIZACIÓN
// =========================================================
document.getElementById('lang-switch').addEventListener('click', cambiarIdioma);

window.onload = () => {
    generarBotonesFiltro(); // Generar botones dinámicos solo para carpetas con fotos
    cargarGaleria();
    document.getElementById('bio-text').innerText = traducciones.es.bio;
};