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

// =========================================================
// NÚMERO DE WHATSAPP
// =========================================================
// Escribe aquí tu número con código de país, sin espacios, signos ni "+".
// Ejemplo Colombia: "573001234567"  |  Ejemplo Canadá: "14165551234"
// Mientras esté vacío, el botón de WhatsApp permanece oculto en la web.
const WHATSAPP_NUMBER = "";

let idiomaActual = 'es';
let slideIndex = 1; // Para el visor de pantalla completa
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
// 3. CARGA DEL CARRUSEL Y DEL VISOR DE PANTALLA COMPLETA
// =========================================================
function cargarGaleria() {
    const contenedor = document.getElementById('main-gallery');
    contenedor.innerHTML = '';
    const modalContent = document.getElementById('slideshow-content');
    // Limpiar slides antiguos, pero mantener botones prev/next
    const oldSlides = modalContent.querySelectorAll('.mySlides');
    oldSlides.forEach(slide => slide.remove());

    misFotos.forEach((foto, index) => {
        // Generar la diapositiva del carrusel horizontal
        const divCarrusel = document.createElement('div');
        divCarrusel.className = `carousel-slide ${foto.cat}`;
        divCarrusel.dataset.cat = foto.cat;
        divCarrusel.setAttribute('data-cat-label', foto.cat.charAt(0).toUpperCase() + foto.cat.slice(1));
        divCarrusel.innerHTML = `<img src="${foto.src}" alt="Fotografía de ${foto.cat} por Diego Alvarado" loading="lazy" decoding="async">`;
        contenedor.appendChild(divCarrusel);

        // Generar las diapositivas del visor de pantalla completa (SIN cargar la imagen todavía;
        // solo se descarga cuando el usuario realmente la abre, para no saturar la carga inicial)
        const divSlide = document.createElement('div');
        divSlide.className = `mySlides ${foto.cat}`;
        divSlide.innerHTML = `<img data-src="${foto.src}" alt="Fotografía de ${foto.cat} por Diego Alvarado, vista ampliada">`;

        // Buscar el último elemento .mySlides para insertarlo después, o al inicio del contenedor
        const lastSlide = modalContent.querySelector('.mySlides:last-of-type');
        if (lastSlide) {
            lastSlide.parentNode.insertBefore(divSlide, lastSlide.nextSibling);
        } else {
            modalContent.insertBefore(divSlide, modalContent.firstChild);
        }
    });

    // Al cargar por primera vez, mostramos "Todo"
    filterSelection('all');

    // Añadir el evento click a las fotos del carrusel DESPUÉS de cargarlas
    const carruselImgs = contenedor.querySelectorAll('.carousel-slide img');
    carruselImgs.forEach(img => {
        img.addEventListener('click', () => {
            const src = img.getAttribute('src');
            openViewer(src);
        });
    });
}

// =========================================================
// 4. FILTRADO LÓGICO (Todo o por categoría)
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

    const items = document.getElementsByClassName("carousel-slide");
    const slides = document.getElementsByClassName("mySlides");
    const btns = document.getElementsByClassName("filter-btn");

    // Mostrar diapositivas del carrusel según filtro
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("show", "active");
        if (c === 'all' || items[i].dataset.cat === c) {
            items[i].classList.add("show");
        }
    }

    // Filtrar también las diapositivas del visor de pantalla completa
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

    // Reiniciar el carrusel con el nuevo subconjunto de fotos visibles
    iniciarCarrusel();
}

// =========================================================
// 4.5. CARRUSEL AUTOMÁTICO DE FOTOGRAFÍAS
// =========================================================
// Ventana fija de 4 fotos: la 2ª de izquierda a derecha es siempre la
// resaltada. Se mueve con "transform" sobre .carousel-track — NUNCA con
// scrollIntoView ni con el scroll del documento — por eso el movimiento del
// carrusel jamás interfiere con la parte de la página en la que estés.
let carruselIntervalId = null;
let carruselSlides = [];
let carruselInicio = 0;
let carruselPausado = false;
let carruselReanudarTimeout = null;
let carruselListenersListos = false;
let carruselResizeTimeout = null;

function detenerCarrusel() {
    if (carruselIntervalId) clearInterval(carruselIntervalId);
    carruselIntervalId = null;
}

function medirPasoCarrusel(track) {
    if (carruselSlides.length === 0) return 0;
    const anchoSlide = carruselSlides[0].getBoundingClientRect().width;
    const estilos = getComputedStyle(track);
    const gapPx = parseFloat(estilos.columnGap || estilos.gap || '0') || 0;
    return anchoSlide + gapPx;
}

function posicionarCarrusel() {
    const track = document.getElementById('main-gallery');
    if (!track || carruselSlides.length === 0) return;
    const paso = medirPasoCarrusel(track);
    track.style.transform = `translateX(-${carruselInicio * paso}px)`;

    const indiceActivo = (carruselInicio + 1) % carruselSlides.length;
    carruselSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === indiceActivo);
    });
}

function avanzarVentanaCarrusel(direccion) {
    if (carruselSlides.length === 0) return;
    // Cuántas posiciones de inicio son válidas para que siempre quepan 4 fotos
    const totalPosiciones = Math.max(1, carruselSlides.length - 3);
    carruselInicio = (carruselInicio + direccion + totalPosiciones) % totalPosiciones;
    posicionarCarrusel();
}

function iniciarCarrusel() {
    detenerCarrusel();
    const track = document.getElementById('main-gallery');
    if (!track) return;

    carruselSlides = Array.from(track.querySelectorAll('.carousel-slide.show'));
    carruselInicio = 0;
    if (carruselSlides.length === 0) return;

    posicionarCarrusel();

    if (carruselSlides.length > 4) {
        carruselIntervalId = setInterval(() => {
            if (carruselPausado) return;
            avanzarVentanaCarrusel(1);
        }, 2000);
    }

    inicializarInteraccionCarrusel();
}

function irASlideCarrusel(direccion) {
    avanzarVentanaCarrusel(direccion);
    carruselPausado = true;
    if (carruselReanudarTimeout) clearTimeout(carruselReanudarTimeout);
    carruselReanudarTimeout = setTimeout(() => { carruselPausado = false; }, 10000);
}

// Escuchar arrastre/swipe y pausar el avance automático 10s tras cualquier
// interacción manual. Se registra UNA sola vez (no en cada cambio de filtro).
function inicializarInteraccionCarrusel() {
    if (carruselListenersListos) return;
    const track = document.getElementById('main-gallery');
    const viewport = track ? track.parentElement : null;
    if (!viewport) return;

    const pausarTemporal = () => {
        carruselPausado = true;
        if (carruselReanudarTimeout) clearTimeout(carruselReanudarTimeout);
        carruselReanudarTimeout = setTimeout(() => { carruselPausado = false; }, 10000);
    };

    let touchStartX = 0;
    viewport.addEventListener('pointerdown', pausarTemporal);
    viewport.addEventListener('wheel', pausarTemporal, { passive: true });
    viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pausarTemporal();
    }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
        const diferencia = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diferencia) > 40) {
            avanzarVentanaCarrusel(diferencia > 0 ? 1 : -1);
        }
    }, { passive: true });

    carruselListenersListos = true;
}

// Recalcular la posición si cambia el tamaño de ventana (los anchos de las
// fotos son responsive), sin reiniciar el índice ni el temporizador
window.addEventListener('resize', () => {
    if (carruselResizeTimeout) clearTimeout(carruselResizeTimeout);
    carruselResizeTimeout = setTimeout(posicionarCarrusel, 150);
});

// =========================================================
// 5. LÓGICA DEL VISOR DE PANTALLA COMPLETA
// =========================================================

// Activa la carga real de la imagen (data-src -> src) solo cuando la diapositiva
// se necesita, en vez de descargar las 44 fotos completas al abrir la página
function activarImagenSlide(slide) {
    if (!slide) return;
    const img = slide.querySelector('img');
    if (img && !img.getAttribute('src') && img.dataset.src) {
        img.src = img.dataset.src;
    }
}

function openViewer(src) {
    const modal = document.getElementById("image-viewer");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Encontrar el índice de la foto que se hizo click dentro de los slides filtrados
    const currentSlides = document.querySelectorAll('.mySlides.filtrado-activo');
    let targetIndex = 1;
    currentSlides.forEach((slide, index) => {
        if (slide.querySelector('img').getAttribute('src') === src) {
            targetIndex = index + 1;
        }
    });

    console.log('🖼️ openViewer - Total slides filtrados:', currentSlides.length, 'Target index:', targetIndex);

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

if (modal) {
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        detectarSwipe();
    }, false);
}

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
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    console.log('📊 showSlides - slideIndex:', slideIndex, 'Total slides filtrados:', slides.length);

    // PRIMERO: Ocultar TODOS los slides (sin excepción)
    const allSlides = document.querySelectorAll('.mySlides');
    console.log('🔍 Total slides en el DOM:', allSlides.length);
    allSlides.forEach(slide => {
        slide.style.display = "none";
    });

    // SEGUNDA: Mostrar SOLO el slide actual del conjunto filtrado
    if (slideIndex > 0 && slideIndex <= slides.length) {
        slides[slideIndex - 1].style.display = "block";
        activarImagenSlide(slides[slideIndex - 1]);
        // Precargar la siguiente para que el avance se sienta instantáneo
        activarImagenSlide(slides[slideIndex % slides.length]);
        console.log('✅ Mostrando slide:', slideIndex, 'de', slides.length);
    }
}

// Soporte para flechas del teclado
document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById("image-viewer");
    if (viewer && viewer.style.display === "flex") {
        if (e.key === "ArrowLeft") plusSlides(-1);
        if (e.key === "ArrowRight") plusSlides(1);
        if (e.key === "Escape") closeViewer();
    }
});

// =========================================================
// 5.5. SELECTOR DE TIPO DE CONTENIDO (FOTOGRAFÍA / VIDEO)
// =========================================================
function seleccionarTipoContenido(tipo) {
    const btnFotos = document.getElementById('selector-fotos');
    const btnVideos = document.getElementById('selector-videos');
    const panelFotos = document.getElementById('fotografia-panel');
    const panelVideos = document.getElementById('video-panel');
    if (!btnFotos || !btnVideos || !panelFotos || !panelVideos) return;

    if (tipo === 'videos') {
        btnVideos.classList.add('active');
        btnFotos.classList.remove('active');
        panelVideos.classList.add('show');
        panelFotos.classList.remove('show');
        renderizarVideos();
    } else {
        btnFotos.classList.add('active');
        btnVideos.classList.remove('active');
        panelFotos.classList.add('show');
        panelVideos.classList.remove('show');
    }
}

// =========================================================
// 5.6. VIDEOS DESTACADOS DE INSTAGRAM (carga diferida)
// =========================================================
let videosRenderizados = false;

function renderizarVideos() {
    const grid = document.getElementById('video-grid');
    if (!grid) return;

    // Si ya se renderizaron antes, solo re-procesamos los embeds (por si el panel estaba oculto)
    if (videosRenderizados) {
        if (window.instgrm) window.instgrm.Embeds.process();
        return;
    }

    const lista = (typeof VIDEOS_DESTACADOS !== 'undefined') ? VIDEOS_DESTACADOS : [];

    if (lista.length === 0) {
        const emptyEs = "Aún no hay videos destacados aquí. Muy pronto voy a compartir mis mejores Reels de Instagram.";
        const emptyEn = "No featured videos here yet. My best Instagram Reels are coming soon.";
        const btnEs = "Ver en Instagram";
        const btnEn = "View on Instagram";
        grid.innerHTML = `
            <div class="video-empty">
                <p data-es="${emptyEs}" data-en="${emptyEn}">${idiomaActual === 'es' ? emptyEs : emptyEn}</p>
                <a href="https://www.instagram.com/dieguito.rak/" target="_blank" rel="noopener" class="btn btn-ghost" data-es="${btnEs}" data-en="${btnEn}">${idiomaActual === 'es' ? btnEs : btnEn}</a>
            </div>`;
        videosRenderizados = true;
        return;
    }

    grid.innerHTML = lista.map(video => `
        <blockquote class="instagram-media" data-instgrm-permalink="${video.url}" data-instgrm-version="14"></blockquote>
    `).join('');

    // Cargar el script oficial de embeds de Instagram una sola vez
    if (!document.getElementById('ig-embed-script')) {
        const s = document.createElement('script');
        s.id = 'ig-embed-script';
        s.async = true;
        s.src = 'https://www.instagram.com/embed.js';
        s.onload = () => { if (window.instgrm) window.instgrm.Embeds.process(); };
        document.body.appendChild(s);
    } else if (window.instgrm) {
        window.instgrm.Embeds.process();
    }

    videosRenderizados = true;
}

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

    const bioTextEl = document.getElementById('bio-text');
    if (bioTextEl) bioTextEl.innerText = traducciones[idiomaActual].bio;

    actualizarWhatsapp();
}

// =========================================================
// 6.3. BOTÓN(ES) DE WHATSAPP
// =========================================================
function actualizarWhatsapp() {
    if (!WHATSAPP_NUMBER) return; // Sin número configurado, los botones quedan ocultos

    document.querySelectorAll('#whatsapp-float, #whatsapp-social-link').forEach(el => {
        const mensaje = idiomaActual === 'es'
            ? (el.getAttribute('data-msg-es') || 'Hola Diego, vi tu portafolio y me gustaría hablar sobre una colaboración.')
            : (el.getAttribute('data-msg-en') || 'Hi Diego, I saw your portfolio and would like to talk about a collaboration.');
        el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
        el.hidden = false;
    });
}

// =========================================================
// 6.4. ENVÍO DEL FORMULARIO DE CONTACTO (sin salir de la página)
// =========================================================
function inicializarFormularioContacto() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('form-submit');
        const successBox = document.getElementById('form-success');
        const textoOriginal = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = idiomaActual === 'es' ? 'Enviando...' : 'Sending...';

        try {
            const respuesta = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (respuesta.ok) {
                form.hidden = true;
                if (successBox) successBox.hidden = false;
            } else {
                throw new Error('Formspree respondió con error');
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerText = textoOriginal;
            const mensajeError = idiomaActual === 'es'
                ? 'Hubo un problema al enviar el mensaje. Intenta de nuevo o escríbeme directo por Instagram o WhatsApp.'
                : 'There was a problem sending your message. Please try again or message me directly on Instagram or WhatsApp.';
            alert(mensajeError);
        }
    });
}

// =========================================================
// 6.5. MENÚ HAMBURGUESA (móvil)
// =========================================================
function cerrarMenuMovil() {
    const navRight = document.getElementById('nav-right');
    const navToggle = document.getElementById('nav-toggle');
    const backdrop = document.getElementById('nav-backdrop');
    if (!navRight || !navToggle) return;
    navRight.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerText = '☰';
    if (backdrop) backdrop.classList.remove('show');
    document.body.style.overflow = '';
}

(function inicializarMenuMovil() {
    const navToggle = document.getElementById('nav-toggle');
    const navRight = document.getElementById('nav-right');
    const backdrop = document.getElementById('nav-backdrop');
    if (!navToggle || !navRight) return;

    navToggle.addEventListener('click', () => {
        const abrira = !navRight.classList.contains('open');
        navRight.classList.toggle('open', abrira);
        navToggle.setAttribute('aria-expanded', abrira ? 'true' : 'false');
        navToggle.innerText = abrira ? '✕' : '☰';
        if (backdrop) backdrop.classList.toggle('show', abrira);
        document.body.style.overflow = abrira ? 'hidden' : '';
    });

    if (backdrop) backdrop.addEventListener('click', cerrarMenuMovil);
    navRight.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', cerrarMenuMovil);
    });
})();

// =========================================================
// 7. INICIALIZACIÓN
// =========================================================
const langSwitchBtn = document.getElementById('lang-switch');
if (langSwitchBtn) langSwitchBtn.addEventListener('click', cambiarIdioma);

const carruselPrevBtn = document.getElementById('carousel-prev');
const carruselNextBtn = document.getElementById('carousel-next');
if (carruselPrevBtn) carruselPrevBtn.addEventListener('click', () => irASlideCarrusel(-1));
if (carruselNextBtn) carruselNextBtn.addEventListener('click', () => irASlideCarrusel(1));

window.onload = () => {
    // La galería solo existe en la página principal (index.html)
    if (document.getElementById('filter-container') && document.getElementById('main-gallery')) {
        generarBotonesFiltro(); // Generar botones dinámicos solo para carpetas con fotos
        cargarGaleria();
    }

    const bioEl = document.getElementById('bio-text');
    if (bioEl) bioEl.innerText = traducciones.es.bio;

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    actualizarWhatsapp();
    inicializarFormularioContacto();
};
